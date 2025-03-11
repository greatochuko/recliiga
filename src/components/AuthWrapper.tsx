import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoader from "./FullScreenLoader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const authRoutes = ["/sign-in", "/sign-up"];
const completeProfileRoutes = ["/complete-registration", "/create-league"];

export default function AuthWrapper() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    async function checkProfileCompletion() {
      if (!user) return;

      try {
        // Check if the user has completed registration based on their role
        if (user.user_metadata?.role === "organizer") {
          // Check if league organizer has created a league
          const { data: leagues } = await supabase
            .from("leagues")
            .select("id")
            .eq("owner_id", user.id)
            .limit(1);

          setIsProfileComplete(leagues && leagues.length > 0);
        } else {
          // Check if player has completed profile setup
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, nickname")
            .eq("id", user.id)
            .limit(1);

          setIsProfileComplete(
            profile && profile.length > 0 && profile[0].nickname !== null
          );
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
        // Default to false if there's an error
        setIsProfileComplete(false);
      } finally {
        setCheckingProfile(false);
      }
    }

    if (user) {
      checkProfileCompletion();
    } else {
      setCheckingProfile(false);
    }
  }, [user]);

  if (loading || checkingProfile) {
    return <FullScreenLoader />;
  }

  if (user) {
    if (authRoutes.includes(pathname)) {
      return <Navigate to={"/"} />;
    }

    if (completeProfileRoutes.includes(pathname)) {
      if (isProfileComplete === true) {
        return <Navigate to={"/"} />;
      }
    } else if (isProfileComplete === false) {
      if (user.user_metadata?.role === "organizer") {
        return <Navigate to="/create-league" />;
      } else {
        return <Navigate to="/complete-registration" />;
      }
    }
  } else {
    if (!authRoutes.includes(pathname)) {
      return <Navigate to={"/sign-in"} />;
    }
  }

  return <Outlet />;
}
