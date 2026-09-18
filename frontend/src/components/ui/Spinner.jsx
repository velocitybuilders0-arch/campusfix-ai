function Spinner({ label = 'Loading' }) {
  return (
    <div className="spinner" role="status" aria-live="polite" aria-busy="true">
      <span className="spinner__icon" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default Spinner;
