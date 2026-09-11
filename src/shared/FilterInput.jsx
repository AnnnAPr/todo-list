function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className="flex items-end gap-3 my-3">
      <div className="flex flex-col gap-1.5 flex-1">
        <label
          htmlFor="filterInput"
          className="text-sm font-medium text-purple-200"
        >
          Search todos:
        </label>
        <input
          id="filterInput"
          type="text"
          value={filterTerm}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Search by title..."
          className="w-full bg-purple-950/60 border border-purple-700/60 text-purple-100 placeholder-purple-400/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>
      <div className="w-[102px] shrink-0" />
    </div>
  );
}

export default FilterInput;
