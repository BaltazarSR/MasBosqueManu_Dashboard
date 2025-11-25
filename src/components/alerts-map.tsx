"use client"

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { z } from 'zod'

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom icons for open/closed alerts
const openIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCAzMCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMEMyMi4zNjQ0IDAgMjguNSA2LjEzNTU4IDI4LjUgMTMuNUMyOC41IDE4Ljk0OTIgMjUuNTM0MyAyMy42ODI5IDIxLjI4MDIgMjYuMTk4OEwxNSA0NUw4LjcxOTggMjYuMTk4OEM0LjQ2NTY4IDIzLjY4MjkgMS41IDIwLjQwNDggMS41IDEzLjVDMS41IDYuMTM1NTggNy42MzU1OCAwIDE1IDBaIiBmaWxsPSIjRUYzNDNCIi8+PHBhdGggZD0iTTE1IDJDMjEuMzI3NCAyIDI2LjUgNy4xNzI1OCAyNi41IDEzLjVDMjYuNSAxOC40MDQ4IDIzLjg3MzEgMjIuNjMyOSAyMCA5LjU3MTRMMTUgNDJMMTAgMjkuNTcxNEM2LjEyNjkgMjIuNjMyOSAzLjUgMTguNDA0OCAzLjUgMTMuNUMzLjUgNy4xNzI1OCA4LjY3MjU4IDIgMTUgMloiIGZpbGw9IiNFRjQ0NEIiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjEzLjUiIHI9IjYiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -45],
})

const closedIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCAzMCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMEMyMi4zNjQ0IDAgMjguNSA2LjEzNTU4IDI4LjUgMTMuNUMyOC41IDE4Ljk0OTIgMjUuNTM0MyAyMy42ODI5IDIxLjI4MDIgMjYuMTk4OEwxNSA0NUw4LjcxOTggMjYuMTk4OEM0LjQ2NTY4IDIzLjY4MjkgMS41IDIwLjQwNDggMS41IDEzLjVDMS41IDYuMTM1NTggNy42MzU1OCAwIDE1IDBaIiBmaWxsPSIjMjJDNTVFIi8+PHBhdGggZD0iTTE1IDJDMjEuMzI3NCAyIDI2LjUgNy4xNzI1OCAyNi41IDEzLjVDMjYuNSAxOC40MDQ4IDIzLjg3MzEgMjIuNjMyOSAyMCA5LjU3MTRMMTUgNDJMMTAgMjkuNTcxNEM2LjEyNjkgMjIuNjMyOSAzLjUgMTguNDA0OCAzLjUgMTMuNUMzLjUgNy4xNzI1OCA4LjY3MjU4IDIgMTUgMloiIGZpbGw9IiMxNkE4NEEiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjEzLjUiIHI9IjYiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -45],
})

type Alert = {
  id: string
  status: string
  name: string
  profile_picture: string | null
  lat: number
  lng: number
  created_at: string
  closed_at: string | null
}

function FitBounds({ alerts }: { alerts: Alert[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (alerts.length === 0) return
    
    const bounds = L.latLngBounds(alerts.map(alert => [alert.lat, alert.lng]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [map, alerts])
  
  return null
}

export function AlertsMap({ alerts }: { alerts: Alert[] }) {
  const center: [number, number] = alerts.length > 0 
    ? [alerts[0].lat, alerts[0].lng]
    : [25.6866, -100.3161] // Default to Monterrey

  return (
    <div className="h-[calc(100vh-12rem)] w-full rounded-lg overflow-hidden border shadow-sm">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {alerts.map((alert) => (
          <Marker 
            key={alert.id} 
            position={[alert.lat, alert.lng]}
            icon={alert.status === 'open' ? openIcon : closedIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{alert.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Estado: <span className={alert.status === 'open' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                    {alert.status === 'open' ? 'Activa' : 'Resuelta'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(alert.created_at).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds alerts={alerts} />
      </MapContainer>
    </div>
  )
}
