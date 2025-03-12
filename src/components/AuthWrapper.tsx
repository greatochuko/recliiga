import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoader from "./FullScreenLoader";

const authRoutes = ["/sign-in", "/sign-up"];
const completeProfileRoutes = ["/complete-registration", "/create-league"];

export default function AuthWrapper() {
  const { user, loading, isProfileComplete } = useAuth();
  const { pathname } = useLocation();

  console.log({ isProfileComplete });

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isCompleteProfileRoute = completeProfileRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (loading) {
    return <FullScreenLoader />;
  }

  if (user) {
    if (isAuthRoute && isProfileComplete) {
      return <Navigate to="/" />;
    }

    if (isCompleteProfileRoute && isProfileComplete) {
      return <Navigate to="/" />;
    }

    if (!isCompleteProfileRoute && !isProfileComplete) {
      return (
        <Navigate
          to={
            user?.role === "organizer"
              ? "/create-league"
              : "/complete-registration"
          }
        />
      );
    }
  } else {
    if (!isAuthRoute) {
      return <Navigate to={"/sign-in"} />;
    }
  }

  return <Outlet />;
}
