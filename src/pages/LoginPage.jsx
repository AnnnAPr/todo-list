import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const EMAIL_MAX_LENGTH = 254;
  const PASSWORD_MAX_LENGTH = 128;

  // Get intended destination from location state, default to /todos
  const from = location.state?.from?.pathname || "/todos";

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (value.length > EMAIL_MAX_LENGTH) return `Email must be ${EMAIL_MAX_LENGTH} characters or less`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
    return null;
  };

const validatePassword = (value) => {
  if (!value) return "Password is required";
  if (value.length > PASSWORD_MAX_LENGTH) return `Password must be ${PASSWORD_MAX_LENGTH} characters or less`;
  return null;
};

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
      {authError && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-200 text-sm">
          {authError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-sm text-purple-200">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
            setEmailError(validateEmail(value));
          }}
          required
          maxLength={EMAIL_MAX_LENGTH}
          className="bg-purple-950/60 border border-purple-700/60 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
        <label htmlFor="password" className="text-sm text-purple-200">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);
            setPasswordError(validatePassword(value));
          }}
          required
          maxLength={PASSWORD_MAX_LENGTH}
          className="bg-purple-950/60 border border-purple-700/60 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
        <button
          type="submit"
          disabled={isLoggingOn || emailError || passwordError}
          className="mt-3 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 text-white font-semibold rounded-lg shadow-md transition cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </>
  );
}

export default LoginPage;
