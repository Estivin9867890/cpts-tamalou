'use client'

import { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import MapView from '@/components/map/MapView'
import ProfessionalCard from '@/components/professionals/ProfessionalCard'
import { professionnels, competences, getStructureById } from '@/data/mockData'

export default function RechercheCompetencePage() {
  const [selectedCompetence, setSelectedCompetence] = useState('')
  const [selectedVille, setSelectedVille] = useState('')
  const [vue, setVue] = useState<'carte' | 'liste'>('carte')
  const [searched, setSearched] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const villes = ['Brest', 'Landerneau', 'Quimper', 'Morlaix', 'Lannion', 'Douarnenez']
  const VILLE_COORDS: Record<string, [number, number]> = {
    'Brest': [48.3904, -4.4861], 'Landerneau': [48.4524, -4.2487],
    'Quimper': [47.9960, -4.1016], 'Morlaix': [48.5784, -3.8284],
    'Lannion': [48.7320, -3.4590], 'Douarnenez': [48.0950, -4.3358],
  }

  const filteredCompetences = competences.filter(c =>
    c.est_active && c.libelle.toLowerCase().includes(query.toLowerCase())
  )

  const results = useMemo(() => {
    if (!searched) return []
    return professionnels.filter(pro => {
      if (!pro.est_actif) return false
      const hasComp = !selectedCompetence || pro.competences.some(c => c.id_competence === selectedCompetence)
      const hasVille = !selectedVille || (() => {
        const struct = getStructureById(pro.structures[0]?.id_structure)
        return struct?.ville === selectedVille
      })()
      return hasComp && hasVille
    })
  }, [searched, selectedCompetence, selectedVille])

  const selectedComp = competences.find(c => c.id === selectedCompetence)
  const mapCenter: [number, number] = selectedVille && VILLE_COORDS[selectedVille]
    ? VILLE_COORDS[selectedVille] : [48.3904, -4.4861]

  const selectedPro = results.find(p => p.id === selectedId)

  function handleSearch() {
    if (!selectedCompetence && !selectedVille) return
    setSearched(true)
    setSelectedId(null)
  }

  function handleReset() {
    setSelectedCompetence('')
    setSelectedVille('')
    setSearched(false)
    setSelectedId(null)
    setQuery('')
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-full lg:w-80 xl:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-5 border-b border-slate-100">
              <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Recherche par compétence' }]} />
              <h1 className="text-lg font-bold text-slate-900">Recherche par compétence</h1>
              <p className="text-xs text-slate-400 mt-0.5">Localisez un expert sur la carte</p>
            </div>

            {/* Filters */}
            <div className="p-5 space-y-4 border-b border-slate-100">
              {/* Competence selector */}
              <div>
                <label htmlFor="comp-search" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Compétence *
                </label>
                <input
                  id="comp-search"
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelectedCompetence('') }}
                  placeholder="Rechercher une compétence…"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {query && (
                  <div className="mt-1 border border-slate-200 rounded-xl overflow-hidden shadow-sm max-h-48 overflow-y-auto">
                    {filteredCompetences.length > 0 ? filteredCompetences.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setSelectedCompetence(c.id); setQuery(c.libelle) }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 ${selectedCompetence === c.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                      >
                        <span className="font-medium">{c.libelle}</span>
                        <span className="text-xs text-slate-400 ml-2">· {c.categorie}</span>
                      </button>
                    )) : (
                      <p className="px-4 py-3 text-sm text-slate-400">Aucune compétence trouvée</p>
                    )}
                  </div>
                )}
                {selectedCompetence && !query.includes(selectedComp?.libelle ?? '') && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-xs text-blue-700 font-medium">{selectedComp?.libelle}</span>
                    <button onClick={() => { setSelectedCompetence(''); setQuery('') }} className="ml-auto text-blue-400 hover:text-blue-600 text-xs">✕</button>
                  </div>
                )}
              </div>

              {/* Ville */}
              <div>
                <label htmlFor="ville-select" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Secteur géographique
                </label>
                <select
                  id="ville-select"
                  value={selectedVille}
                  onChange={e => setSelectedVille(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Tout le Finistère</option>
                  {villes.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={!selectedCompetence && !selectedVille}
                  className="flex-1 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Rechercher
                </button>
                {(selectedCompetence || selectedVille || searched) && (
                  <button onClick={handleReset} className="px-4 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors">
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* View toggle */}
            {searched && (
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600">
                    {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden" role="group" aria-label="Mode d'affichage">
                    <button onClick={() => setVue('carte')} aria-pressed={vue === 'carte'} className={`px-3 py-1.5 text-xs font-medium transition-colors ${vue === 'carte' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>🗺️ Carte</button>
                    <button onClick={() => setVue('liste')} aria-pressed={vue === 'liste'} className={`px-3 py-1.5 text-xs font-medium transition-colors ${vue === 'liste' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>☰ Liste</button>
                  </div>
                </div>
              </div>
            )}

            {/* Results list */}
            {searched && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {results.length === 0 ? (
                  <div role="alert" className="text-center py-10 text-slate-500">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-medium text-sm">Aucun professionnel trouvé</p>
                    <p className="text-xs text-slate-400 mt-1">Essayez d&apos;élargir vos critères</p>
                  </div>
                ) : results.map(pro => (
                  <div key={pro.id} onClick={() => setSelectedId(pro.id === selectedId ? null : pro.id)} className={`cursor-pointer rounded-xl transition-all ${selectedId === pro.id ? 'ring-2 ring-blue-500' : ''}`}>
                    <ProfessionalCard pro={pro} />
                  </div>
                ))}
              </div>
            )}

            {!searched && (
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                  <div className="text-5xl mb-3">🗺️</div>
                  <p className="text-sm text-slate-500 font-medium">Sélectionnez une compétence</p>
                  <p className="text-xs text-slate-400 mt-1">pour afficher les professionnels sur la carte</p>
                </div>
              </div>
            )}
          </aside>

          {/* Map / List main area */}
          <main className="flex-1 hidden lg:flex flex-col overflow-hidden" aria-label="Carte interactive">
            {vue === 'liste' ? (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
                  {results.map(pro => <ProfessionalCard key={pro.id} pro={pro} />)}
                </div>
              </div>
            ) : (
              <div className="flex-1 relative">
                <MapView
                  professionnels={results}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  center={mapCenter}
                  zoom={selectedVille ? 13 : 10}
                />

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-xl border border-slate-200 shadow-md px-4 py-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-blue-700" /><span className="text-slate-600">Accepte patients</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white border-2 border-red-500" /><span className="text-slate-600">N&apos;accepte pas</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-200 border-2 border-blue-700" /><span className="text-slate-600">Profil sélectionné</span></div>
                </div>

                {/* Selected pro popup */}
                {selectedPro && (
                  <div className="absolute top-4 right-4 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-4 fade-in">
                    <ProfessionalCard pro={selectedPro} />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  )
}
