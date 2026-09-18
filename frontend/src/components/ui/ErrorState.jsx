function ErrorState({ title = 'Something went wrong', message }) {
  return (
    <div className="error-state" role="alert">
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

export default ErrorState;
