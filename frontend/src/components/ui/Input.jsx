function Input({ id, label, required = false, error, ...props }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        {required ? <span className="field__required" aria-label="required">*</span> : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </label>
      <input id={id} className="field__input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
