import { useAuth } from "@/contexts/AuthContext";
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const authRoutes = ["/sign-in", "/sign-up"];
const completeProfileRoute = "/complete-registration";

export default function AuthWrapper() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const isInvitePage = pathname.startsWith("/dashboard/invite");
  const leagueCode = isInvitePage
    ? pathname.replace("/dashboard/invite/", "")
    : "";
  const inviteCode = searchParams.get("code");

  const isProfileComplete = Boolean(user?.nickname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isCompleteProfile = pathname === completeProfileRoute;

  if (user) {
    // Authenticated users with complete profile shouldn't access auth routes
    if (isProfileComplete && (isAuthRoute || isCompleteProfile)) {
      return (
        <Navigate
          to={inviteCode ? `/dashboard/invite/${inviteCode}` : "/dashboard"}
          replace
        />
      );
    }

    // Authenticated users with incomplete profile must complete profile
    if (!isProfileComplete && !isCompleteProfile) {
      return (
        <Navigate
          to={
            inviteCode
              ? `/complete-registration?code=${inviteCode}`
              : "/complete-registration"
          }
          replace
        />
      );
    }
  } else {
    // Unauthenticated users trying to access protected routes
    if (!isAuthRoute) {
      return (
        <Navigate
          to={isInvitePage ? `/sign-in?code=${leagueCode}` : "/sign-in"}
          replace
        />
      );
    }
  }

  return <Outlet />;
}
