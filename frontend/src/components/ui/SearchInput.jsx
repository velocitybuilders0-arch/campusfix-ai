import { useId } from 'react';

function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search', id }) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="search-input">
      <label className="sr-only" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type="search"
        className="search-input__input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <button
          type="button"
          className="search-input__clear"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export default SearchInput;
