'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuth } from '@/providers/AuthProvider'
import { getProfessionnelById, getSpecialiteById, getCompetenceById, getPathologieById, getStructureById } from '@/data/mockData'

const SECTEUR_LABELS: Record<string, string> = {
  '1': 'Secteur 1', '2': 'Secteur 2', '3': 'Secteur 3', 'NON_CONVENTIONNE': 'Non conventionné',
}
const TYPE_LABELS: Record<string, string> = {
  CABINET_LIBERAL: 'Cabinet libéral', HOPITAL: 'Hôpital', CLINIQUE: 'Clinique',
  MSP: 'Maison de santé', CPTS: 'CPTS', EHPAD: 'EHPAD', AUTRE: 'Centre de santé',
}
const CAT_COLORS: Record<string, string> = {
  Prévention: 'bg-green-50 text-green-700 border-green-200',
  Spécifique: 'bg-blue-50 text-blue-700 border-blue-200',
  Coordination: 'bg-violet-50 text-violet-700 border-violet-200',
  Addictologie: 'bg-amber-50 text-amber-700 border-amber-200',
  Technique: 'bg-teal-50 text-teal-700 border-teal-200',
}

export default function FicheProfessionnelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)

  const pro = getProfessionnelById(id)
  if (!pro) notFound()

  const specialite = getSpecialiteById(pro.id_specialite)
  const canSeeRestricted = user?.role === 'ADMIN' || user?.role === 'MEDECIN'
  const isOwner = user?.id_professionnel === pro.id
  const canEdit = canSeeRestricted || isOwner

  const initials = `${pro.prenom[0]}${pro.nom[0]}`.toUpperCase()

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Annuaire', href: '/annuaire/professionnels' },
          { label: `${pro.titre ?? ''} ${pro.prenom} ${pro.nom}`.trim() },
        ]} />

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 h-20" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      {pro.titre && <span className="mr-1">{pro.titre}</span>}{pro.prenom} {pro.nom}
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">{specialite?.libelle}</p>
                  </div>
                  {canEdit && (
                    <Link
                      href={`/mon-profil`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      aria-label="Modifier cette fiche"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
                      Modifier
                    </Link>
                  )}
                </div>

                {/* Status badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {pro.accepte_nouveaux_patients === true && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Accepte de nouveaux patients
                    </span>
                  )}
                  {pro.accepte_nouveaux_patients === false && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      N&apos;accepte pas de nouveau patient
                    </span>
                  )}
                  {pro.teleconsultation && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      🖥 Téléconsultation disponible
                    </span>
                  )}
                  {pro.secteur_conventionnement && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {SECTEUR_LABELS[pro.secteur_conventionnement]}
                    </span>
                  )}
                  {pro.langues_parlees && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      🌐 {pro.langues_parlees}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact section */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              {/* Phone standard */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Tél. standard</p>
                  <a href={`tel:${pro.telephone_standard}`} aria-label={`Appeler le ${pro.telephone_standard}`} className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors">
                    {pro.telephone_standard}
                  </a>
                </div>
              </div>

              {/* Phone direct — RESTREINT */}
              {pro.telephone_direct && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {canSeeRestricted
                      ? <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                      : <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                    }
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                      Ligne directe
                      {!canSeeRestricted && <span className="text-[10px] text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">Médecins</span>}
                    </p>
                    {canSeeRestricted ? (
                      <a href={`tel:${pro.telephone_direct}`} aria-label={`Appeler la ligne directe ${pro.telephone_direct}`} className="text-sm font-semibold text-blue-700 hover:text-blue-600 transition-colors">
                        {pro.telephone_direct}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400 italic">Accessible aux médecins</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email — RESTREINT */}
              {pro.email_professionnel && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {canSeeRestricted
                      ? <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                      : <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                      Email professionnel
                      {!canSeeRestricted && <span className="text-[10px] text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">Médecins</span>}
                    </p>
                    {canSeeRestricted ? (
                      <a href={`mailto:${pro.email_professionnel}`} aria-label={`Envoyer un email à ${pro.email_professionnel}`} className="text-sm font-semibold text-blue-700 hover:text-blue-600 transition-colors truncate block">
                        {pro.email_professionnel}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400 italic">Accessible aux médecins</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Presentation */}
            {pro.presentation && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 leading-relaxed">{pro.presentation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Structures d'exercice */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-lg">🏥</span>
              Structure{pro.structures.length > 1 ? 's' : ''} d&apos;exercice
            </h2>
          </div>

          {/* Tabs if multiple structures */}
          {pro.structures.length > 1 && (
            <div className="flex border-b border-slate-100 overflow-x-auto" role="tablist">
              {pro.structures.map((exercice, i) => {
                const struct = getStructureById(exercice.id_structure)
                return (
                  <button
                    key={exercice.id_structure}
                    role="tab"
                    aria-selected={activeTab === i}
                    onClick={() => setActiveTab(i)}
                    className={`px-5 py-3 text-sm font-medium shrink-0 border-b-2 transition-colors ${activeTab === i ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    {struct?.nom ?? 'Structure'} {exercice.est_principal && <span className="ml-1 text-xs text-blue-400">(principale)</span>}
                  </button>
                )
              })}
            </div>
          )}

          {pro.structures.map((exercice, i) => {
            if (activeTab !== i && pro.structures.length > 1) return null
            const struct = getStructureById(exercice.id_structure)
            if (!struct) return null
            return (
              <div key={exercice.id_structure} className="p-6 grid sm:grid-cols-2 gap-5" role={pro.structures.length > 1 ? 'tabpanel' : undefined}>
                <div className="space-y-3">
                  <div>
                    <Link href={`/annuaire/structure/${struct.id}`} className="font-semibold text-slate-900 hover:text-blue-700 transition-colors">
                      {struct.nom}
                    </Link>
                    <span className="ml-2 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{TYPE_LABELS[struct.type_structure]}</span>
                  </div>
                  <div className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="mt-0.5">📍</span>
                    <span>{struct.adresse}, {struct.code_postal} {struct.ville}</span>
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-2">
                    <span>📞</span>
                    <a href={`tel:${struct.telephone}`} className="hover:text-blue-700 transition-colors">{struct.telephone}</a>
                  </div>
                  {exercice.role_au_sein && (
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span>🏷</span><span>{exercice.role_au_sein}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <span>📅</span>Présence
                  </div>
                  <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p className="font-medium">{exercice.jours_presence}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{exercice.heure_debut} – {exercice.heure_fin}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Competences + Pathologies */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Competences */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2"><span>⭐</span>Compétences</h2>
            </div>
            <div className="p-6">
              {pro.competences.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Non renseigné</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pro.competences.map(pc => {
                    const comp = getCompetenceById(pc.id_competence)
                    if (!comp) return null
                    return (
                      <span
                        key={comp.id}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${CAT_COLORS[comp.categorie] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}
                      >
                        {pc.est_certifie && <span title="Certifié">⭐</span>}
                        {comp.libelle}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pathologies */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2"><span>🩺</span>Pathologies prises en charge</h2>
            </div>
            <div className="p-6">
              {pro.pathologies.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Non renseigné</p>
              ) : (
                <div className="space-y-2">
                  {pro.pathologies.map(pp => {
                    const path = getPathologieById(pp.id_pathologie)
                    if (!path) return null
                    return (
                      <div key={path.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-50 last:border-0">
                        <div>
                          <span className="text-sm text-slate-700 font-medium">{path.libelle}</span>
                          {path.code_cim10 && <span className="ml-1.5 text-[10px] font-mono text-slate-400">{path.code_cim10}</span>}
                        </div>
                        <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">{pp.type_prise_en_charge}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>N° RPPS : <span className="font-mono">{pro.numero_rpps ?? 'Non renseigné'}</span></p>
          <p>Dernière mise à jour : {new Date(pro.date_mise_a_jour).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </AppLayout>
  )
}
