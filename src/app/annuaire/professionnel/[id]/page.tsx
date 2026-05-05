'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuth } from '@/providers/AuthProvider'
import { getProfessionnelById, getSpecialiteById, getCompetenceById, getPathologieById, getStructureById } from '@/data/mockData'
import { useFavorites } from '@/providers/FavoritesProvider'

const SECTEUR_LABELS: Record<string, string> = {
  '1': 'Secteur 1', '2': 'Secteur 2', '3': 'Secteur 3', 'NON_CONVENTIONNE': 'Non conventionné',
}
const TYPE_LABELS: Record<string, string> = {
  CABINET_LIBERAL: 'Cabinet libéral', HOPITAL: 'Hôpital', CLINIQUE: 'Clinique',
  MSP: 'Maison de santé', CPTS: 'CPTS', EHPAD: 'EHPAD', AUTRE: 'Centre de santé',
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
  const { isFavorite, toggleFavorite } = useFavorites()
  const favori = isFavorite(pro.id)

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Annuaire', href: '/annuaire/professionnels' },
          { label: `${pro.titre ?? ''} ${pro.prenom} ${pro.nom}`.trim() },
        ]} />

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-[#d2d2d7] mb-6 overflow-hidden">
          <div className="bg-[#1d4ed8] h-16" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8 mb-5">
              <div className="w-[72px] h-[72px] rounded-2xl bg-[#1d4ed8] flex items-center justify-center text-white font-bold text-2xl border-4 border-white shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">
                      {pro.titre && <span className="mr-1">{pro.titre}</span>}{pro.prenom} {pro.nom}
                    </h1>
                    <p className="text-[#6e6e73] text-sm mt-0.5">{specialite?.libelle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(pro.id)}
                      aria-label={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-[#f5f5f7] hover:bg-[#eff6ff] rounded-xl transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${favori ? 'text-[#1d4ed8] fill-[#1d4ed8]' : 'text-[#d2d2d7]'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill={favori ? 'currentColor' : 'none'}
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                      {favori ? 'Favori' : 'Ajouter aux favoris'}
                    </button>
                    {canEdit && (
                      <Link
                        href="/mon-profil"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] rounded-xl transition-colors"
                        aria-label="Modifier cette fiche"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
                        Modifier
                      </Link>
                    )}
                  </div>
                </div>

                {/* Status badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {pro.accepte_nouveaux_patients === true && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                      Accepte de nouveaux patients
                    </span>
                  )}
                  {pro.accepte_nouveaux_patients === false && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#fff5f5] text-[#991b1b] border border-[#fecaca]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30]" />
                      N&apos;accepte pas de nouveau patient
                    </span>
                  )}
                  {pro.teleconsultation && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#d2d2d7]">
                      Téléconsultation disponible
                    </span>
                  )}
                  {pro.secteur_conventionnement && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[#6e6e73] border border-[#d2d2d7]">
                      {SECTEUR_LABELS[pro.secteur_conventionnement]}
                    </span>
                  )}
                  {pro.langues_parlees && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[#6e6e73] border border-[#d2d2d7]">
                      {pro.langues_parlees}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact section */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-[#f5f5f7] rounded-xl border border-[#e8e8ed]">
              {/* Phone standard */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#d2d2d7] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                </div>
                <div>
                  <p className="text-[11px] text-[#6e6e73] font-medium uppercase tracking-wider">Tél. standard</p>
                  <a href={`tel:${pro.telephone_standard}`} className="text-sm font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
                    {pro.telephone_standard}
                  </a>
                </div>
              </div>

              {/* Phone direct — RESTREINT */}
              {pro.telephone_direct && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#d2d2d7] flex items-center justify-center shrink-0">
                    {canSeeRestricted
                      ? <svg className="w-4 h-4 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                      : <svg className="w-4 h-4 text-[#d2d2d7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                    }
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6e6e73] font-medium uppercase tracking-wider flex items-center gap-1">
                      Ligne directe
                      {!canSeeRestricted && <span className="text-[10px] text-[#6e6e73] bg-[#f5f5f7] border border-[#d2d2d7] px-1.5 py-0.5 rounded">Médecins</span>}
                    </p>
                    {canSeeRestricted ? (
                      <a href={`tel:${pro.telephone_direct}`} className="text-sm font-semibold text-[#0071e3] hover:opacity-80 transition-opacity">
                        {pro.telephone_direct}
                      </a>
                    ) : (
                      <p className="text-sm text-[#86868b] italic">Accessible aux médecins</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email — RESTREINT */}
              {pro.email_professionnel && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#d2d2d7] flex items-center justify-center shrink-0">
                    {canSeeRestricted
                      ? <svg className="w-4 h-4 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                      : <svg className="w-4 h-4 text-[#d2d2d7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#6e6e73] font-medium uppercase tracking-wider flex items-center gap-1">
                      Email professionnel
                      {!canSeeRestricted && <span className="text-[10px] text-[#6e6e73] bg-[#f5f5f7] border border-[#d2d2d7] px-1.5 py-0.5 rounded">Médecins</span>}
                    </p>
                    {canSeeRestricted ? (
                      <a href={`mailto:${pro.email_professionnel}`} className="text-sm font-semibold text-[#0071e3] hover:opacity-80 transition-opacity truncate block">
                        {pro.email_professionnel}
                      </a>
                    ) : (
                      <p className="text-sm text-[#86868b] italic">Accessible aux médecins</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Presentation */}
            {pro.presentation && (
              <div className="mt-4">
                <p className="text-sm text-[#6e6e73] leading-relaxed">{pro.presentation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Structures d'exercice */}
        <div className="bg-white rounded-2xl border border-[#d2d2d7] mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f5f5f7]">
            <h2 className="font-semibold text-[#1d1d1f]">
              Structure{pro.structures.length > 1 ? 's' : ''} d&apos;exercice
            </h2>
          </div>

          {pro.structures.length > 1 && (
            <div className="flex border-b border-[#f5f5f7] overflow-x-auto" role="tablist">
              {pro.structures.map((exercice, i) => {
                const struct = getStructureById(exercice.id_structure)
                return (
                  <button
                    key={exercice.id_structure}
                    role="tab"
                    aria-selected={activeTab === i}
                    onClick={() => setActiveTab(i)}
                    className={`px-5 py-3 text-sm font-medium shrink-0 border-b-2 transition-colors ${activeTab === i ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                  >
                    {struct?.nom ?? 'Structure'} {exercice.est_principal && <span className="ml-1 text-xs text-[#86868b]">(principale)</span>}
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
                    <Link href={`/annuaire/structure/${struct.id}`} className="font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
                      {struct.nom}
                    </Link>
                    <span className="ml-2 text-xs text-[#6e6e73] bg-[#f5f5f7] px-2 py-0.5 rounded-full">{TYPE_LABELS[struct.type_structure]}</span>
                  </div>
                  <div className="text-sm text-[#6e6e73] flex items-start gap-2">
                    <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    <span>{struct.adresse}, {struct.code_postal} {struct.ville}</span>
                  </div>
                  <div className="text-sm text-[#6e6e73] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                    <a href={`tel:${struct.telephone}`} className="hover:text-[#0071e3] transition-colors">{struct.telephone}</a>
                  </div>
                  {exercice.role_au_sein && (
                    <div className="text-sm text-[#6e6e73]">{exercice.role_au_sein}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[#1d1d1f]">Présence</div>
                  <div className="text-sm text-[#6e6e73] bg-[#f5f5f7] rounded-xl px-4 py-3 border border-[#e8e8ed]">
                    <p className="font-medium text-[#1d1d1f]">{exercice.jours_presence}</p>
                    <p className="text-[#86868b] text-xs mt-0.5">{exercice.heure_debut} – {exercice.heure_fin}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Competences + Pathologies */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Competences */}
          <div className="bg-white rounded-2xl border border-[#d2d2d7]">
            <div className="px-6 py-4 border-b border-[#f5f5f7]">
              <h2 className="font-semibold text-[#1d1d1f]">Compétences</h2>
            </div>
            <div className="p-6">
              {pro.competences.length === 0 ? (
                <p className="text-sm text-[#86868b] italic">Non renseigné</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pro.competences.map(pc => {
                    const comp = getCompetenceById(pc.id_competence)
                    if (!comp) return null
                    return (
                      <span
                        key={comp.id}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#d2d2d7]"
                      >
                        {pc.est_certifie && (
                          <svg className="w-3 h-3 text-[#0071e3]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                        )}
                        {comp.libelle}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pathologies */}
          <div className="bg-white rounded-2xl border border-[#d2d2d7]">
            <div className="px-6 py-4 border-b border-[#f5f5f7]">
              <h2 className="font-semibold text-[#1d1d1f]">Pathologies prises en charge</h2>
            </div>
            <div className="p-6">
              {pro.pathologies.length === 0 ? (
                <p className="text-sm text-[#86868b] italic">Non renseigné</p>
              ) : (
                <div className="space-y-2">
                  {pro.pathologies.map(pp => {
                    const path = getPathologieById(pp.id_pathologie)
                    if (!path) return null
                    return (
                      <div key={path.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-[#f5f5f7] last:border-0">
                        <div>
                          <span className="text-sm text-[#1d1d1f] font-medium">{path.libelle}</span>
                          {path.code_cim10 && <span className="ml-1.5 text-[10px] font-mono text-[#86868b]">{path.code_cim10}</span>}
                        </div>
                        <span className="text-[11px] text-[#6e6e73] bg-[#f5f5f7] border border-[#d2d2d7] px-2 py-0.5 rounded-full shrink-0">{pp.type_prise_en_charge}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between text-xs text-[#86868b]">
          <p>N° RPPS : <span className="font-mono">{pro.numero_rpps ?? 'Non renseigné'}</span></p>
          <p>Dernière mise à jour : {new Date(pro.date_mise_a_jour).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </AppLayout>
  )
}
