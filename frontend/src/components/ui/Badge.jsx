function Badge({ children, variant = 'muted' }) {
  const variantClass = `badge badge--${variant}`;

  return <span className={variantClass}>{children}</span>;
}

export default Badge;
