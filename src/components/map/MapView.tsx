import dynamic from 'next/dynamic'
import type { Professionnel } from '@/types'

interface Props {
  professionnels: Professionnel[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  center?: [number, number]
  zoom?: number
}

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-slate-400 text-sm">Chargement de la carte…</p>
      </div>
    </div>
  ),
})

export default function MapView(props: Props) {
  return <MapInner {...props} />
}
