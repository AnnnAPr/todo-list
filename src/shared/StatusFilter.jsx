import { useSearchParams } from "react-router";

function StatusFilter() {
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
        onChange={(e) => handleStatusChange(e.target.value)}
        className="bg-purple-950/70 border border-purple-700/60 text-purple-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
      >
        <option value="all" className="bg-purple-950 text-slate-100">
          All Todos
        </option>
        <option value="active" className="bg-purple-950 text-slate-100">
          Active Todos
        </option>
        <option value="completed" className="bg-purple-950 text-slate-100">
          Completed Todos
        </option>
      </select>
    </div>
  );
}

export default StatusFilter;
