import { useAuth } from "@/contexts/AuthContext";
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const authRoutes = ["/sign-in", "/sign-up"];
const completeProfileRoutes = ["/complete-registration"];

export default function AuthWrapper() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const isInvitePage = pathname.startsWith("/invite");
  const leagueCode = isInvitePage ? pathname.split("/").at(-1) : "";
  const inviteCode = searchParams.get("code");

  const isProfileComplete = user?.nickname;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isCompleteProfileRoute = completeProfileRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (user) {
    if (
      (isAuthRoute && isProfileComplete) ||
      (isCompleteProfileRoute && isProfileComplete)
    ) {
      return (
        <Navigate
          to={inviteCode ? `/dashboard/invite/${inviteCode}` : "/dashboard"}
        />
      );
    }

    if (!isCompleteProfileRoute && !isProfileComplete) {
      return (
        <Navigate
          to={
            inviteCode
              ? `/complete-registration?code=${inviteCode}`
              : "/complete-registration"
          }
        />
      );
    }
  } else {
    if (!isAuthRoute) {
      return (
        <Navigate
          to={isInvitePage ? `/sign-in?code=${leagueCode}` : "/sign-in"}
        />
      );
    }
  }

  return <Outlet />;
}
