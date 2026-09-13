import { useState, useRef, useEffect } from "react";

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
  disabled = false,
  onDisabledClick,
}) {
  const [openSort, setOpenSort] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const ref = useRef(null);

  const sortByOptions = {
    createdAt: "Created At",
    title: "Title",
  };

  const orderOptions = {
    desc: "Descending",
    asc: "Ascending",
  };

  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenSort(false);
        setOpenOrder(false);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-wrap items-center gap-3 relative"
      onClick={() => disabled && onDisabledClick?.()}
    >
      <div
        className={`flex flex-wrap items-center gap-3 ${disabled ? "cursor-not-allowed" : ""}`}
        title={disabled ? "No todos available to sort" : ""}
      >
        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 relative">
          <span className="text-sm font-medium text-purple-400">Sort by:</span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setOpenSort(!openSort);
              setOpenOrder(false);
            }}
            className={`flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 text-purple-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }`}
          >
            <span>{sortByOptions[sortBy]}</span>
            <span className="text-xs text-purple-400">▾</span>
          </button>

          {openSort && !disabled && (
            <div className="absolute top-9 left-14 mt-1 min-w-[130px] bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              {Object.entries(sortByOptions).map(([val, label]) => (
                <div
                  key={val}
                  onClick={() => {
                    onSortByChange(val);
                    setOpenSort(false);
                  }}
                  className={`px-3 py-1.5 text-sm transition cursor-pointer text-slate-200 hover:bg-purple-700 hover:text-white ${
                    sortBy === val ? "font-semibold text-purple-300" : ""
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Dropdown */}
        <div className="flex items-center gap-2 relative">
          <span className="text-sm font-medium text-purple-400">Order:</span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setOpenOrder(!openOrder);
              setOpenSort(false);
            }}
            className={`flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 text-purple-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }`}
          >
            <span>{orderOptions[sortDirection]}</span>
            <span className="text-xs text-purple-400">▾</span>
          </button>

          {openOrder && !disabled && (
            <div className="absolute top-9 left-12 mt-1 min-w-[130px] bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              {Object.entries(orderOptions).map(([val, label]) => (
                <div
                  key={val}
                  onClick={() => {
                    onSortDirectionChange(val);
                    setOpenOrder(false);
                  }}
                  className={`px-3 py-1.5 text-sm transition cursor-pointer text-slate-200 hover:bg-purple-700 hover:text-white ${
                    sortDirection === val ? "font-semibold text-purple-300" : ""
                  }`}

                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SortBy;

