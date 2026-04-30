'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import clsx from 'clsx'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  MEDECIN: 'Médecin',
  AUTRE_PRO: 'Professionnel de santé',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  MEDECIN: 'bg-blue-100 text-blue-700',
  AUTRE_PRO: 'bg-teal-100 text-teal-700',
}

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  {
    label: 'Rechercher', href: '#',
    children: [
      { label: 'Par pathologie', href: '/recherche/pathologie', icon: '🩺' },
      { label: 'Par compétence (carte)', href: '/recherche/competence', icon: '🗺️' },
      { label: 'Par nom / structure', href: '/recherche/nom', icon: '🔍' },
    ],
  },
  {
    label: 'Annuaire', href: '#',
    children: [
      { label: 'Professionnels', href: '/annuaire/professionnels', icon: '👨‍⚕️' },
      { label: 'Structures', href: '/annuaire/structures', icon: '🏥' },
    ],
  },
]

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setMobileOpen(false); setOpenMenu(null) }, [pathname])

  function handleLogout() {
    logout()
    router.push('/connexion')
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16" ref={menuRef}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="CPTS Tamalou — Accueil">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
              <span className="text-white font-bold text-sm leading-none">A+</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-slate-800 text-sm leading-tight">Annuaire CPTS</div>
              <div className="text-[11px] text-slate-400 leading-tight">Tamalou — Finistère</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {NAV_LINKS.map(link => (
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === link.label ? null : link.label)}
                    aria-expanded={openMenu === link.label}
                    aria-haspopup="true"
                    className={clsx(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      openMenu === link.label
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    {link.label}
                    <svg className={clsx('w-3.5 h-3.5 transition-transform', openMenu === link.label && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" /></svg>
                  </button>

                  {openMenu === link.label && (
                    <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 fade-in" role="menu">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          className={clsx(
                            'flex items-center gap-2.5 px-4 py-2 text-sm transition-colors',
                            pathname === child.href
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <span>{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </Link>
              )
            ))}
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith('/admin')
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                Administration
              </Link>
            )}
            {user.role === 'MEDECIN' && (
              <Link
                href="/mon-profil"
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === '/mon-profil'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                Mon profil
              </Link>
            )}
          </nav>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label={`Menu utilisateur — ${user.prenom} ${user.nom}`}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user.avatar}</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{user.prenom} {user.nom}</div>
                <span className={clsx('text-[10px] px-1.5 py-0.5 rounded-full font-medium', ROLE_COLORS[user.role])}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
              <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" /></svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 fade-in" role="menu">
                {user.role === 'MEDECIN' && (
                  <Link href="/mon-profil" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                    Mon profil
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/admin" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    Administration
                  </Link>
                )}
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  role="menuitem"
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg>
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menu de navigation"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 fade-in">
            {NAV_LINKS.flatMap(link =>
              link.children
                ? link.children.map(c => (
                  <Link key={c.href} href={c.href} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                    <span>{c.icon}</span> {c.label}
                  </Link>
                ))
                : [<Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">{link.label}</Link>]
            )}
            {user.role === 'ADMIN' && <Link href="/admin" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Administration</Link>}
            {user.role === 'MEDECIN' && <Link href="/mon-profil" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Mon profil</Link>}
          </div>
        )}
      </div>
    </header>
  )
}
