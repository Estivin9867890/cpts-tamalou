'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuth } from '@/providers/AuthProvider'
import { mockUtilisateurs } from '@/data/mockData'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import clsx from 'clsx'

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Administrateur', MEDECIN: 'Médecin', AUTRE_PRO: 'Autre professionnel' }
const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700', MEDECIN: 'bg-blue-100 text-blue-700', AUTRE_PRO: 'bg-teal-100 text-teal-700',
}

export default function AdminUtilisateursPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [showToast, setShowToast] = useState('')

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/')
  }, [user, router])

  if (user?.role !== 'ADMIN') return null

  const results = mockUtilisateurs.filter(u =>
    !query || `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(query.toLowerCase())
  )

  function handleAction(msg: string) {
    setShowToast(msg)
    setTimeout(() => setShowToast(''), 2500)
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Administration', href: '/admin' }, { label: 'Utilisateurs' }]} />

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des utilisateurs</h1>
            <p className="text-slate-500 text-sm mt-0.5">{mockUtilisateurs.length} comptes au total</p>
          </div>
          <button onClick={() => handleAction('Fonctionnalité disponible après connexion Supabase')} className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5">
            <span>+</span> Créer un utilisateur
          </button>
        </div>

        {showToast && (
          <div role="alert" className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 fade-in">
            ℹ️ {showToast}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un utilisateur…" aria-label="Rechercher" className="w-full max-w-sm px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Liste des utilisateurs">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Utilisateur</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Rôle</th>
                  <th className="px-5 py-3 text-left">Fiche pro</th>
                  <th className="px-5 py-3 text-left">Statut</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">{u.avatar}</div>
                        <span className="font-medium text-slate-800">{u.prenom} {u.nom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-full', ROLE_COLORS[u.role])}>{ROLE_LABELS[u.role]}</span>
                    </td>
                    <td className="px-5 py-4">
                      {u.id_professionnel ? (
                        <a href={`/annuaire/professionnel/${u.id_professionnel}`} className="text-blue-600 hover:underline text-xs">Voir la fiche</a>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Actif
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleAction('Modification disponible après connexion Supabase')} className="text-xs px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Modifier</button>
                        <button onClick={() => handleAction('Désactivation disponible après connexion Supabase')} className="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Désactiver</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
