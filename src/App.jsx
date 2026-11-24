import { useEffect, useState } from 'react'
import { loadSpots } from './utils/loadSpots'
import { loadEvents } from './utils/loadEvents'
import { useBusy } from './utils/useBusy'
import Filters from './components/Filters'
import DataList from './components/DataList'
import EventList from './components/EventList'
import BusyForm from './components/BusyForm'
import MapView from './components/MapView'
import './App.css'

export default function App() {
  const [spots, setSpots] = useState([])
  const [events, setEvents] = useState([])
  const busy = useBusy()
  const [selectedId, setSelectedId] = useState(null)
  const [filters, setFilters] = useState({ focus: 'All', maxFracking: 5, showEvents: true })

  useEffect(() => { loadSpots().then(setSpots) }, [])

  // Load today's events now, then reload right after midnight
  useEffect(() => {
    let timer
    const refresh = () => {
      loadEvents().then(setEvents)
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timer = setTimeout(refresh, midnight - now + 1000)
    }
    refresh()
    return () => clearTimeout(timer)
  }, [])

  // Attaches the latest busy rating to each spot
  const spotsLive = spots.map(s => {
    const b = busy[s.name]
    return b
      ? { ...s, busyNow: b.level, busyAgo: Math.max(1, Math.round((Date.now() - b.at) / 60000)) }
      : s
  })

  const visible = spotsLive.filter(s =>
    (filters.focus === 'All' || s.focus.includes(filters.focus)) &&
    (s.busyNow ?? s.fracking) <= filters.maxFracking
  )

  const shownEvents = filters.showEvents ? events : []
  const selected = [...visible, ...shownEvents].find(s => s.id === selectedId) || null

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>SLU Spots</h1>
        {import.meta.env.VITE_ADD_FORM_URL && (
          <a className="add-link" href={import.meta.env.VITE_ADD_FORM_URL}
             target="_blank" rel="noopener noreferrer">
            + Add a study spot or event
          </a>
        )}
        <Filters filters={filters} onChange={setFilters} />
        <EventList events={shownEvents} onSelect={setSelectedId} />
        <DataList spots={visible} selectedId={selectedId} onSelect={setSelectedId} />
        <BusyForm spots={spots} />
      </aside>
      <main>
        <MapView spots={visible} events={shownEvents} selected={selected} onSelect={setSelectedId} />
      </main>
    </div>
  )
}