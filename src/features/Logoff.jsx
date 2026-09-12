import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [isLoggingOff, setIsLoggingOff] = useState(false);

  const handleLogoff = async () => {
    setIsLoggingOff(true);
    setAuthError("");
    try {
      const result = await logout();
      if (result?.success) {
        setAuthError("");
        navigate("/login");
      } else {
        setAuthError(result.error);
      }
    } catch {
      setAuthError("An unexpected error occurred during logout");
    } finally {
      setIsLoggingOff(false);
    }
  };

  return (
    <div className="flex items-center">
      {authError && <p className="text-red-400 text-xs mr-2">{authError}</p>}
      <button
        onClick={handleLogoff}
        disabled={isLoggingOff}
        className="px-3 py-1.5 bg-slate-900/80 hover:bg-rose-950/70 border border-slate-700/60 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoggingOff ? "Logging off..." : `Logout`}
      </button>
    </div>
  );
}

export default Logoff;
