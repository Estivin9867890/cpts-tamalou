'use client'

import { useState } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuth } from '@/providers/AuthProvider'
import { professionnels, specialites } from '@/data/mockData'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import clsx from 'clsx'

export default function AdminProfessionnelsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filterSpe, setFilterSpe] = useState('')
  const [filterActif, setFilterActif] = useState<'tous' | 'actifs' | 'inactifs'>('tous')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/')
  }, [user, router])

  if (user?.role !== 'ADMIN') return null

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const results = professionnels.filter(p => {
    const matchQ = !query || `${p.prenom} ${p.nom} ${p.numero_rpps}`.toLowerCase().includes(query.toLowerCase())
    const matchSpe = !filterSpe || p.id_specialite === filterSpe
    const matchActif = filterActif === 'tous' || (filterActif === 'actifs' ? p.est_actif : !p.est_actif)
    return matchQ && matchSpe && matchActif
  })

  const getSpecialite = (id: string) => specialites.find(s => s.id === id)?.libelle ?? id

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Professionnels' },
        ]} />

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des professionnels</h1>
            <p className="text-slate-500 text-sm mt-0.5">{professionnels.length} fiches au total</p>
          </div>
          <button
            onClick={() => showToast('Création disponible après connexion Supabase')}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5"
          >
            <span>+</span> Ajouter un professionnel
          </button>
        </div>

        {toast && (
          <div role="alert" className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 fade-in">
            ℹ️ {toast}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Rechercher</label>
            <input
              type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Nom, prénom, RPPS…"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Spécialité</label>
            <select value={filterSpe} onChange={e => setFilterSpe(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Toutes</option>
              {specialites.map(s => <option key={s.id} value={s.id}>{s.libelle}</option>)}
            </select>
          </div>
          <div className="flex gap-1.5">
            {(['tous', 'actifs', 'inactifs'] as const).map(v => (
              <button key={v} onClick={() => setFilterActif(v)}
                className={clsx(
                  'px-3 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors border',
                  filterActif === v
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                )}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500 ml-auto self-center">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Liste des professionnels">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Professionnel</th>
                  <th className="px-5 py-3 text-left">N° RPPS</th>
                  <th className="px-5 py-3 text-left">Spécialité</th>
                  <th className="px-5 py-3 text-left">Patients</th>
                  <th className="px-5 py-3 text-left">Statut</th>
                  <th className="px-5 py-3 text-left">Mis à jour</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map(pro => (
                  <tr key={pro.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                          {pro.prenom[0]}{pro.nom[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}</p>
                          <p className="text-xs text-slate-400">{pro.structures[0] ? pro.structures[0].id_structure : '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 text-xs">{pro.numero_rpps}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        {getSpecialite(pro.id_specialite)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full',
                        pro.accepte_nouveaux_patients ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                      )}>
                        {pro.accepte_nouveaux_patients ? '✓ Accepte' : '✗ N\'accepte pas'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                        pro.est_actif ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      )}>
                        <span className={clsx('w-1.5 h-1.5 rounded-full', pro.est_actif ? 'bg-emerald-500' : 'bg-slate-400')} />
                        {pro.est_actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(pro.date_mise_a_jour).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/annuaire/professionnel/${pro.id}`}
                          className="text-xs px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          Voir
                        </Link>
                        <button
                          onClick={() => showToast('Modification disponible après connexion Supabase')}
                          className="text-xs px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                          Modifier
                        </button>
                        <button
                          onClick={() => showToast(`${pro.est_actif ? 'Archivage' : 'Réactivation'} disponible après connexion Supabase`)}
                          className={clsx(
                            'text-xs px-3 py-1.5 border rounded-lg transition-colors',
                            pro.est_actif
                              ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          )}>
                          {pro.est_actif ? 'Archiver' : 'Réactiver'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm italic">
                      Aucun professionnel ne correspond aux critères
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
