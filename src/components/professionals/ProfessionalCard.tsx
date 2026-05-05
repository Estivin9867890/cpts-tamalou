import Link from 'next/link'
import type { Professionnel } from '@/types'
import { getSpecialiteById, getCompetenceById, getStructureById } from '@/data/mockData'

const TYPE_LABELS: Record<string, string> = {
  CABINET_LIBERAL: 'Cabinet libéral', HOPITAL: 'Hôpital',
  CLINIQUE: 'Clinique', MSP: 'MSP', CPTS: 'CPTS',
  EHPAD: 'EHPAD', AUTRE: 'Centre de santé',
}

interface Props { pro: Professionnel; distanceKm?: number }

export default function ProfessionalCard({ pro, distanceKm }: Props) {
  const specialite = getSpecialiteById(pro.id_specialite)
  const structurePrincipale = getStructureById(pro.structures[0]?.id_structure)
  const competencesAffichees = pro.competences.slice(0, 3).map(c => getCompetenceById(c.id_competence)).filter(Boolean)
  const initials = `${pro.prenom[0]}${pro.nom[0]}`.toUpperCase()

  void TYPE_LABELS

  return (
    <article className="bg-white rounded-2xl border border-[#d2d2d7] p-4 hover:border-[#0071e3] transition-colors fade-in">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-[#1d1d1f] flex items-center justify-center shrink-0 text-white font-semibold text-sm">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + specialty */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/annuaire/professionnel/${pro.id}`}
                className="font-semibold text-[#1d1d1f] text-sm hover:text-[#0071e3] transition-colors line-clamp-1"
              >
                {pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}
              </Link>
              <p className="text-xs text-[#6e6e73] mt-0.5">{specialite?.libelle}</p>
            </div>
            {distanceKm !== undefined && (
              <span className="text-xs text-[#6e6e73] shrink-0 bg-[#f5f5f7] px-2 py-1 rounded-full">{distanceKm.toFixed(1)} km</span>
            )}
          </div>

          {/* Structure */}
          {structurePrincipale && (
            <p className="text-xs text-[#6e6e73] mt-1.5 flex items-center gap-1 truncate">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              <span className="truncate">{structurePrincipale.nom} — {structurePrincipale.ville}</span>
            </p>
          )}

          {/* Indicators */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {pro.accepte_nouveaux_patients === true && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] inline-block" />
                Accepte patients
              </span>
            )}
            {pro.accepte_nouveaux_patients === false && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#fff5f5] text-[#991b1b] border border-[#fecaca]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] inline-block" />
                Pas de nouveau patient
              </span>
            )}
            {pro.teleconsultation && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#d2d2d7]">
                Téléconsultation
              </span>
            )}
            {pro.secteur_conventionnement && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#6e6e73]">
                Secteur {pro.secteur_conventionnement === 'NON_CONVENTIONNE' ? 'NC' : pro.secteur_conventionnement}
              </span>
            )}
          </div>

          {/* Competences */}
          {competencesAffichees.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {competencesAffichees.map(c => c && (
                <span key={c.id} className="text-[10px] px-2 py-0.5 bg-[#f5f5f7] text-[#6e6e73] rounded-full border border-[#d2d2d7]">
                  {c.libelle}
                </span>
              ))}
              {pro.competences.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 bg-[#f5f5f7] text-[#6e6e73] rounded-full border border-[#d2d2d7]">
                  +{pro.competences.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/annuaire/professionnel/${pro.id}`}
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-[#0071e3] hover:bg-[#f5f5f7] rounded-xl transition-colors border border-[#d2d2d7]"
      >
        Voir la fiche
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
      </Link>
    </article>
  )
}
