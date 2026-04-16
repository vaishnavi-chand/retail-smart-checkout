export default function SearchBar({ query, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon">&#128269;</span>
      <input
        type="text"
        className="search-input"
        placeholder='Search products (e.g. apple, milk, fruits...)'
        value={query}
        onChange={e => onChange(e.target.value)}
        autoFocus
      />
      {query && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear">
          &#10005;
        </button>
      )}
    </div>
  )
}
