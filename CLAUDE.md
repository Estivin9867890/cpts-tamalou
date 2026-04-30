# CLAUDE.md — Annuaire CPTS Tamalou

Fichier de contexte pour IA. Lit ce fichier avant toute intervention sur le projet.

---

## 1. Qu'est-ce que ce projet ?

Application web **annuaire de professionnels de santé** pour la CPTS (Communauté Professionnelle Territoriale de Santé) Tamalou, couvrant le **Finistère, France**. Elle permet aux professionnels de santé de se trouver entre eux, de consulter les compétences, pathologies prises en charge et disponibilités de leurs confrères.

**Public cible :** ~600 professionnels de santé (médecins, infirmières, kinés, etc.) + administrateurs CPTS.  
**Statut :** MVP avec données mockées — pas encore connecté à Supabase.

---

## 2. Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| Next.js | 15 (App Router) | Framework principal |
| React | 19 | UI |
| TypeScript | strict | Typage |
| Tailwind CSS | v4 | Styles (config via `@import "tailwindcss"` dans globals.css, PAS de tailwind.config.js) |
| react-leaflet | 4.2.1 | Carte interactive |
| Leaflet | latest | Moteur de carte (CartoDB Voyager tiles) |
| Framer Motion | latest | Animations (disponible mais peu utilisé pour l'instant) |
| clsx | latest | Classes conditionnelles |

### Points techniques critiques

- **Tailwind v4** : config CSS-first. Pas de `tailwind.config.js`. Les classes custom se définissent dans `globals.css`.
- **react-leaflet v4** nécessite `legacy-peer-deps=true` (fichier `.npmrc` présent) car il déclare `peerDependency: react@^18` alors qu'on est sur react@19.
- **SSR Leaflet** : la carte ne peut pas être rendue côté serveur. `MapView.tsx` wrape `MapInner.tsx` avec `dynamic(() => import('./MapInner'), { ssr: false })`.
- **StrictMode désactivé** (`reactStrictMode: false` dans `next.config.ts`) pour éviter le bug "Map container is already initialized" de Leaflet en dev.
- **z-index Leaflet** : `.leaflet-container` a `isolation: isolate` dans `globals.css` pour empêcher les panes internes (z-index 400–800) de passer au-dessus du Header.
- **Params dynamiques Next.js 15** : utiliser `use(params)` (hook React) pour déballer les params dans les pages `[id]`, pas de destructuring direct.

---

## 3. Architecture des fichiers

```
src/
├── types/index.ts              # Tous les types TypeScript du projet
├── data/mockData.ts            # Toutes les données mockées + fonctions getById
├── providers/
│   └── AuthProvider.tsx        # Contexte auth (mock, localStorage)
├── app/
│   ├── layout.tsx              # RootLayout + AuthProvider
│   ├── globals.css             # Tailwind v4 + overrides Leaflet + animations
│   ├── page.tsx                # Dashboard (page d'accueil après connexion)
│   ├── connexion/page.tsx      # Page de login
│   ├── mon-profil/page.tsx     # Profil éditable (MEDECIN uniquement)
│   ├── recherche/
│   │   ├── competence/page.tsx # Recherche par compétence + carte Leaflet
│   │   ├── pathologie/page.tsx # Recherche par pathologie
│   │   └── nom/page.tsx        # Recherche par nom / structure
│   ├── annuaire/
│   │   ├── professionnels/page.tsx     # Liste filtrée de tous les pros
│   │   ├── professionnel/[id]/page.tsx # Fiche détaillée d'un pro
│   │   ├── structures/page.tsx         # Liste des structures
│   │   └── structure/[id]/page.tsx     # Fiche d'une structure
│   └── admin/
│       ├── page.tsx                    # Dashboard admin
│       ├── professionnels/page.tsx     # Gestion des fiches pros
│       ├── utilisateurs/page.tsx       # Gestion des comptes
│       └── referentiels/page.tsx       # Compétences / Pathologies / Spécialités
└── components/
    ├── layout/
    │   ├── AppLayout.tsx       # Guard auth + layout avec Header
    │   ├── Header.tsx          # Nav fixe avec menus déroulants
    │   └── Breadcrumb.tsx      # Fil d'Ariane accessible (aria-current)
    ├── map/
    │   ├── MapView.tsx         # Wrapper SSR-safe (dynamic import)
    │   └── MapInner.tsx        # Composant Leaflet réel
    └── professionals/
        └── ProfessionalCard.tsx # Carte résumé d'un professionnel
```

---

## 4. Modèle de données (types TypeScript)

```typescript
// src/types/index.ts

type Role = 'ADMIN' | 'MEDECIN' | 'AUTRE_PRO'
type Secteur = '1' | '2' | '3' | 'NON_CONVENTIONNE'
type TypeStructure = 'CABINET_LIBERAL' | 'HOPITAL' | 'CLINIQUE' | 'MSP' | 'CPTS' | 'EHPAD' | 'AUTRE'

interface Utilisateur {
  id: string; nom: string; prenom: string; email: string
  role: Role; avatar: string; id_professionnel?: string
}

interface Specialite { id: string; libelle: string; code?: string }

interface Competence {
  id: string; libelle: string; categorie: string; est_active: boolean
}

interface Pathologie {
  id: string; libelle: string; code_cim10?: string; categorie: string; est_active: boolean
}

interface Structure {
  id: string; nom: string; type_structure: TypeStructure
  telephone: string; email_contact?: string; site_web?: string
  adresse: string; code_postal: string; ville: string
  lat: number; lng: number; est_active: boolean
}

interface ProfessionnelCompetence { id_competence: string; est_certifie: boolean }
interface ProfessionnelPathologie { id_pathologie: string; type_prise_en_charge: string }
interface ExerciceStructure {
  id_structure: string; est_principal: boolean
  jours_presence: string; heure_debut: string; heure_fin: string; role_au_sein?: string
}

interface Professionnel {
  id: string; nom: string; prenom: string; titre?: string; numero_rpps?: string
  id_specialite: string; photo_url?: string; presentation?: string
  telephone_standard: string
  telephone_direct?: string       // DONNÉE RESTREINTE — voir règle métier RG-FP-03
  email_professionnel?: string    // DONNÉE RESTREINTE — voir règle métier RG-FP-04
  langues_parlees?: string; secteur_conventionnement?: Secteur
  accepte_nouveaux_patients?: boolean; teleconsultation: boolean
  competences: ProfessionnelCompetence[]
  pathologies: ProfessionnelPathologie[]
  structures: ExerciceStructure[]
  lat: number; lng: number; est_actif: boolean; date_mise_a_jour: string
}
```

---

## 5. Données mockées (`src/data/mockData.ts`)

| Entité | Quantité | Notes |
|---|---|---|
| Spécialités | 10 | MG, Cardio, Pneumo, Endo, Psy, Géria, Infirmier, Kiné, Pharma, Diét. |
| Compétences | 15 | Catégories : Prévention, Spécifique, Coordination, Addictologie, Technique |
| Pathologies | 20 | Codes CIM-10, catégories : Cardiovasculaire, Psychiatrique, Neurologique… |
| Structures | 8 | CHU Brest, MSP Landerneau, Cabinet Centre-Brest, Polyclinique Keraudren, CH Morlaix, MSP Quimper, Centre St-Marc, EHPAD Quimper |
| Professionnels | 12 | Actifs et inactifs, coordonnées GPS réelles Finistère |
| Utilisateurs | 5 | 3 comptes démo |

### Comptes de démonstration (mot de passe universel : `demo123`)

```
admin@cpts.fr   → Administrateur CPTS (accès total)
medecin@cpts.fr → Dr. Anne Leclerc, Médecine générale (voit les données restreintes)
pro@cpts.fr     → Sophie Le Bras, Infirmière (accès limité)
```

### Fonctions helpers exportées

```typescript
getProfessionnelById(id: string): Professionnel | undefined
getStructureById(id: string): Structure | undefined
getSpecialiteById(id: string): Specialite | undefined
getCompetenceById(id: string): Competence | undefined
getPathologieById(id: string): Pathologie | undefined
```

---

## 6. Authentification (`src/providers/AuthProvider.tsx`)

- **Mock uniquement** — pas de Supabase encore.
- Persistance via `localStorage` (clé : `cpts_user_id`).
- `login(email, password)` : vérifie `password === 'demo123'`, trouve l'utilisateur par email dans `mockUtilisateurs`, 700ms de délai simulé.
- `logout()` : vide le state + supprime le localStorage.
- `useAuth()` hook expose `{ user, isLoading, login, logout }`.
- `AppLayout` redirige automatiquement vers `/connexion` si pas d'utilisateur.

---

## 7. Système de rôles et règles métier

### Trois rôles

| Rôle | Accès |
|---|---|
| `ADMIN` | Tout — gestion utilisateurs, fiches, référentiels |
| `MEDECIN` | Annuaire complet + données restreintes + édition de son propre profil |
| `AUTRE_PRO` | Annuaire sans données restreintes, pas d'admin |

### Règles métier critiques

**RG-FP-03 / RG-FP-04 — Données restreintes**  
`telephone_direct` et `email_professionnel` d'un professionnel sont masqués pour `AUTRE_PRO`.  
Implémenté dans `annuaire/professionnel/[id]/page.tsx` :
```tsx
const canSeeRestricted = user?.role === 'ADMIN' || user?.role === 'MEDECIN'
// Le DOM ne contient pas la valeur pour AUTRE_PRO — pas un masquage CSS
{canSeeRestricted ? (
  <a href={`tel:${pro.telephone_direct}`}>{pro.telephone_direct}</a>
) : (
  <p className="text-slate-400 italic">Accessible aux médecins</p>
)}
```

**RG-ADMIN — Guards de route**  
Pages admin : `useEffect` + `router.replace('/')` si `user.role !== 'ADMIN'`, + `if (user?.role !== 'ADMIN') return null` en guard synchrone.  
Page mon-profil : accessible uniquement aux `MEDECIN`.

---

## 8. Carte interactive (Leaflet)

- **Tiles** : CartoDB Voyager — `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`
- **Centre par défaut** : `[48.3904, -4.4861]` (Brest)
- **Marqueurs** :
  - Anneau bleu = accepte de nouveaux patients
  - Anneau rouge = n'accepte pas
  - Fond bleu clair + glow = professionnel sélectionné
  - Point bleu pulsant = localisation de référence / ville sélectionnée
- **`Recenter`** : composant interne qui appelle `map.setView()` via `useMap()` quand le centre ou le zoom change.
- **`MapEvents`** : composant interne avec `useMapEvents` pour détecter les clics sur la carte (désélectionne le pro actif).

---

## 9. Accessibilité (RGAA)

- Skip link `<a href="#main-content">` dans `layout.tsx`
- `id="main-content"` sur le `<main>` dans `AppLayout`
- `focus-visible` ring 3px bleu dans `globals.css`
- Breadcrumb avec `aria-label="Fil d'Ariane"` et `aria-current="page"` sur le dernier item
- Menus déroulants : `aria-expanded`, `aria-haspopup`, `role="menu"`, `role="menuitem"`
- Résultats de recherche avec `aria-live` (compteur)
- Tableaux avec `role="table"` et `aria-label`

---

## 10. Patterns de code à respecter

### Nouvelle page protégée (ADMIN)
```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import AppLayout from '@/components/layout/AppLayout'

export default function MaPageAdmin() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/')
  }, [user, router])

  if (user?.role !== 'ADMIN') return null

  return <AppLayout>...</AppLayout>
}
```

### Page avec paramètre dynamique `[id]`
```tsx
import { use } from 'react'
import { notFound } from 'next/navigation'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)  // obligatoire en Next.js 15
  const item = getItemById(id)
  if (!item) notFound()
  // ...
}
```

### Toast (pattern utilisé partout)
```tsx
const [toast, setToast] = useState('')
function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

{toast && <div role="alert" className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 fade-in">ℹ️ {toast}</div>}
```

---

## 11. Ce qui N'EST PAS encore implémenté

- **Supabase** : toute la persistence est mockée en mémoire/localStorage. Quand on connectera Supabase, les `mockData.ts` seront remplacés par des appels Supabase client.
- **Authentification réelle** : remplacer le mock par `supabase.auth.signInWithPassword()`.
- **Upload de photo** : `photo_url` existe dans le type mais n'est pas utilisé dans l'UI.
- **Création/édition réelle** : tous les boutons "Modifier", "Créer", "Ajouter" affichent un toast "Disponible après connexion Supabase".
- **Export CSV** : lien présent dans le dashboard admin, non implémenté.
- **Pagination** : toutes les listes affichent tous les résultats (pas de problème avec 12 pros mockés).
- **Row Level Security Supabase** : la restriction des données restreintes est côté client pour l'instant. En prod, elle sera aussi côté serveur via RLS Postgres.

---

## 12. MCD (Modèle Conceptuel de Données)

```
UTILISATEUR (0,1) ──COMPTE── (0,1) PROFESSIONNEL
PROFESSIONNEL (1,1) ──EST_DE── (1,N) SPECIALITE
PROFESSIONNEL (0,N) ──MAITRISE [est_certifie]── (0,N) COMPETENCE
PROFESSIONNEL (0,N) ──PREND_EN_CHARGE [type_prise_en_charge]── (0,N) PATHOLOGIE
PROFESSIONNEL (0,N) ──EXERCE_DANS [est_principal, jours_presence, heure_debut, heure_fin, role_au_sein]── (1,N) STRUCTURE
```

Tables de jointure futures en SQL :
- `professionnel_competence (id_professionnel, id_competence, est_certifie)`
- `professionnel_pathologie (id_professionnel, id_pathologie, type_prise_en_charge)`
- `exercice_structure (id_professionnel, id_structure, est_principal, jours_presence, heure_debut, heure_fin, role_au_sein)`

---

## 13. Commandes utiles

```bash
npm run dev      # Démarre sur http://localhost:3000 (ou 3001 si port occupé)
npm run build    # Build production (doit passer sans erreur)
npm run lint     # ESLint

# Installation (legacy-peer-deps requis pour react-leaflet v4 + react 19)
npm install --legacy-peer-deps
```
