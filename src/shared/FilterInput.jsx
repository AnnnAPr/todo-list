function FilterInput({
  filterTerm,
  onFilterChange,
  disabled,
  onDisabledClick,
}) {
  return (
    <div className="flex items-end gap-3 my-3">
      <div className="flex flex-col gap-1.5 flex-1">
        <label
          htmlFor="filterInput"
          className="text-sm font-medium text-purple-200"
        >
          Search todos:
        </label>

        <div
          onClick={() => disabled && onDisabledClick?.()}
          className={disabled ? "cursor-not-allowed" : ""}
          title={disabled ? "No todos available to search" : ""}
        >
          <input
            id="filterInput"
            type="text"
            value={filterTerm}
            disabled={disabled}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder={
              disabled ? "No todos to search..." : "Search by title..."
            }
            className={`w-full bg-purple-950/60 border border-purple-700/60 text-purple-100 placeholder-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
              disabled ? "opacity-50 pointer-events-none" : ""
            }`}
          />
        </div>
      </div>
      <div className="w-25.5 shrink-0" />
    </div>
  );
}

export default FilterInput;
