import { useSearchParams } from "react-router";

function StatusFilter({ disabled = false, onDisabledClick }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);
    if (status === "all") {
      newParams.delete("status");
    } else {
      newParams.set("status", status);
    }
    setSearchParams(newParams);
  };

  return (
    <div
      onClick={() => disabled && onDisabledClick?.()}
      className={`inline-block ${disabled ? "cursor-not-allowed" : ""}`}
      title={disabled ? "No todos available to filter" : ""}
    >
      <div className="flex items-center gap-2">
        <label
          htmlFor="statusFilter"
          className="text-sm font-medium text-purple-200"
        >
          Show:
        </label>
        <select
          id="statusFilter"
          value={currentStatus}
          disabled={disabled}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`bg-purple-950/70 border border-purple-700/60 text-purple-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
          }`}
        >
          <option value="all">All Todos</option>
          <option value="active">Active Todos</option>
          <option value="completed">Completed Todos</option>
        </select>
      </div>
    </div>
  );
}

export default StatusFilter;
