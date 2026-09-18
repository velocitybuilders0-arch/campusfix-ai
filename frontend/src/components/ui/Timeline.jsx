function Timeline({ items, emptyLabel = 'No activity yet.' }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="timeline__empty">{emptyLabel}</p>;
  }

  return (
    <ol className="timeline">
      {items.map((item) => (
        <li className="timeline__item" key={item.id}>
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__content">
            <p className="timeline__message">{item.message || '—'}</p>
            <time className="timeline__time" dateTime={item.createdAt}>
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default Timeline;
