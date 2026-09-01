import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { email, token } = useAuth();
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

        const response = await fetch("/api/tasks", options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        const todos = Array.isArray(data) ? data : data.tasks || [];
        setStats({
          total: todos.length,
          completed: todos.filter((todo) => todo.isCompleted).length,
          active: todos.filter((todo) => !todo.isCompleted).length,
        });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
        setLoading(false);
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
      <h1>Profile</h1>

      <section>
        <h2>User Information</h2>
        <p>
          <strong>Email: {email}</strong>
        </p>
      </section>

      <section>
        <h2>Todo Statistics</h2>
        {loading && <p>Loading statistics...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <ul>
            <li>Total: {stats.total}</li>
            <li>Completed: {stats.completed}</li>
            <li>Active: {stats.active}</li>
            <li>Completion: {completionPercentage}%</li>
          </ul>
        )}
        {/* <ul>
          <li>Total: {stats.total}</li>
          <li>Completed: {stats.completed}</li>
          <li>Active: {stats.active}</li>
        </ul> */}
      </section>
    </div>
  );
}

export default ProfilePage;
