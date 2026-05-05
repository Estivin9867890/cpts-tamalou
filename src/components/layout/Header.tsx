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

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  {
    label: 'Rechercher', href: '#',
    children: [
      { label: 'Par pathologie', href: '/recherche/pathologie' },
      { label: 'Par compétence (carte)', href: '/recherche/competence' },
      { label: 'Par nom / structure', href: '/recherche/nom' },
    ],
  },
  {
    label: 'Annuaire', href: '#',
    children: [
      { label: 'Professionnels', href: '/annuaire/professionnels' },
      { label: 'Structures', href: '/annuaire/structures' },
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#d2d2d7]" role="banner">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14" ref={menuRef}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="CPTS Tamalou — Accueil">
            <div className="w-8 h-8 rounded-lg bg-[#1d1d1f] flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none tracking-tight">A+</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-[#1d1d1f] text-sm leading-tight">Annuaire CPTS</div>
              <div className="text-[10px] text-[#6e6e73] leading-tight">Tamalou — Finistère</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Navigation principale">
            {NAV_LINKS.map(link => (
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === link.label ? null : link.label)}
                    aria-expanded={openMenu === link.label}
                    aria-haspopup="true"
                    className={clsx(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors',
                      openMenu === link.label
                        ? 'text-[#0071e3]'
                        : 'text-[#1d1d1f] hover:text-[#0071e3]'
                    )}
                  >
                    {link.label}
                    <svg className={clsx('w-3 h-3 transition-transform', openMenu === link.label && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" /></svg>
                  </button>

                  {openMenu === link.label && (
                    <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-[#d2d2d7] rounded-xl shadow-sm py-1 fade-in" role="menu">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          className={clsx(
                            'block px-4 py-2 text-sm transition-colors',
                            pathname === child.href
                              ? 'text-[#0071e3] bg-[#f5f5f7]'
                              : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                          )}
                        >
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
                    'px-3 py-2 rounded-lg text-sm transition-colors',
                    pathname === link.href
                      ? 'text-[#0071e3]'
                      : 'text-[#1d1d1f] hover:text-[#0071e3]'
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
                  'px-3 py-2 rounded-lg text-sm transition-colors',
                  pathname.startsWith('/admin')
                    ? 'text-[#0071e3]'
                    : 'text-[#1d1d1f] hover:text-[#0071e3]'
                )}
              >
                Administration
              </Link>
            )}
            {user.role === 'MEDECIN' && (
              <Link
                href="/mon-profil"
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm transition-colors',
                  pathname === '/mon-profil'
                    ? 'text-[#0071e3]'
                    : 'text-[#1d1d1f] hover:text-[#0071e3]'
                )}
              >
                Mon profil
              </Link>
            )}
          </nav>

          {/* User menu */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label={`Menu utilisateur — ${user.prenom} ${user.nom}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#f5f5f7] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                <span className="text-white text-[11px] font-semibold">{user.avatar}</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[#1d1d1f] leading-tight">{user.prenom} {user.nom}</div>
                <div className="text-[10px] text-[#6e6e73] leading-tight">{ROLE_LABELS[user.role]}</div>
              </div>
              <svg className="w-3.5 h-3.5 text-[#6e6e73] hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" /></svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-[#d2d2d7] rounded-xl shadow-sm py-1 fade-in" role="menu">
                {user.role === 'MEDECIN' && (
                  <Link href="/mon-profil" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
                    <svg className="w-4 h-4 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                    Mon profil
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/admin" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
                    <svg className="w-4 h-4 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    Administration
                  </Link>
                )}
                <div className="border-t border-[#f5f5f7] my-1" />
                <button
                  onClick={handleLogout}
                  role="menuitem"
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#ff3b30] hover:bg-[#f5f5f7] transition-colors text-left"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg>
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#f5f5f7] transition-colors ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menu de navigation"
          >
            <svg className="w-5 h-5 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#f5f5f7] py-2 space-y-0.5 fade-in">
            {NAV_LINKS.flatMap(link =>
              link.children
                ? link.children.map(c => (
                  <Link key={c.href} href={c.href} className="block px-4 py-2.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg">
                    {c.label}
                  </Link>
                ))
                : [<Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg">{link.label}</Link>]
            )}
            {user.role === 'ADMIN' && <Link href="/admin" className="block px-4 py-2.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg">Administration</Link>}
            {user.role === 'MEDECIN' && <Link href="/mon-profil" className="block px-4 py-2.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg">Mon profil</Link>}
          </div>
        )}
      </div>
    </header>
  )
}
