import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error("Routing error:", error);

  return (
    <div className="flex h-dvh flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="text-6xl font-bold text-accent-orange">Oops!</h1>
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Something went wrong
      </p>
      <p className="mt-2 text-sm text-gray-500">
        An unexpected error occurred.
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

export default ErrorPage;
