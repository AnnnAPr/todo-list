import { useAuth } from "../contexts/AuthContext";
import Logoff from "../features/Logoff";
import Navigation from "./Navigation";

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="flex flex-col items-center gap-3 w-full relative px-4 pt-2 sm:pt-4">
      {isAuthenticated && (
        <div className="absolute top-3 right-2 sm:top-5 sm:right-3 md:top-6 md:right-4">
          <Logoff />
        </div>
      )}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-[#e07cf3] text-center tracking-tight">
        Todo List
      </h1>
      <Navigation />
    </header>
  );
}

export default Header;
