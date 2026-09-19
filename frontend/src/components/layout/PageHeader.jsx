function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="page__header">
      <div>
        <h1 className="page__title">{title}</h1>
        {subtitle ? <p className="page__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </header>
  );
}

export default PageHeader;
