function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Sort By Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sortBy" className="text-sm font-medium text-purple-200">
          Sort by:
        </label>
        <select
          id="sortBy"
          name="sortBy"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
          className="bg-purple-950/70 border border-purple-700/60 text-purple-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="createdAt" className="bg-purple-950 text-slate-100">
            Created At
          </option>
          <option value="title" className="bg-purple-950 text-slate-100">
            Title
          </option>
        </select>
      </div>
      {/* Order Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="order" className="text-sm font-medium text-purple-200">
          Order:
        </label>
        <select
          id="order"
          name="order"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
          className="bg-purple-950/70 border border-purple-700/60 text-purple-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="desc" className="bg-purple-950 text-slate-100">
            Descending
          </option>
          <option value="asc" className="bg-purple-950 text-slate-100">
            Ascending
          </option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;
