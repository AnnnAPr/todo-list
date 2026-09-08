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
      <button onClick={handleLogoff} disabled={isLoggingOff} className="px-3 py-1.5 bg-purple-900/40 hover:bg-red-900/60 border border-purple-700/50 hover:border-red-700/60 text-purple-200 hover:text-red-200 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:cursor-not-allowed">
        {isLoggingOff ? "Logging off..." : `Logout`}
      </button>
    </div>
  );
}

export default Logoff;
