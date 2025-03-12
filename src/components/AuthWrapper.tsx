import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoader from "./FullScreenLoader";
import { useEffect, useState } from "react";
import { checkProfileCompletion } from "@/api/user";

const authRoutes = ["/sign-in", "/sign-up"];
const completeProfileRoutes = ["/complete-registration", "/create-league"];

export default function AuthWrapper() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );
  const [checkingProfile, setCheckingProfile] = useState(true);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isCompleteProfileRoute = completeProfileRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    (async () => {
      if (user) {
        const profileComplete = await checkProfileCompletion(user);
        setIsProfileComplete(profileComplete);
      }
      setCheckingProfile(false);
    })();
  }, [user]);

  if (loading || checkingProfile) {
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
            user.user_metadata?.role === "organizer"
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
