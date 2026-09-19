function Card({ children, className = '', ...props }) {
  return (
    <article className={`card ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}

export default Card;
