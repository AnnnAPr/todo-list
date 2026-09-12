function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
  disabled = false,
  onDisabledClick,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        onClick={() => disabled && onDisabledClick?.()}
        className={`flex flex-wrap items-center gap-3 ${disabled ? "cursor-not-allowed" : ""}`}
        title={disabled ? "No todos available to sort" : ""}
      >
        <div className="flex items-center gap-2">
          <label
            htmlFor="sortBy"
            className="text-sm font-medium text-purple-400"
          >
            Sort by:
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={sortBy}
            disabled={disabled}
            onChange={(event) => onSortByChange(event.target.value)}
            className={`bg-slate-900/90 border border-slate-700/70 text-slate-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }`}
          >
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="order"
            className="text-sm font-medium text-purple-400"
          >
            Order:
          </label>
          <select
            id="order"
            name="order"
            value={sortDirection}
            disabled={disabled}
            onChange={(event) => onSortDirectionChange(event.target.value)}
            className={`bg-slate-900/90 border border-slate-700/70 text-slate-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }`}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SortBy;
