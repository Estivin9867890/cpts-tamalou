'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProfessionalCard from '@/components/professionals/ProfessionalCard'
import { getStructureById, professionnels, getSpecialiteById } from '@/data/mockData'

const TYPE_LABELS: Record<string, string> = {
  CABINET_LIBERAL: 'Cabinet libéral', HOPITAL: 'Hôpital', CLINIQUE: 'Clinique',
  MSP: 'Maison de santé', CPTS: 'CPTS', EHPAD: 'EHPAD', AUTRE: 'Centre de santé',
}

export default function FicheStructurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const structure = getStructureById(id)
  if (!structure) notFound()

  const prosDansStructure = professionnels.filter(p =>
    p.est_actif && p.structures.some(e => e.id_structure === id)
  )

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Breadcrumb crumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Structures', href: '/annuaire/structures' },
          { label: structure.nom },
        ]} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 h-20" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-8 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl shrink-0">🏥</div>
              <div className="pb-1">
                <span className="text-xs font-medium px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full">{TYPE_LABELS[structure.type_structure]}</span>
                <h1 className="text-xl font-bold text-slate-900 mt-1">{structure.nom}</h1>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📍</span>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Adresse</p>
                  <p className="text-sm text-slate-800">{structure.adresse}</p>
                  <p className="text-sm text-slate-600">{structure.code_postal} {structure.ville}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Téléphone</p>
                  <a href={`tel:${structure.telephone}`} className="text-sm font-semibold text-slate-800 hover:text-blue-700">{structure.telephone}</a>
                </div>
              </div>
              {structure.email_contact && (
                <div className="flex items-center gap-3">
                  <span className="text-lg">✉️</span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Email</p>
                    <a href={`mailto:${structure.email_contact}`} className="text-sm text-blue-700 hover:underline truncate block">{structure.email_contact}</a>
                  </div>
                </div>
              )}
              {structure.site_web && (
                <div className="flex items-center gap-3">
                  <span className="text-lg">🌐</span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Site web</p>
                    <a href={structure.site_web} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline truncate block">{structure.site_web.replace('https://', '')}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Professionnels rattachés ({prosDansStructure.length})</h2>
        </div>

        {prosDansStructure.length === 0 ? (
          <p className="text-slate-400 text-sm italic">Aucun professionnel rattaché</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prosDansStructure.map(pro => <ProfessionalCard key={pro.id} pro={pro} />)}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
