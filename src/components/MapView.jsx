import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { preloadedIcon, userIcon, eventIcon } from '../utils/icons'

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow,
})


const SLU_CENTER = [38.6366, -90.2345]

function FlyTo({ spot }) {
  const map = useMap()
  useEffect(() => { if (spot) map.flyTo([spot.lat, spot.lng], 18) }, [spot, map])
  return null
}

function openDirections(spot) {
  const go = from => {
    const route = from ? `${from};${spot.lat},${spot.lng}` : `;${spot.lat},${spot.lng}`
    window.open(
      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${route}`,
      '_blank', 'noopener'
    )
  }
  if (!navigator.geolocation) return go(null)
  navigator.geolocation.getCurrentPosition(
    p => go(`${p.coords.latitude},${p.coords.longitude}`),
    () => go(null)
  )
}
function ShowAll({ points }) {
  const map = useMap()
  if (points.length === 0) return null
  return (
    <button className="show-all"
      onClick={() => map.flyToBounds(points.map(p => [p.lat, p.lng]), { padding: [40, 40] })}>
      Show all
    </button>
  )
}
export default function MapView({ spots, events = [], selected, onSelect }) {
  return (
    <MapContainer center={SLU_CENTER} zoom={16} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo spot={selected} />
      <ShowAll points={[...spots, ...events]} />
      {spots.map(s => (
        <Marker key={s.id} position={[s.lat, s.lng]}
          icon={s.source === 'user' ? userIcon : preloadedIcon}
          eventHandlers={{ click: () => onSelect(s.id) }}>
          <Popup>
            <strong>{s.name}</strong><br />
            Traffic {s.fracking}/5<br />
            {s.hours && <>Hours: {s.hours}<br /></>}
            {s.description && <>{s.description}<br /></>}
            {s.busyNow && <> Busy now: {s.busyNow}/5 ({s.busyAgo} min ago)<br /></>}
            <button onClick={() => openDirections(s)}>Get directions</button>
          </Popup>
        </Marker>
      ))}
      {events.map(e => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={eventIcon}
          eventHandlers={{ click: () => onSelect(e.id) }}>
          <Popup>
            <strong>{e.name}</strong><br />
            {e.description && <>{e.description}<br /></>}
            <em>Today only</em><br />
            <button onClick={() => openDirections(e)}>Get directions</button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}