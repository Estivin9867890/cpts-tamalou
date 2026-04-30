export type Role = 'ADMIN' | 'MEDECIN' | 'AUTRE_PRO'
export type Secteur = '1' | '2' | '3' | 'NON_CONVENTIONNE'
export type TypeStructure = 'CABINET_LIBERAL' | 'HOPITAL' | 'CLINIQUE' | 'MSP' | 'CPTS' | 'EHPAD' | 'AUTRE'

export interface Utilisateur {
  id: string
  nom: string
  prenom: string
  email: string
  role: Role
  avatar: string
  id_professionnel?: string
}

export interface Specialite {
  id: string
  libelle: string
  code?: string
}

export interface Competence {
  id: string
  libelle: string
  categorie: string
  est_active: boolean
}

export interface Pathologie {
  id: string
  libelle: string
  code_cim10?: string
  categorie: string
  est_active: boolean
}

export interface Structure {
  id: string
  nom: string
  type_structure: TypeStructure
  telephone: string
  email_contact?: string
  site_web?: string
  adresse: string
  code_postal: string
  ville: string
  lat: number
  lng: number
  est_active: boolean
}

export interface ProfessionnelCompetence {
  id_competence: string
  est_certifie: boolean
}

export interface ProfessionnelPathologie {
  id_pathologie: string
  type_prise_en_charge: string
}

export interface ExerciceStructure {
  id_structure: string
  est_principal: boolean
  jours_presence: string
  heure_debut: string
  heure_fin: string
  role_au_sein?: string
}

export interface Professionnel {
  id: string
  nom: string
  prenom: string
  titre?: string
  numero_rpps?: string
  id_specialite: string
  photo_url?: string
  presentation?: string
  telephone_standard: string
  telephone_direct?: string        // DONNÉE RESTREINTE
  email_professionnel?: string     // DONNÉE RESTREINTE
  langues_parlees?: string
  secteur_conventionnement?: Secteur
  accepte_nouveaux_patients?: boolean
  teleconsultation: boolean
  competences: ProfessionnelCompetence[]
  pathologies: ProfessionnelPathologie[]
  structures: ExerciceStructure[]
  lat: number
  lng: number
  est_actif: boolean
  date_mise_a_jour: string
}
