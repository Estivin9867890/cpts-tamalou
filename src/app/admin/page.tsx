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
    { label: 'Utilisateurs', value: mockUtilisateurs.length, icon: '👥', href: '/admin/utilisateurs', color: 'from-blue-500 to-blue-700' },
    { label: 'Professionnels', value: professionnels.filter(p => p.est_actif).length, icon: '👨‍⚕️', href: '/admin/professionnels', color: 'from-teal-500 to-teal-700' },
    { label: 'Structures', value: structures.filter(s => s.est_active).length, icon: '🏥', href: '/annuaire/structures', color: 'from-violet-500 to-violet-700' },
    { label: 'Compétences', value: competences.filter(c => c.est_active).length, icon: '⭐', href: '/admin/referentiels', color: 'from-amber-500 to-amber-700' },
    { label: 'Pathologies', value: pathologies.filter(p => p.est_active).length, icon: '🩺', href: '/admin/referentiels', color: 'from-rose-500 to-rose-700' },
    { label: 'Inactifs', value: professionnels.filter(p => !p.est_actif).length, icon: '🗄', href: '/admin/professionnels', color: 'from-slate-400 to-slate-600' },
  ]

  const actions = [
    { icon: '👤', label: 'Créer un utilisateur', desc: 'Ajouter un nouveau compte d\'accès', href: '/admin/utilisateurs', color: 'border-blue-200 hover:border-blue-400' },
    { icon: '📋', label: 'Gérer les fiches pros', desc: 'Créer, modifier ou archiver des fiches', href: '/admin/professionnels', color: 'border-teal-200 hover:border-teal-400' },
    { icon: '🏥', label: 'Gérer les structures', desc: 'Ajouter ou modifier un établissement', href: '/annuaire/structures', color: 'border-violet-200 hover:border-violet-400' },
    { icon: '📚', label: 'Gérer les référentiels', desc: 'Compétences, pathologies, spécialités', href: '/admin/referentiels', color: 'border-amber-200 hover:border-amber-400' },
    { icon: '📊', label: 'Export CSV', desc: 'Exporter la liste des professionnels', href: '#', color: 'border-emerald-200 hover:border-emerald-400' },
  ]

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Administration' }]} />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
          <p className="text-slate-500 text-sm mt-1">Gestion de l&apos;annuaire CPTS Tamalou</p>
        </div>

        {/* Stats */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Vue d&apos;ensemble</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map(s => (
              <Link key={s.label} href={s.href} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all text-center">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mx-auto mb-3 shadow-sm`}>{s.icon}</div>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Actions rapides */}
        <div className="grid lg:grid-cols-2 gap-6">
          <section aria-labelledby="actions-title">
            <h2 id="actions-title" className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Actions rapides</h2>
            <div className="space-y-3">
              {actions.map(a => (
                <Link key={a.label} href={a.href} className={`bg-white flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all ${a.color} group`}>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">{a.icon}</div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{a.label}</p>
                    <p className="text-xs text-slate-400">{a.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
                </Link>
              ))}
            </div>
          </section>

          {/* Derniers pros */}
          <section aria-labelledby="recent-title">
            <h2 id="recent-title" className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Dernières mises à jour</h2>
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {professionnels.slice(0, 6).map(pro => (
                <div key={pro.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                    {pro.prenom[0]}{pro.nom[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}</p>
                    <p className="text-xs text-slate-400">{new Date(pro.date_mise_a_jour).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Link href={`/annuaire/professionnel/${pro.id}`} className="text-xs text-blue-600 hover:underline shrink-0">Voir</Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  )
}
