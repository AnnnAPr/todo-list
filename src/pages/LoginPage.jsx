import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Get intended destination from location state, default to /todos
  const from = location.state?.from?.pathname || "/todos";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError("");
    try {
      const result = await login(email, password);
      if (result?.success) {
        setAuthError("");
        setEmail("");
        setPassword("");
        navigate(from, { replace: true });
      } else if (result?.error) {
        setAuthError(result.error);
      }
    } catch (error) {
      setAuthError(`Error: ${error.name} | ${error.message}`);
    } finally {
      setIsLoggingOn(false);
    }
  };

  return (
    <>
      {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-sm text-purple-400">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-slate-900/80 border border-slate-700/70 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <label htmlFor="password" className="text-sm text-purple-400">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-slate-900/80 border border-slate-700/70 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          disabled={isLoggingOn}
          className="mt-3 py-2.5 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-800 text-white font-semibold rounded-lg shadow-md transition cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </>
  );
}

export default LoginPage;
