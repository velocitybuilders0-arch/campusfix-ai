function FilterBar({ filters, options, onChange, onClear }) {
  const hasActiveFilters = Array.isArray(filters) && filters.some((filter) => filter && filter.value);

  return (
    <div className="filter-bar" role="group" aria-label="Filters">
      {filters.map((filter) => (
        <label className="filter-bar__label" key={filter.key}>
          <span className="filter-bar__label-text">{filter.label}</span>
          <select
            className="filter-bar__select"
            value={filter.value || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
          >
            <option value="">All {filter.label.toLowerCase()}s</option>
            {(options[filter.key] || []).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      ))}

      {hasActiveFilters && typeof onClear === 'function' ? (
        <button type="button" className="filter-bar__clear" onClick={onClear}>
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

export default FilterBar;
