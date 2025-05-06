import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-accent-orange">404</h1>
      <p className="mt-4 text-lg font-semibold text-gray-700">Page Not Found</p>
      <p className="mt-2 text-sm text-gray-500">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white shadow-sm duration-200 hover:bg-accent-orange/90"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
