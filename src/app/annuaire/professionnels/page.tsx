'use client'

import { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProfessionalCard from '@/components/professionals/ProfessionalCard'
import { professionnels, specialites, getSpecialiteById } from '@/data/mockData'

export default function ListeProfessionnelsPage() {
  const [query, setQuery] = useState('')
  const [selectedSpec, setSelectedSpec] = useState('')
  const [acceptePatients, setAcceptePatients] = useState(false)
  const [teleconsult, setTeleconsult] = useState(false)

  const results = useMemo(() => professionnels.filter(p => {
    if (!p.est_actif) return false
    const spec = getSpecialiteById(p.id_specialite)
    const matchQ = !query || `${p.nom} ${p.prenom}`.toLowerCase().includes(query.toLowerCase()) || spec?.libelle.toLowerCase().includes(query.toLowerCase())
    const matchSpec = !selectedSpec || p.id_specialite === selectedSpec
    const matchAccepte = !acceptePatients || p.accepte_nouveaux_patients === true
    const matchTele = !teleconsult || p.teleconsultation
    return matchQ && matchSpec && matchAccepte && matchTele
  }), [query, selectedSpec, acceptePatients, teleconsult])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Annuaire des professionnels' }]} />

        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Annuaire des professionnels</h1>
            <p className="text-slate-500 text-sm mt-1">{results.length} professionnel{results.length > 1 ? 's' : ''} affiché{results.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nom ou spécialité…" aria-label="Filtrer par nom ou spécialité" className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <select value={selectedSpec} onChange={e => setSelectedSpec(e.target.value)} aria-label="Filtrer par spécialité" className="px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Toutes les spécialités</option>
            {specialites.map(s => <option key={s.id} value={s.id}>{s.libelle}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input type="checkbox" checked={acceptePatients} onChange={e => setAcceptePatients(e.target.checked)} className="w-4 h-4 accent-blue-700 rounded" />
            Accepte patients
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input type="checkbox" checked={teleconsult} onChange={e => setTeleconsult(e.target.checked)} className="w-4 h-4 accent-blue-700 rounded" />
            Téléconsultation
          </label>
          {(query || selectedSpec || acceptePatients || teleconsult) && (
            <button onClick={() => { setQuery(''); setSelectedSpec(''); setAcceptePatients(false); setTeleconsult(false) }} className="text-xs text-slate-400 hover:text-slate-600 underline">Effacer les filtres</button>
          )}
        </div>

        {results.length === 0 ? (
          <div role="alert" className="text-center py-16 bg-white rounded-2xl border border-[#d2d2d7]">
            <svg className="w-10 h-10 text-[#d2d2d7] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <p className="font-medium text-[#1d1d1f]">Aucun professionnel trouvé</p>
            <p className="text-sm text-[#6e6e73] mt-1">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(pro => <ProfessionalCard key={pro.id} pro={pro} />)}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
