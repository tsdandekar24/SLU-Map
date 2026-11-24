import L from 'leaflet'

const make = (cls, symbol) => L.divIcon({
    className: `pin ${cls}`,
    html: symbol,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
})

export const preloadedIcon = make('pin-preloaded', '📚')
export const userIcon = make('pin-user', '📍')
export const eventIcon = make('pin-event', '★')