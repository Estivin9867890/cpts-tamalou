'use client'

import { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProfessionalCard from '@/components/professionals/ProfessionalCard'
import { professionnels, pathologies, competences, getCompetenceById } from '@/data/mockData'

const CATEGORIES = ['Toutes', 'Cardiovasculaire', 'Endocrinologique', 'Respiratoire', 'Psychiatrique', 'Neurologique', 'Rhumatologique', 'Oncologique', 'Addictologique', 'Métabolique', 'Néphrologique']

export default function RecherchePathologiePage() {
  const [selectedPathologie, setSelectedPathologie] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('Toutes')
  const [searched, setSearched] = useState(false)

  const filteredPaths = useMemo(() => pathologies.filter(p => {
    const matchCat = selectedCat === 'Toutes' || p.categorie === selectedCat
    const matchQ = p.libelle.toLowerCase().includes(query.toLowerCase()) || (p.code_cim10 || '').toLowerCase().includes(query.toLowerCase())
    return p.est_active && matchCat && matchQ
  }), [query, selectedCat])

  const results = useMemo(() => {
    if (!selectedPathologie) return []
    return professionnels.filter(p =>
      p.est_actif && p.pathologies.some(pp => pp.id_pathologie === selectedPathologie)
    )
  }, [selectedPathologie])

  const selectedPath = pathologies.find(p => p.id === selectedPathologie)

  const relatedCompetences = useMemo(() => {
    if (!results.length) return []
    const ids = new Set<string>()
    results.forEach(pro => pro.competences.forEach(c => ids.add(c.id_competence)))
    return [...ids].map(id => getCompetenceById(id)).filter(Boolean) as typeof competences
  }, [results])

  function handleSelect(id: string) {
    setSelectedPathologie(id)
    setSearched(true)
    const found = pathologies.find(p => p.id === id)
    if (found) setQuery(found.libelle)
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Recherche par pathologie' }]} />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Recherche par pathologie</h1>
          <p className="text-slate-500 text-sm mt-1">Trouvez un professionnel selon la pathologie à prendre en charge.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: search panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Sélectionner une pathologie</h2>

              {/* Search input */}
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input
                  type="search"
                  aria-label="Rechercher une pathologie"
                  value={query}
                  onChange={e => { setQuery(e.target.value); if (!filteredPaths.find(p => p.libelle === e.target.value)) setSearched(false) }}
                  placeholder="Diabète, HTA, Asthme…"
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${selectedCat === cat ? 'bg-blue-700 text-white border-blue-700' : 'border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Pathology list */}
              <div className="space-y-1 max-h-96 overflow-y-auto pr-1" role="listbox" aria-label="Liste des pathologies">
                {filteredPaths.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Aucune pathologie trouvée</p>
                ) : filteredPaths.map(p => {
                  const count = professionnels.filter(pro => pro.pathologies.some(pp => pp.id_pathologie === p.id)).length
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(p.id)}
                      role="option"
                      aria-selected={selectedPathologie === p.id}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${selectedPathologie === p.id ? 'bg-blue-50 border border-blue-300 text-blue-800' : 'hover:bg-slate-50 text-slate-700 border border-transparent'}`}
                    >
                      <div>
                        <div className="font-medium leading-tight">{p.libelle}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          {p.code_cim10 && <span className="font-mono">{p.code_cim10}</span>}
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{p.categorie}</span>
                        </div>
                      </div>
                      <span className={`text-xs shrink-0 font-medium px-2 py-0.5 rounded-full ml-2 ${count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
                        {count} pro{count !== 1 ? 's' : ''}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: results */}
          <div className="lg:col-span-2">
            {!searched ? (
              <div className="bg-white rounded-2xl border border-slate-200 flex items-center justify-center py-20 text-center">
                <div>
                  <div className="text-5xl mb-4">🩺</div>
                  <p className="text-slate-700 font-medium">Sélectionnez une pathologie</p>
                  <p className="text-slate-400 text-sm mt-1">Les professionnels correspondants s&apos;afficheront ici</p>
                </div>
              </div>
            ) : (
              <div>
                {selectedPath && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-800">{selectedPath.libelle}</p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        {results.length} professionnel{results.length > 1 ? 's' : ''} pour cette pathologie
                        {selectedPath.code_cim10 && <span className="ml-2 font-mono">· {selectedPath.code_cim10}</span>}
                      </p>
                    </div>
                    <button onClick={() => { setSelectedPathologie(''); setSearched(false); setQuery('') }} className="text-blue-400 hover:text-blue-600 text-sm">✕</button>
                  </div>
                )}

                {relatedCompetences.length > 0 && (
                  <div className="mb-5 bg-white rounded-2xl border border-slate-200 p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <span>⭐</span>
                      Compétences associées
                      <span className="text-xs font-normal text-slate-400">— présentes chez les professionnels qui prennent en charge cette pathologie</span>
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {relatedCompetences.map(c => {
                        const CAT_COLORS: Record<string, string> = {
                          Prévention:   'bg-green-50  text-green-700  border-green-200',
                          Spécifique:   'bg-blue-50   text-blue-700   border-blue-200',
                          Coordination: 'bg-violet-50 text-violet-700 border-violet-200',
                          Addictologie: 'bg-amber-50  text-amber-700  border-amber-200',
                          Technique:    'bg-teal-50   text-teal-700   border-teal-200',
                        }
                        return (
                          <span
                            key={c.id}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${CAT_COLORS[c.categorie] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}
                          >
                            {c.libelle}
                            <span className="text-[10px] opacity-60">· {c.categorie}</span>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {results.length === 0 ? (
                  <div role="alert" className="bg-white rounded-2xl border border-slate-200 flex items-center justify-center py-16 text-center">
                    <div>
                      <div className="text-4xl mb-3">😕</div>
                      <p className="text-slate-700 font-medium">Aucun professionnel trouvé</p>
                      <p className="text-slate-400 text-sm mt-1">Aucun membre de la CPTS n&apos;a renseigné cette pathologie.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4" role="list" aria-label={`Résultats pour ${selectedPath?.libelle}`}>
                    {results.map(pro => (
                      <div key={pro.id} role="listitem">
                        <ProfessionalCard pro={pro} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
