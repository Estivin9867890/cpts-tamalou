'use client'

import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/providers/AuthProvider'
import { professionnels, structures, competences, pathologies } from '@/data/mockData'

const SEARCH_CARDS = [
  {
    href: '/recherche/pathologie',
    title: 'Par pathologie',
    desc: 'Trouvez un professionnel selon la maladie ou l\'affection dont souffre votre patient.',
  },
  {
    href: '/recherche/competence',
    title: 'Par compétence',
    desc: 'Localisez des experts sur la carte interactive du Finistère par domaine de compétence.',
  },
  {
    href: '/recherche/nom',
    title: 'Par nom ou structure',
    desc: 'Retrouvez directement un professionnel ou une structure par son nom.',
  },
]

const RECENT_UPDATES = [
  { pro: 'Dr. Anne Leclerc', action: 'a mis à jour ses compétences', date: 'il y a 2 jours', id: 'pro-1' },
  { pro: 'Gwenaëlle Mével', action: 'a rejoint la CPTS', date: 'il y a 5 jours', id: 'pro-11' },
  { pro: 'Ronan Tanguy', action: 'active la téléconsultation', date: 'il y a 1 semaine', id: 'pro-12' },
]

export default function HomePage() {
  const { user } = useAuth()

  const proActifs = professionnels.filter(p => p.est_actif).length
  const strActives = structures.filter(s => s.est_active).length

  return (
    <AppLayout>
      {/* Hero */}
      <div className="bg-[#1d1d1f]">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-[#6e6e73] text-sm font-medium mb-2">
              {user?.role === 'ADMIN' ? 'Bienvenue,' : 'Bonjour,'}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">
              {user?.prenom} {user?.nom}
            </h1>
            <p className="text-[#aeaeb2] text-base leading-relaxed">
              Annuaire des professionnels de santé de la{' '}
              <span className="text-white font-medium">CPTS Tamalou</span>.
              Orientez vos patients vers les bons interlocuteurs du Finistère.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Professionnels actifs', value: proActifs },
            { label: 'Structures', value: strActives },
            { label: 'Compétences', value: competences.filter(c => c.est_active).length },
            { label: 'Pathologies', value: pathologies.filter(p => p.est_active).length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[#d2d2d7] p-5">
              <div className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{stat.value}</div>
              <div className="text-xs text-[#6e6e73] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search cards */}
        <section aria-labelledby="search-title">
          <h2 id="search-title" className="text-lg font-semibold text-[#1d1d1f] mb-4">Lancer une recherche</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {SEARCH_CARDS.map(card => (
              <div key={card.href} className="bg-white rounded-2xl border border-[#d2d2d7] p-6 flex flex-col hover:border-[#0071e3] transition-colors">
                <h3 className="font-semibold text-[#1d1d1f] mb-2">{card.title}</h3>
                <p className="text-sm text-[#6e6e73] leading-relaxed flex-1 mb-5">{card.desc}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#0071e3] hover:opacity-80 transition-opacity"
                >
                  Rechercher
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent activity */}
          <section className="bg-white rounded-2xl border border-[#d2d2d7] p-6">
            <h2 className="font-semibold text-[#1d1d1f] mb-4 text-sm">Mises à jour récentes</h2>
            <ul className="space-y-4">
              {RECENT_UPDATES.map((u, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                    {u.pro.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1d1d1f]">
                      <Link href={`/annuaire/professionnel/${u.id}`} className="font-medium hover:text-[#0071e3] transition-colors">{u.pro}</Link>
                      {' '}{u.action}
                    </p>
                    <p className="text-xs text-[#6e6e73] mt-0.5">{u.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick links */}
          <section className="bg-white rounded-2xl border border-[#d2d2d7] p-6">
            <h2 className="font-semibold text-[#1d1d1f] mb-4 text-sm">Accès rapides</h2>
            <div className="space-y-1">
              {[
                { href: '/annuaire/professionnels', label: 'Tous les professionnels', count: proActifs },
                { href: '/annuaire/structures', label: 'Toutes les structures', count: strActives },
                { href: '/recherche/competence', label: 'Carte des compétences' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f5f7] transition-colors group"
                >
                  <span className="text-sm text-[#1d1d1f]">{link.label}</span>
                  <span className="flex items-center gap-2 text-[#6e6e73]">
                    {link.count !== undefined && (
                      <span className="text-xs bg-[#f5f5f7] px-2 py-0.5 rounded-full text-[#6e6e73]">{link.count}</span>
                    )}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  )
}
