import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

// Makes busy updates expire after 2 hours
const WINDOW_MS = 2 * 60 * 60 * 1000   

export function useBusy() {
  const [updates, setUpdates] = useState([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const since = Timestamp.fromMillis(Date.now() - WINDOW_MS)
    const q = query(collection(db, 'busyUpdates'), where('createdAt', '>', since))
    return onSnapshot(
      q,
      snap => setUpdates(snap.docs.map(d => d.data())),
      err => console.error('Could not load busy updates:', err)
    )
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    const latest = {}
    for (const u of updates) {
      const at = u.createdAt?.toMillis?.() ?? Date.now() 
      if (at < now - WINDOW_MS) continue
      if (!latest[u.spot] || at > latest[u.spot].at) latest[u.spot] = { level: u.level, at }
    }
    return latest
  }, [updates, now])
}