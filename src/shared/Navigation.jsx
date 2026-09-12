import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "font-bold text-purple-400 border-b-2 border-purple-400 pb-0.5 transition"
    : "font-normal text-slate-300 hover:text-purple-400 no-underline transition";

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul className="flex list-none gap-4 p-0 m-0">
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
