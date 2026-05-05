'use client'

import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuth } from '@/providers/AuthProvider'
import { professionnels, structures, mockUtilisateurs, competences, pathologies } from '@/data/mockData'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/')
  }, [user, router])

  if (user?.role !== 'ADMIN') return null

  const stats = [
    { label: 'Utilisateurs', value: mockUtilisateurs.length, href: '/admin/utilisateurs' },
    { label: 'Professionnels', value: professionnels.filter(p => p.est_actif).length, href: '/admin/professionnels' },
    { label: 'Structures', value: structures.filter(s => s.est_active).length, href: '/annuaire/structures' },
    { label: 'Compétences', value: competences.filter(c => c.est_active).length, href: '/admin/referentiels' },
    { label: 'Pathologies', value: pathologies.filter(p => p.est_active).length, href: '/admin/referentiels' },
    { label: 'Inactifs', value: professionnels.filter(p => !p.est_actif).length, href: '/admin/professionnels' },
  ]

  const actions = [
    { label: 'Créer un utilisateur', desc: 'Ajouter un nouveau compte d\'accès', href: '/admin/utilisateurs' },
    { label: 'Gérer les fiches', desc: 'Créer, modifier ou archiver des fiches professionnelles', href: '/admin/professionnels' },
    { label: 'Gérer les structures', desc: 'Ajouter ou modifier un établissement', href: '/annuaire/structures' },
    { label: 'Gérer les référentiels', desc: 'Compétences, pathologies, spécialités', href: '/admin/referentiels' },
    { label: 'Export CSV', desc: 'Exporter la liste des professionnels', href: '#' },
  ]

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Administration' }]} />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Administration</h1>
          <p className="text-[#6e6e73] text-sm mt-1">Gestion de l&apos;annuaire CPTS Tamalou</p>
        </div>

        {/* Stats */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-widest mb-4">Vue d&apos;ensemble</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map(s => (
              <Link
                key={s.label}
                href={s.href}
                className="bg-white rounded-2xl border border-[#d2d2d7] p-4 hover:border-[#0071e3] transition-colors text-center"
              >
                <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">{s.value}</div>
                <div className="text-xs text-[#6e6e73] mt-1">{s.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Actions rapides */}
        <div className="grid lg:grid-cols-2 gap-6">
          <section aria-labelledby="actions-title">
            <h2 id="actions-title" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-widest mb-4">Actions rapides</h2>
            <div className="space-y-2">
              {actions.map(a => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="bg-white flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#d2d2d7] hover:border-[#0071e3] transition-colors group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[#1d1d1f] text-sm group-hover:text-[#0071e3] transition-colors">{a.label}</p>
                    <p className="text-xs text-[#6e6e73] mt-0.5">{a.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
                </Link>
              ))}
            </div>
          </section>

          {/* Derniers pros */}
          <section aria-labelledby="recent-title">
            <h2 id="recent-title" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-widest mb-4">Dernières mises à jour</h2>
            <div className="bg-white rounded-2xl border border-[#d2d2d7] divide-y divide-[#f5f5f7]">
              {professionnels.slice(0, 6).map(pro => (
                <div key={pro.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {pro.prenom[0]}{pro.nom[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1d1d1f] truncate">{pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}</p>
                    <p className="text-xs text-[#6e6e73]">{new Date(pro.date_mise_a_jour).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Link href={`/annuaire/professionnel/${pro.id}`} className="text-xs text-[#0071e3] hover:opacity-80 shrink-0 transition-opacity">Voir</Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  )
}
