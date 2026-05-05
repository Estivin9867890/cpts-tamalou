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
            <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Gestion des professionnels</h1>
            <p className="text-[#6e6e73] text-sm mt-0.5">{professionnels.length} fiches au total</p>
          </div>
          <button
            onClick={() => showToast('Création disponible après connexion Supabase')}
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5"
          >
            <span>+</span> Ajouter un professionnel
          </button>
        </div>

        {toast && (
          <div role="alert" className="mb-4 px-4 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-sm text-[#6e6e73] fade-in">
            {toast}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#d2d2d7] p-4 mb-5 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[#6e6e73] mb-1.5">Rechercher</label>
            <input
              type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Nom, prénom, RPPS…"
              className="w-full px-4 py-2.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3]"
            />
          </div>
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-[#6e6e73] mb-1.5">Spécialité</label>
            <select value={filterSpe} onChange={e => setFilterSpe(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] bg-white">
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
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                    : 'bg-white text-[#6e6e73] border-[#d2d2d7] hover:bg-[#f5f5f7]'
                )}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-[#6e6e73] ml-auto self-center">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#d2d2d7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Liste des professionnels">
              <thead>
                <tr className="bg-[#f5f5f7] text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Professionnel</th>
                  <th className="px-5 py-3 text-left">N° RPPS</th>
                  <th className="px-5 py-3 text-left">Spécialité</th>
                  <th className="px-5 py-3 text-left">Patients</th>
                  <th className="px-5 py-3 text-left">Statut</th>
                  <th className="px-5 py-3 text-left">Mis à jour</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f7]">
                {results.map(pro => (
                  <tr key={pro.id} className="hover:bg-[#f5f5f7] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {pro.prenom[0]}{pro.nom[0]}
                        </div>
                        <div>
                          <p className="font-medium text-[#1d1d1f]">{pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}</p>
                          <p className="text-xs text-[#86868b]">{pro.structures[0] ? pro.structures[0].id_structure : '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[#6e6e73] text-xs">{pro.numero_rpps}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-[#f5f5f7] text-[#6e6e73] px-2 py-0.5 rounded-full font-medium border border-[#d2d2d7]">
                        {getSpecialite(pro.id_specialite)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx(
                        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                        pro.accepte_nouveaux_patients
                          ? 'bg-[#f0fdf4] text-[#166534]'
                          : 'bg-[#fff5f5] text-[#991b1b]'
                      )}>
                        {pro.accepte_nouveaux_patients ? 'Accepte' : 'Refus'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                        pro.est_actif ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#f5f5f7] text-[#6e6e73]'
                      )}>
                        <span className={clsx('w-1.5 h-1.5 rounded-full', pro.est_actif ? 'bg-[#34c759]' : 'bg-[#d2d2d7]')} />
                        {pro.est_actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#86868b] text-xs">
                      {new Date(pro.date_mise_a_jour).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/annuaire/professionnel/${pro.id}`}
                          className="text-xs px-3 py-1.5 border border-[#d2d2d7] text-[#0071e3] rounded-lg hover:bg-[#f5f5f7] transition-colors">
                          Voir
                        </Link>
                        <button
                          onClick={() => showToast('Modification disponible après connexion Supabase')}
                          className="text-xs px-3 py-1.5 border border-[#d2d2d7] text-[#6e6e73] rounded-lg hover:bg-[#f5f5f7] transition-colors">
                          Modifier
                        </button>
                        <button
                          onClick={() => showToast(`${pro.est_actif ? 'Archivage' : 'Réactivation'} disponible après connexion Supabase`)}
                          className="text-xs px-3 py-1.5 border border-[#d2d2d7] text-[#6e6e73] rounded-lg hover:bg-[#f5f5f7] transition-colors">
                          {pro.est_actif ? 'Archiver' : 'Réactiver'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#86868b] text-sm italic">
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
