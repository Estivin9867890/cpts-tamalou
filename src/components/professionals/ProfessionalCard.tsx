import Link from 'next/link'
import clsx from 'clsx'
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

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group fade-in">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + specialty */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/annuaire/professionnel/${pro.id}`}
                className="font-semibold text-slate-900 text-sm hover:text-blue-700 transition-colors group-hover:text-blue-700 line-clamp-1"
              >
                {pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}
              </Link>
              <p className="text-xs text-slate-500 mt-0.5">{specialite?.libelle}</p>
            </div>
            {distanceKm !== undefined && (
              <span className="text-xs text-slate-400 shrink-0 bg-slate-50 px-2 py-1 rounded-full">{distanceKm.toFixed(1)} km</span>
            )}
          </div>

          {/* Structure */}
          {structurePrincipale && (
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 truncate">
              <span>📍</span>
              <span className="truncate">{structurePrincipale.nom} — {structurePrincipale.ville}</span>
            </p>
          )}

          {/* Indicators */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {pro.accepte_nouveaux_patients === true && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Accepte patients
              </span>
            )}
            {pro.accepte_nouveaux_patients === false && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                Pas de nouveau patient
              </span>
            )}
            {pro.teleconsultation && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                🖥 Téléconsultation
              </span>
            )}
            {pro.secteur_conventionnement && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Secteur {pro.secteur_conventionnement === 'NON_CONVENTIONNE' ? 'NC' : pro.secteur_conventionnement}
              </span>
            )}
          </div>

          {/* Competences */}
          {competencesAffichees.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {competencesAffichees.map(c => c && (
                <span key={c.id} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                  {c.libelle}
                </span>
              ))}
              {pro.competences.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full border border-slate-200">
                  +{pro.competences.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/annuaire/professionnel/${pro.id}`}
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
      >
        Voir la fiche
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
      </Link>
    </article>
  )
}
