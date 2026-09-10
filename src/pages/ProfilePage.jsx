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
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch("/api/tasks?limit=100", options);

        if (response.status === 401) {
          await logout();
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        const todos = Array.isArray(data) ? data : data.tasks || [];

        // Calculate statistics
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setStats({ total, completed, active });
      } catch (err) {
        await logout();
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-400 text-left mb-4">Profile</h1>

      <section className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold italic text-purple-300 mb-3">User Information</h2>
        <ul className="list-none p-0 space-y-1 text-sm text-purple-100">
          <li><strong className="text-purple-300">Email:</strong> {email}</li>
          <li><strong className="text-purple-300">Status:</strong> {token ? "Active" : "Inactive"}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold italic text-purple-300 mb-3">Todo Statistics</h2>
        {loading && <p>Loading statistics...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && (
          <ul>
            <li><span className="italic font-semibold">Total:</span> {stats.total}</li>
            <li><span className="italic font-semibold">Completed:</span> {stats.completed}</li>
            <li><span className="italic font-semibold">Active:</span> {stats.active}</li>
            <li><span className="italic font-semibold">Completion:</span> {completionPercentage}%</li>
          </ul>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
