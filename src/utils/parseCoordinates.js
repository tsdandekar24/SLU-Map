export function parseCoords(text = '') {
  const m = text.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/)
  return m ? { lat: Number(m[1]), lng: Number(m[2]) } : null
}