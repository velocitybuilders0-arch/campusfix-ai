import Badge from '../ui/Badge';

function priorityTone(priority) {
  switch (priority?.toUpperCase()) {
    case 'LOW':
      return 'muted';
    case 'MEDIUM':
      return 'info';
    case 'HIGH':
      return 'warning';
    case 'CRITICAL':
      return 'danger';
    default:
      return 'muted';
  }
}

function AIClassificationCard({ data, loading = false, error }) {
  return (
    <div className="ai-card" role="region" aria-label="AI classification">
      <h3 className="ai-card__title">AI Classification</h3>
      {loading ? (
        <div className="ai-card__skeleton">
          <div className="skeleton ai-card__skeleton-row" />
          <div className="skeleton ai-card__skeleton-row" />
          <div className="skeleton ai-card__skeleton-row" />
        </div>
      ) : error ? (
        <p className="ai-card__error" role="alert">{error}</p>
      ) : data ? (
        <dl className="ai-card__list">
          <div className="ai-card__row">
            <dt>Category</dt>
            <dd>{data.category || '—'}</dd>
          </div>
          <div className="ai-card__row">
            <dt>Priority</dt>
            <dd>
              {data.priority ? <Badge variant={priorityTone(data.priority)}>{data.priority}</Badge> : '—'}
            </dd>
          </div>
          <div className="ai-card__row">
            <dt>Department</dt>
            <dd>{data.department || '—'}</dd>
          </div>
          <div className="ai-card__row">
            <dt>Summary</dt>
            <dd>{data.summary || '—'}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}

export default AIClassificationCard;
