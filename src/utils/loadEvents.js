import { parseCSV } from './loadSpots'
import { parseCoords } from './parseCoordinates'


const COLUMNS = {
    type: 'What would you like to add to the SLU Map?',
    name: 'What is the event?',
    date: 'What is the event\'s date?',
    description: 'What is the purpose of the event?',
    coords: 'What is the event\'s coordinates?'
}

export async function loadEvents() {
  const url = import.meta.env.VITE_USER_INPUT_URL
  if (!url) return []
  try {
    const res = await fetch(url)
    const [header, ...rows] = parseCSV(await res.text())
    const idx = Object.fromEntries(
      Object.entries(COLUMNS).map(([k, title]) => [k, header.indexOf(title)])
    )
    const today = new Date().toDateString()
    return rows
      .filter(r => r[idx.type] === 'Event' && parseCoords(r[idx.coords])
        && new Date(r[idx.date]).toDateString() === today)
      .map((r, i) => ({
        id: `event-${i}`,
        name: r[idx.name],
        description: r[idx.description] || '',
        ...parseCoords(r[idx.coords]),
      }))
  } catch (err) {
    console.error('Could not load events:', err)
    return []
  }
}