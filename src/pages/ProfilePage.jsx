import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { email, token, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const options = {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        };

        const response = await fetch("/api/tasks?limit=100", options);

        if (response.status === 401) {
          await logout();
          throw new Error("Unauthorized");
        }

        let todos = [];

        if (response.status === 404) {
          todos = [];
        } else if (response.ok) {
          const data = await response.json();
          todos = Array.isArray(data) ? data : data?.tasks || [];
        } else {
          throw new Error("Failed to fetch todos");
        }

        // Calculate statistics
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token, logout]);

  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-400 text-left mb-6">
        Profile
      </h1>

      <section className="mb-6 bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 sm:p-5 shadow-md">
        <h2 className="text-xl font-semibold italic text-purple-400 mb-3">
          User Information
        </h2>
        <ul className="list-none p-0 space-y-1.5 text-sm text-slate-200">
          <li>
            <strong className="text-purple-400">Email:</strong> {email}
          </li>
          <li>
            <strong className="text-purple-400">Status:</strong>{" "}
            <span className="text-emerald-400 font-medium">
              {token ? "Active" : "Inactive"}
            </span>
          </li>
        </ul>
      </section>

      <section className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 sm:p-5 shadow-md">
        <h2 className="text-xl font-semibold italic text-purple-400 mb-3">
          Todo Statistics
        </h2>
        {loading && (
          <p className="text-slate-400 text-sm">Loading statistics...</p>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-1.5 text-sm text-slate-200">
            <li>
              <span className="italic font-semibold text-purple-400">
                Total:
              </span>{" "}
              {stats.total}
            </li>
            <li>
              <span className="italic font-semibold text-purple-400">
                Completed:
              </span>{" "}
              {stats.completed}
            </li>
            <li>
              <span className="italic font-semibold text-purple-400">
                Active:
              </span>{" "}
              {stats.active}
            </li>
            <li>
              <span className="italic font-semibold text-purple-400">
                Completion:
              </span>{" "}
              <span className="text-purple-400 font-bold">
                {completionPercentage}%
              </span>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
