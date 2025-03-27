import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoader from "./FullScreenLoader";

const authRoutes = ["/sign-in", "/sign-up"];
const completeProfileRoutes = ["/complete-registration"];

export default function AuthWrapper() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  const isProfileComplete = user?.nickname;

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
      return <Navigate to={"/complete-registration"} />;
    }
  } else {
    if (!isAuthRoute) {
      return <Navigate to={"/sign-in"} />;
    }
  }

  return <Outlet />;
}
