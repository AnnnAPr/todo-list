import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "font-bold underline"
    : "font-normal no-underline";

   
function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul
        style={{ display: "flex", listStyle: "none", gap: "1rem", padding: 0 }}
      >
        <li>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </li>
        {!isAuthenticated && (
          <li>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <NavLink to="/todos" className={navLinkClass}>
              Todos
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
