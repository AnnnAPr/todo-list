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
        navigate('/login');
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
    <div>
      {authError && <p>{authError}</p>}
      <button onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? "Logging off..." : `Logout`}
      </button>
    </div>
  );
}

export default Logoff;
