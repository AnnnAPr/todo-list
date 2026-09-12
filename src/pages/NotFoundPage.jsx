import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-slate-300 mb-4">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="text-purple-400 underline hover:text-purple-100 text-sm font-medium transition"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
