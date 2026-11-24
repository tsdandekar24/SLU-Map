import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export default function BusyForm({ spots }) {
  const [spot, setSpot] = useState('')
  const [level, setLevel] = useState(3)
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!spot) return setStatus('Pick a spot first.')
    try {
      await addDoc(collection(db, 'busyUpdates'), {
        spot, level, createdAt: serverTimestamp(),
      })
      setStatus('Thanks! Your update is live.')
    } catch (err) {
      console.error(err)
      setStatus('Could not post. Please try again.')
    }
  }

  return (
    <form className="busy-form" onSubmit={handleSubmit}>
      <h2 className="list-title">How busy is it right now?</h2>
      <select value={spot} onChange={e => setSpot(e.target.value)}>
        <option value="">Choose a spot</option>
        {spots.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
      </select>
      <label>
        Level: {level} <span className="hint">(1 empty – 5 packed)</span>
        <input type="range" min="1" max="5" value={level}
          onChange={e => setLevel(Number(e.target.value))} />
      </label>
      <button type="submit">Post update</button>
      {status && <p role="status">{status}</p>}
    </form>
  )
}