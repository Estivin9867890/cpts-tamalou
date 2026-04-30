'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuth } from '@/providers/AuthProvider'
import { getProfessionnelById, getCompetenceById, getPathologieById, competences, pathologies } from '@/data/mockData'
import type { Professionnel } from '@/types'

export default function MonProfilPage() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<'info' | 'competences' | 'dispo'>('info')

  const pro = user?.id_professionnel ? getProfessionnelById(user.id_professionnel) : null

  const [presentation, setPresentation] = useState(pro?.presentation ?? '')
  const [teleconsultation, setTeleconsultation] = useState(pro?.teleconsultation ?? false)
  const [acceptePatients, setAcceptePatients] = useState(pro?.accepte_nouveaux_patients ?? true)
  const [selectedComps, setSelectedComps] = useState<string[]>(pro?.competences.map(c => c.id_competence) ?? [])
  const [selectedPaths, setSelectedPaths] = useState<string[]>(pro?.pathologies.map(p => p.id_pathologie) ?? [])

  if (user?.role !== 'MEDECIN') {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-slate-800">Accès réservé aux médecins</h1>
          <p className="text-slate-500 mt-2 text-sm">La gestion de profil n&apos;est disponible que pour les comptes de type Médecin.</p>
        </div>
      </AppLayout>
    )
  }

  if (!pro) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-xl font-bold text-slate-800">Aucune fiche professionnelle liée</h1>
          <p className="text-slate-500 mt-2 text-sm">Contactez l&apos;administrateur pour associer votre compte à une fiche.</p>
        </div>
      </AppLayout>
    )
  }

  function toggleComp(id: string) {
    setSelectedComps(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }
  function togglePath(id: string) {
    setSelectedPaths(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const SECTIONS = [
    { id: 'info' as const, label: 'Informations' },
    { id: 'competences' as const, label: 'Compétences & Pathologies' },
    { id: 'dispo' as const, label: 'Disponibilités' },
  ]

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Mon profil' }]} />

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
            <p className="text-slate-500 text-sm mt-0.5">Gérez les informations visibles par vos confrères</p>
          </div>
          <div className="flex gap-2">
            <a href={`/annuaire/professionnel/${pro.id}`} className="text-sm text-blue-700 border border-blue-300 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl font-medium transition-colors">
              Voir ma fiche publique
            </a>
          </div>
        </div>

        {saved && (
          <div role="alert" className="mb-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium fade-in">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            Modifications enregistrées avec succès
          </div>
        )}

        {/* Identity (read-only) */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {pro.prenom[0]}{pro.nom[0]}
          </div>
          <div>
            <p className="font-bold text-slate-900">{pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}</p>
            <p className="text-sm text-slate-600">N° RPPS : <span className="font-mono">{pro.numero_rpps}</span></p>
            <p className="text-xs text-blue-600 mt-0.5">L&apos;identité et la spécialité sont modifiables uniquement par l&apos;administrateur</p>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-slate-200 mb-6" role="tablist">
          {SECTIONS.map(s => (
            <button key={s.id} role="tab" aria-selected={activeSection === s.id} onClick={() => setActiveSection(s.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === s.id ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Section: Info */}
        {activeSection === 'info' && (
          <div className="space-y-5 fade-in" role="tabpanel">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div>
                <label htmlFor="presentation" className="block text-sm font-semibold text-slate-700 mb-2">Présentation libre</label>
                <textarea id="presentation" value={presentation} onChange={e => setPresentation(e.target.value)} rows={4}
                  placeholder="Décrivez votre pratique, vos domaines d'intérêt, votre parcours…"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Disponibilité</p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`relative w-10 h-6 rounded-full transition-colors ${acceptePatients ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setAcceptePatients(!acceptePatients)}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${acceptePatients ? 'left-4' : 'left-0.5'}`} />
                      </div>
                      <span className="text-sm text-slate-700">Accepte de nouveaux patients</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`relative w-10 h-6 rounded-full transition-colors ${teleconsultation ? 'bg-blue-600' : 'bg-slate-300'}`} onClick={() => setTeleconsultation(!teleconsultation)}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${teleconsultation ? 'left-4' : 'left-0.5'}`} />
                      </div>
                      <span className="text-sm text-slate-700">Téléconsultation disponible</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Informations non modifiables</p>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-500">
                    <p>📞 Tél. : {pro.telephone_standard}</p>
                    <p>🌐 Langues : {pro.langues_parlees ?? 'Non renseigné'}</p>
                    <p>🏷 Secteur : {pro.secteur_conventionnement ?? 'Non renseigné'}</p>
                    <p className="text-[11px] text-slate-400 pt-1">Modifiable par l&apos;administrateur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Competences + Pathologies */}
        {activeSection === 'competences' && (
          <div className="space-y-5 fade-in" role="tabpanel">
            {/* Competences */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Mes compétences ({selectedComps.length})</h2>
              <div className="flex flex-wrap gap-2">
                {competences.filter(c => c.est_active).map(c => (
                  <button key={c.id} type="button" onClick={() => toggleComp(c.id)}
                    aria-pressed={selectedComps.includes(c.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${selectedComps.includes(c.id) ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300 hover:text-blue-600'}`}>
                    {selectedComps.includes(c.id) && '✓ '}{c.libelle}
                  </button>
                ))}
              </div>
            </div>

            {/* Pathologies */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Pathologies prises en charge ({selectedPaths.length})</h2>
              <div className="flex flex-wrap gap-2">
                {pathologies.filter(p => p.est_active).map(p => (
                  <button key={p.id} type="button" onClick={() => togglePath(p.id)}
                    aria-pressed={selectedPaths.includes(p.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${selectedPaths.includes(p.id) ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-600 border-slate-300 hover:border-teal-300 hover:text-teal-600'}`}>
                    {selectedPaths.includes(p.id) && '✓ '}{p.libelle}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: Dispo */}
        {activeSection === 'dispo' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 fade-in" role="tabpanel">
            {pro.structures.map((exercice, i) => (
              <div key={i} className={i > 0 ? 'mt-6 pt-6 border-t border-slate-100' : ''}>
                <h3 className="font-semibold text-slate-800 mb-4">Structure {i + 1} {exercice.est_principal && <span className="text-xs text-blue-600 ml-1">(principale)</span>}</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-1">Jours : <span className="font-medium">{exercice.jours_presence}</span></p>
                  <p className="text-sm text-slate-600">Horaires : <span className="font-medium">{exercice.heure_debut} – {exercice.heure_fin}</span></p>
                </div>
                <p className="text-xs text-slate-400 mt-2">Les horaires sont modifiables par l&apos;administrateur</p>
              </div>
            ))}
          </div>
        )}

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors shadow-sm">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
