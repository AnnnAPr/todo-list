import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
      <Link to="/todos">Todos</Link>
    </>
  );
}

export default NotFoundPage;
