import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

function ProfilePage() {

  const { email, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async() => {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/tasks', {
        headers: {
          'X-CSRF-TOKEN': token
        },
        credentials: 'include'
      })

      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const todos = await response.json();
      setStats({
        total: todos.length,
        completed: todos.filter((todo) => todo.isCompleted).length,
        active: todos.filter((todo) => !todo.isCompleted).length
      })
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
        setLoading(false);
      } finally {
        setLoading(false);
      }
      
    //   const response = await fetch('/api/tasks', {
    //     headers: {
    //       'X-CSRF-TOKEN': token
    //     },
    //     credentials: 'include'
    //   })

      
    //   const todos = await response.json();
    //   setStats({
    //     total: todos.length,
    //     completed: todos.filter((todo) => todo.isCompleted).length,
    //     active: todos.filter((todo) => !todo.isCompleted).length
    //   })
    // } catch (err) {
      
    }
    fetchStats();
  }, [token])

  return (
    <div>
      <h1>Profile</h1>

      <section>
        <h2>User Information</h2>
        <p><strong>Email: {email}</strong></p>
      </section>

      <section>
        <h2>Todo Statistics</h2>
        <ul>
          <li>Total: {stats.total}</li>
          <li>Completed: {stats.completed}</li>
          <li>Active: {stats.active}</li>
        </ul>
      </section>
    </div>
  );
}

export default ProfilePage;