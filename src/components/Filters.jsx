const FOCUS_OPTIONS = ['All', 'Studying', 'Hang out', 'Collaborative']

export default function Filters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })
  return (
    <section className="filters" aria-label="Filters">
      <label>
        Vibe
        <select value={filters.focus} onChange={e => set('focus', e.target.value)}>
          {FOCUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label>
        Traffic up to {filters.maxFracking} <span className="hint">(1 empty – 5 packed)</span>
        <input type="range" min="1" max="5" value={filters.maxFracking}
          onChange={e => set('maxFracking', Number(e.target.value))} />
      </label>
      <label className="check">
        <input type = "checkbox" checked = {filters.showEvents} 
          onChange = {e => set('showEvents', e.target.checked)}
        />
        Events happening today
      </label>
    </section>
  )
}
