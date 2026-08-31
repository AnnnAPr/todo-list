import { createContext, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "csrfToken";
const EMAIL_KEY = "userEmail";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem(EMAIL_KEY) || "");
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (email) {
      localStorage.setItem(EMAIL_KEY, email);
    } else {
      localStorage.removeItem(EMAIL_KEY);
    }
  }, [email]);

  const login = async (userEmail, password) => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: "include",
      };

      const res = await fetch("/api/users/logon", options);
      const data = await res.json();

      if (res.status === 200 && data.email && data.csrfToken) {
        // Success: Update state
        setEmail(data.email);
        setToken(data.csrfToken);
        return { success: true };
      } else {
        // Failure: Return error
        return {
          success: false,
          error: `Authentication failed: ${data?.message}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error during login",
      };
    }
  };

  const logout = async () => {
    if (!token) {
      setEmail("");
      setToken("");
      return { success: true };
    }
    try {
      const res = await fetch("/api/users/logoff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

      if (res.ok) {
        setEmail("");
        setToken("");
        return { success: true };
      } else {
        const data = await res.json().catch(() => ({}));
        setEmail("");
        setToken("");
        return {
          success: false,
          error: data?.message || "Logout failed",
        };
      }
    } catch (error) {
      setEmail("");
      setToken("");
      return {
        success: false,
        error: "Network error during logout",
      };
    }
  };

  // Context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
