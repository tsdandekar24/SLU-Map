export default function DataList({ spots, selectedId, onSelect }) {
  return (
    <section className="spots">
      <h2 className="list-title">Study spots</h2>
      {spots.length === 0 ? (
        <p className="empty">No spots match. Try raising the fracking limit.</p>
      ) : (
        <ul className="spot-list">
          {spots.map(s => (
            <li key={s.id}>
              <button className={s.id === selectedId ? 'spot selected' : 'spot'}
                onClick={() => onSelect(s.id)}>
                <strong>{s.name}</strong>
                <span>{s.building}</span>
                <span>Traffic {s.fracking}/5</span>
                {s.busyNow && (
                  <span className="live">Busy now: {s.busyNow}/5 · {s.busyAgo} min ago</span>
                )}
                {s.hours && <span>Hours: {s.hours}</span>}
                {s.description && <span>{s.description}</span>}
                <span className="tags">{s.focus.join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
