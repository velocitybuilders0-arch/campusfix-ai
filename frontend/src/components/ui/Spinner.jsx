function Spinner({ label = 'Loading…', size = 'md' }) {
  const sizeClass = {
    sm: 'spinner--sm',
    md: 'spinner--md',
    lg: 'spinner--lg',
  }[size] || 'spinner--md';

  return (
    <div className="spinner" role="status" aria-live="polite" aria-busy="true">
      <span className={`spinner__icon ${sizeClass}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default Spinner;
