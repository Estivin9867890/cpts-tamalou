'use client'

import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/providers/AuthProvider'
import { professionnels, structures, competences, pathologies } from '@/data/mockData'

const ROLE_GREET: Record<string, string> = {
  ADMIN: 'Bienvenue,',
  MEDECIN: 'Bonjour,',
  AUTRE_PRO: 'Bonjour,',
}

const SEARCH_CARDS = [
  {
    href: '/recherche/pathologie',
    icon: '🩺',
    title: 'Recherche par pathologie',
    desc: 'Trouvez un professionnel selon la maladie ou affection dont souffre votre patient.',
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    btn: 'bg-blue-700 text-white hover:bg-blue-600',
  },
  {
    href: '/recherche/competence',
    icon: '🗺️',
    title: 'Recherche par compétence',
    desc: 'Localisez des experts sur la carte interactive du Finistère par domaine de compétence.',
    color: 'from-teal-500 to-teal-700',
    bg: 'bg-teal-50 border-teal-200 hover:border-teal-400',
    btn: 'bg-teal-700 text-white hover:bg-teal-600',
  },
  {
    href: '/recherche/nom',
    icon: '🔍',
    title: 'Recherche par nom',
    desc: 'Retrouvez directement un professionnel ou une structure par son nom.',
    color: 'from-violet-500 to-violet-700',
    bg: 'bg-violet-50 border-violet-200 hover:border-violet-400',
    btn: 'bg-violet-700 text-white hover:bg-violet-600',
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
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="max-w-2xl">
            <p className="text-blue-300 text-sm font-medium mb-1">{user && ROLE_GREET[user.role]}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {user?.prenom} {user?.nom}
            </h1>
            <p className="text-blue-200 text-base leading-relaxed">
              Bienvenue dans l&apos;annuaire des professionnels de santé de la <strong>CPTS Tamalou</strong>.<br />
              Orientez vos patients vers les bons interlocuteurs du Finistère.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Professionnels', value: proActifs, icon: '👨‍⚕️' },
            { label: 'Structures', value: strActives, icon: '🏥' },
            { label: 'Compétences', value: competences.filter(c => c.est_active).length, icon: '⭐' },
            { label: 'Pathologies', value: pathologies.filter(p => p.est_active).length, icon: '📋' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search cards */}
        <section aria-labelledby="search-title">
          <h2 id="search-title" className="text-lg font-semibold text-slate-800 mb-4">Lancer une recherche</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {SEARCH_CARDS.map(card => (
              <div key={card.href} className={`bg-white rounded-2xl border-2 transition-all p-6 flex flex-col ${card.bg}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5">{card.desc}</p>
                <Link href={card.href} className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${card.btn}`}>
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
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-700 rounded-full inline-block" />
              Mises à jour récentes
            </h2>
            <ul className="space-y-3">
              {RECENT_UPDATES.map((u, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                    {u.pro.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <Link href={`/annuaire/professionnel/${u.id}`} className="font-medium hover:text-blue-700">{u.pro}</Link>
                      {' '}{u.action}
                    </p>
                    <p className="text-xs text-slate-400">{u.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick links */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-teal-600 rounded-full inline-block" />
              Accès rapides
            </h2>
            <div className="space-y-2">
              {[
                { href: '/annuaire/professionnels', label: 'Tous les professionnels', icon: '👨‍⚕️', count: proActifs },
                { href: '/annuaire/structures', label: 'Toutes les structures', icon: '🏥', count: strActives },
                { href: '/recherche/competence', label: 'Carte des compétences', icon: '🗺️' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                  <span className="flex items-center gap-2.5 text-sm text-slate-700 group-hover:text-slate-900">
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </span>
                  <span className="flex items-center gap-2 text-slate-400">
                    {link.count && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{link.count}</span>}
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
