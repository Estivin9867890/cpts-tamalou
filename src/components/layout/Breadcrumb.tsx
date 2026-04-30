import Link from 'next/link'
import clsx from 'clsx'

interface Crumb { label: string; href?: string }

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>}
          {crumb.href && i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-blue-600 transition-colors">{crumb.label}</Link>
          ) : (
            <span className={clsx(i === crumbs.length - 1 ? 'text-slate-700 font-medium' : '')} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
