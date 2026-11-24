export default function EventList({events, onSelect}) {
    if (events.length === 0) {
        return null
    }

    return (
    <section className="events">
      <h2>Happening today</h2>
      <ul className="spot-list">
        {events.map(e => (
          <li key={e.id}>
            <button className="spot" onClick={() => onSelect(e.id)}>
              <strong>{e.name}</strong>
              {e.description && <span>{e.description}</span>}
            </button>
          </li>
        ))}
      </ul>
    </section>
    )
}  