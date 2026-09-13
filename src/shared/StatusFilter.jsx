import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";

function StatusFilter({ disabled = false, onDisabledClick }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const currentStatus = searchParams.get("status") || "all";

  const options = {
    all: "All Todos",
    active: "Active Todos",
    completed: "Completed Todos",
  };

  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);
    if (status === "all") {
      newParams.delete("status");
    } else {
      newParams.set("status", status);
    }
    setSearchParams(newParams);
    setOpen(false);
  };

  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => disabled && onDisabledClick?.()}
      className={`inline-block relative ${disabled ? "cursor-not-allowed" : ""}`}
      title={disabled ? "No todos available to filter" : ""}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-purple-400">Show:</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 text-purple-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
            disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
          }`}
        >
          <span>{options[currentStatus]}</span>
          <span className="text-xs text-purple-400">▾</span>
        </button>
      </div>

      {open && !disabled && (
        <div className="absolute left-12 mt-1 min-w-[140px] bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl z-50 overflow-hidden py-1">
          {Object.entries(options).map(([val, label]) => (
            <div
              key={val}
              onClick={() => handleStatusChange(val)}
              className={`px-3 py-1.5 text-sm transition cursor-pointer text-slate-200 hover:bg-purple-700 hover:text-white ${
                currentStatus === val ? "font-semibold text-purple-300" : ""
              }`}

            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusFilter;

