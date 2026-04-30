'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProfessionalCard from '@/components/professionals/ProfessionalCard'
import { professionnels, structures, getSpecialiteById } from '@/data/mockData'

export default function RechercheNomPage() {
  const [query, setQuery] = useState('')

  const proResults = useMemo(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    return professionnels.filter(p =>
      p.est_actif && (
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        `${p.prenom} ${p.nom}`.toLowerCase().includes(q) ||
        `${p.nom} ${p.prenom}`.toLowerCase().includes(q) ||
        getSpecialiteById(p.id_specialite)?.libelle.toLowerCase().includes(q)
      )
    )
  }, [query])

  const strResults = useMemo(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    return structures.filter(s =>
      s.est_active && (
        s.nom.toLowerCase().includes(q) ||
        s.ville.toLowerCase().includes(q) ||
        s.code_postal.includes(q)
      )
    )
  }, [query])

  const TYPE_LABELS: Record<string, string> = {
    CABINET_LIBERAL: 'Cabinet libéral', HOPITAL: 'Hôpital',
    CLINIQUE: 'Clinique', MSP: 'Maison de santé', CPTS: 'CPTS',
    EHPAD: 'EHPAD', AUTRE: 'Centre de santé',
  }

  const totalResults = proResults.length + strResults.length

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Recherche par nom' }]} />

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Recherche par nom ou structure</h1>
        <p className="text-slate-500 text-sm mb-6">Retrouvez directement un professionnel ou un établissement.</p>

        {/* Search bar */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input
            type="search"
            autoFocus
            aria-label="Rechercher un professionnel ou une structure"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Nom, prénom, spécialité, établissement, ville…"
            className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base bg-white shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Effacer la recherche"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {query.length > 0 && query.length < 2 && (
          <p className="text-sm text-slate-400 text-center py-4">Saisissez au moins 2 caractères…</p>
        )}

        {query.length >= 2 && (
          <div>
            <p className="text-sm text-slate-500 mb-4" aria-live="polite">
              <strong className="text-slate-800">{totalResults}</strong> résultat{totalResults > 1 ? 's' : ''} pour &laquo; {query} &raquo;
            </p>

            {/* Professionals */}
            {proResults.length > 0 && (
              <section aria-labelledby="pros-title" className="mb-6">
                <h2 id="pros-title" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>👨‍⚕️</span> Professionnels ({proResults.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {proResults.map(pro => <ProfessionalCard key={pro.id} pro={pro} />)}
                </div>
              </section>
            )}

            {/* Structures */}
            {strResults.length > 0 && (
              <section aria-labelledby="structs-title">
                <h2 id="structs-title" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🏥</span> Structures ({strResults.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {strResults.map(s => (
                    <Link key={s.id} href={`/annuaire/structure/${s.id}`} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all block group">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xl shrink-0">🏥</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors leading-tight">{s.nom}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{TYPE_LABELS[s.type_structure]}</p>
                          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                            <span>📍</span>{s.adresse}, {s.ville} {s.code_postal}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <span>📞</span>{s.telephone}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <div role="alert" className="text-center py-14 text-slate-500 bg-white rounded-2xl border border-slate-200">
                <div className="text-5xl mb-3">🔍</div>
                <p className="font-medium">Aucun résultat pour &laquo; {query} &raquo;</p>
                <p className="text-xs text-slate-400 mt-1">Vérifiez l&apos;orthographe ou essayez un autre terme</p>
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-medium text-slate-500">Commencez à saisir pour rechercher</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
