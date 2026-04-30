'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuth } from '@/providers/AuthProvider'
import { competences, pathologies, specialites } from '@/data/mockData'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Tab = 'competences' | 'pathologies' | 'specialites'

export default function AdminReferentielsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('competences')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/')
  }, [user, router])

  if (user?.role !== 'ADMIN') return null

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const TABS = [
    { id: 'competences' as Tab, label: 'Compétences', count: competences.length },
    { id: 'pathologies' as Tab, label: 'Pathologies', count: pathologies.length },
    { id: 'specialites' as Tab, label: 'Spécialités', count: specialites.length },
  ]

  const CAT_COLORS: Record<string, string> = {
    Prévention: 'bg-green-50 text-green-700', Spécifique: 'bg-blue-50 text-blue-700',
    Coordination: 'bg-violet-50 text-violet-700', Addictologie: 'bg-amber-50 text-amber-700',
    Technique: 'bg-teal-50 text-teal-700', Cardiovasculaire: 'bg-red-50 text-red-700',
    Psychiatrique: 'bg-purple-50 text-purple-700', Neurologique: 'bg-indigo-50 text-indigo-700',
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Administration', href: '/admin' }, { label: 'Référentiels' }]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des référentiels</h1>
            <p className="text-slate-500 text-sm mt-0.5">Compétences, pathologies et spécialités</p>
          </div>
          <button onClick={() => showToast('Disponible après connexion Supabase')} className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5">
            <span>+</span> Ajouter
          </button>
        </div>

        {toast && <div role="alert" className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 fade-in">ℹ️ {toast}</div>}

        <div className="flex border-b border-slate-200 mb-6" role="tablist">
          {TABS.map(t => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t.label} <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Competences */}
        {tab === 'competences' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" role="tabpanel">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Libellé</th>
                <th className="px-5 py-3 text-left">Catégorie</th>
                <th className="px-5 py-3 text-left">Statut</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {competences.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{c.libelle}</td>
                    <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[c.categorie] ?? 'bg-slate-100 text-slate-600'}`}>{c.categorie}</span></td>
                    <td className="px-5 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.est_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{c.est_active ? 'Actif' : 'Inactif'}</span></td>
                    <td className="px-5 py-3"><button onClick={() => showToast('Disponible après connexion Supabase')} className="text-xs px-3 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Modifier</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pathologies */}
        {tab === 'pathologies' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" role="tabpanel">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Libellé</th>
                <th className="px-5 py-3 text-left">Code CIM-10</th>
                <th className="px-5 py-3 text-left">Catégorie</th>
                <th className="px-5 py-3 text-left">Statut</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {pathologies.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{p.libelle}</td>
                    <td className="px-5 py-3 font-mono text-slate-500 text-xs">{p.code_cim10 ?? '—'}</td>
                    <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[p.categorie] ?? 'bg-slate-100 text-slate-600'}`}>{p.categorie}</span></td>
                    <td className="px-5 py-3"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Actif</span></td>
                    <td className="px-5 py-3"><button onClick={() => showToast('Disponible après connexion Supabase')} className="text-xs px-3 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Modifier</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Spécialités */}
        {tab === 'specialites' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" role="tabpanel">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Libellé</th>
                <th className="px-5 py-3 text-left">Code</th>
                <th className="px-5 py-3 text-left">Professionnels</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {specialites.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{s.libelle}</td>
                    <td className="px-5 py-3 font-mono text-slate-500 text-xs">{s.code ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">
                      {/* count would come from DB in real app */}
                      <span className="bg-slate-100 px-2 py-0.5 rounded-full">—</span>
                    </td>
                    <td className="px-5 py-3"><button onClick={() => showToast('Disponible après connexion Supabase')} className="text-xs px-3 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Modifier</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
