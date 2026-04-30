'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Professionnel } from '@/types'
import { getSpecialiteById, getStructureById } from '@/data/mockData'

interface Props {
  professionnels: Professionnel[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  center?: [number, number]
  zoom?: number
}

function createMarker(selected: boolean, accepte: boolean | undefined): L.DivIcon {
  const ring = selected ? '#1d4ed8' : accepte === false ? '#ef4444' : '#3b82f6'
  const bg = selected ? '#dbeafe' : 'white'
  const size = selected ? 48 : 40

  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${bg};
      border:3px solid ${ring};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${selected ? 22 : 18}px;
      box-shadow:0 2px 10px rgba(0,0,0,0.2)${selected ? ',0 0 0 6px rgba(29,78,216,0.15)' : ''};
      cursor:pointer;
      transition:all .15s;
    ">🩺</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const userIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:18px;height:18px;">
    <div class="user-loc-pulse" style="position:absolute;inset:0;background:rgba(37,99,235,0.3);border-radius:50%;"></div>
    <div style="position:absolute;top:3px;left:3px;right:3px;bottom:3px;background:#2563eb;border-radius:50%;border:2px solid white;box-shadow:0 0 0 2px rgba(37,99,235,0.4);"></div>
  </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function MapEvents({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: onMapClick })
  return null
}

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => { map.setView(center, zoom, { animate: true }) }, [map, center, zoom])
  return null
}

function PopupContent({ pro }: { pro: Professionnel }) {
  const spec = getSpecialiteById(pro.id_specialite)
  const struct = getStructureById(pro.structures[0]?.id_structure)
  const initials = `${pro.prenom[0]}${pro.nom[0]}`

  return (
    <div style={{ minWidth: '220px', padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
          {initials.toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>{pro.titre && `${pro.titre} `}{pro.prenom} {pro.nom}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{spec?.libelle}</div>
        </div>
      </div>
      {struct && <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>📍 {struct.nom}, {struct.ville}</div>}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {pro.accepte_nouveaux_patients === true && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: '#d1fae5', color: '#065f46', fontWeight: '500' }}>Accepte patients</span>}
        {pro.teleconsultation && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: '#dbeafe', color: '#1e40af', fontWeight: '500' }}>🖥 Téléconsult.</span>}
      </div>
      <a href={`/annuaire/professionnel/${pro.id}`}
        style={{ display: 'block', textAlign: 'center', padding: '7px', background: '#1d4ed8', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
        Voir la fiche →
      </a>
    </div>
  )
}

export default function MapInner({ professionnels, selectedId, onSelect, center = [48.3904, -4.4861], zoom = 10 }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
        detectRetina
      />

      <Recenter center={center} zoom={zoom} />
      <MapEvents onMapClick={() => onSelect(null)} />

      <Marker position={center} icon={userIcon} interactive={false} />

      {professionnels.map(pro => (
        <Marker
          key={pro.id}
          position={[pro.lat, pro.lng]}
          icon={createMarker(selectedId === pro.id, pro.accepte_nouveaux_patients)}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e)
              onSelect(selectedId === pro.id ? null : pro.id)
            }
          }}
        >
        </Marker>
      ))}
    </MapContainer>
  )
}
