'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'
import { useAuth } from '@/providers/AuthProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/connexion')
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1d4ed8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#6e6e73] text-sm">Chargement…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
