import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'

export const metadata: Metadata = {
  title: { default: 'Annuaire CPTS Tamalou', template: '%s — CPTS Tamalou' },
  description: 'Annuaire des professionnels de santé du Finistère — CPTS Tamalou. Recherchez par pathologie, compétence ou nom.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a href="#main-content" className="skip-link">Aller au contenu principal</a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
