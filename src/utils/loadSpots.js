import {fallbackSpots} from '../data/fallbackSpots'
import { parseCoords } from './parseCoordinates'

const COLUMNS = {
    type: 'What would you like to add to the SLU Map?',
    name: 'What is the name of the spot?',
    coords: 'What is the spot\'s coordinates?',
    focus: 'What is the focus mode?',
    fracking: 'What is the fracking level of the spot?',
}

export function parseCSV(text) {
  const rows = []
  let row = [], cell = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') inQuotes = false
      else cell += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (c !== '\r') cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

export async function loadSpots() {
  const url = import.meta.env.VITE_USER_INPUT_URL
  if (!url) {
    return fallbackSpots
  }
  
  try {
    const res = await fetch(url)
    const [header, ...rows] = parseCSV(await res.text())
    const idx = Object.fromEntries(
      Object.entries(COLUMNS).map(([k, title]) => [k, header.indexOf(title)])
    )
    const formSpots = rows
      .filter(r => r[idx.type] === 'Study spot' && parseCoords(r[idx.coords]))
      .map((r, i) => ({
        id: `spot-${i}`,
        source: 'user',
        name: r[idx.name],
        building: r[idx.notes] || '',
        focus: (r[idx.focus] || '').split(',').map(s => s.trim()).filter(Boolean),
        fracking: Number(r[idx.fracking]) || 3,
        ...parseCoords(r[idx.coords]),
      }))
    return [...fallbackSpots, ...formSpots]
  } catch (err) {
    console.error('Could not load Google Form data, using preloaded spots only:', err)
    return fallbackSpots
  }
}