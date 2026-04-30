'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { structures, professionnels, getStructureById } from '@/data/mockData'

const TYPE_LABELS: Record<string, string> = {
  CABINET_LIBERAL: 'Cabinet libéral', HOPITAL: 'Hôpital', CLINIQUE: 'Clinique',
  MSP: 'Maison de santé', CPTS: 'CPTS', EHPAD: 'EHPAD', AUTRE: 'Centre de santé',
}
const TYPE_COLORS: Record<string, string> = {
  HOPITAL: 'bg-red-50 text-red-700 border-red-200', CLINIQUE: 'bg-orange-50 text-orange-700 border-orange-200',
  MSP: 'bg-teal-50 text-teal-700 border-teal-200', CABINET_LIBERAL: 'bg-blue-50 text-blue-700 border-blue-200',
  EHPAD: 'bg-purple-50 text-purple-700 border-purple-200', AUTRE: 'bg-slate-100 text-slate-700 border-slate-200',
  CPTS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export default function ListeStructuresPage() {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const results = useMemo(() => structures.filter(s => {
    const matchQ = !query || s.nom.toLowerCase().includes(query.toLowerCase()) || s.ville.toLowerCase().includes(query.toLowerCase())
    const matchType = !selectedType || s.type_structure === selectedType
    return s.est_active && matchQ && matchType
  }), [query, selectedType])

  function getProsCount(structId: string) {
    return professionnels.filter(p => p.structures.some(e => e.id_structure === structId) && p.est_actif).length
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Annuaire des structures' }]} />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Structures de santé</h1>
          <p className="text-slate-500 text-sm mt-1">{results.length} structure{results.length > 1 ? 's' : ''} répertoriée{results.length > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nom ou ville…" aria-label="Rechercher une structure" className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)} aria-label="Filtrer par type" className="px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Tous les types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(s => (
            <Link key={s.id} href={`/annuaire/structure/${s.id}`} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all block group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-2xl shadow-sm shrink-0">🏥</div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${TYPE_COLORS[s.type_structure]}`}>
                  {TYPE_LABELS[s.type_structure]}
                </span>
              </div>
              <h2 className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors leading-tight mb-2">{s.nom}</h2>
              <div className="space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><span>📍</span>{s.adresse}, {s.code_postal} {s.ville}</p>
                <p className="flex items-center gap-1.5"><span>📞</span>{s.telephone}</p>
                {s.email_contact && <p className="flex items-center gap-1.5 truncate"><span>✉️</span>{s.email_contact}</p>}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{getProsCount(s.id)} professionnel{getProsCount(s.id) > 1 ? 's' : ''}</span>
                <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-block">Voir →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
