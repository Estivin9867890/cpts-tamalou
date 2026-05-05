'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { DEMO_CREDENTIALS } from '@/data/mockData'

export default function ConnexionPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    try {
      await login(email, password)
      router.replace('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(email: string) {
    setEmail(email)
    setPassword('demo123')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#1d1d1f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#1d1d1f] flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">A+</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Annuaire CPTS Tamalou</h1>
          <p className="text-[#6e6e73] text-sm mt-1.5">Professionnels de santé — Finistère</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-8 py-7">
            <h2 className="text-base font-semibold text-[#1d1d1f] mb-6">Connexion à votre espace</h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
                  Adresse e-mail professionnelle
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="prenom.nom@etablissement.fr"
                  required
                  aria-required="true"
                  className="w-full px-4 py-2.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    aria-required="true"
                    className="w-full px-4 py-2.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3] transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#6e6e73] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-center gap-2 text-[#ff3b30] text-sm bg-[#fff5f5] border border-[#ffd2d2] rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion en cours…
                  </span>
                ) : 'Se connecter'}
              </button>
            </form>
          </div>

          {/* Demo accounts */}
          <div className="bg-[#f5f5f7] border-t border-[#d2d2d7] px-8 py-5">
            <p className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-widest mb-3">Comptes de démonstration</p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map(cred => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => fillDemo(cred.email)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-xs hover:border-[#0071e3] transition-colors text-left"
                >
                  <span className="text-[#1d1d1f] font-medium">{cred.label}</span>
                  <span className="text-[#6e6e73] font-mono">{cred.email}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#6e6e73] mt-2.5">
              Mot de passe universel : <span className="font-mono font-medium text-[#1d1d1f]">demo123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-[#6e6e73] text-xs mt-6">
          Accès réservé aux professionnels de santé de la CPTS Tamalou
        </p>
      </div>
    </div>
  )
}
