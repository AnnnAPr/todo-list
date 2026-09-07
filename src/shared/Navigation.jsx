import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const navLinkStyle = ({ isActive }) => ({
  fontWeight: isActive ? "bold" : "normal",
  textDecoration: isActive ? "underline" : "none",
});

function Navigation() {
  const { email, isAuthenticated } = useAuth();

  return (
    <nav>
      <ul
        style={{ display: "flex", listStyle: "none", gap: "1rem", padding: 0 }}
      >
        <li>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
        </li>
        {!isAuthenticated && (
          <li>
            <NavLink to="/login" style={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <NavLink to="/todos" style={navLinkStyle}>
              Todos
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <NavLink to="/profile" style={navLinkStyle}>
              Profile
            </NavLink>
          </li>
        )}
        {isAuthenticated && <li>email: {email}</li>}
      </ul>
    </nav>
  );
}

export default Navigation;
