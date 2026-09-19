function FormField({ label, required = false, htmlFor, error, children }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={htmlFor}>
        <span>{label}</span>
        {required ? <span className="field__required" aria-label="required">*</span> : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </label>
      {children}
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
