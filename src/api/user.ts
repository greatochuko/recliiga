import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export async function checkProfileCompletion(user: User) {
  if (!user) return false;

  try {
    // Check if the user has completed registration based on their role
    if (user.user_metadata?.role === "organizer") {
      // Check if league organizer has created a league
      const { data: leagues } = await supabase
        .from("leagues")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1);

      return leagues && leagues.length > 0;
    } else {
      // Check if player has completed profile setup
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, nickname")
        .eq("id", user.id)
        .limit(1);

      return profile && profile.length > 0 && profile[0].nickname !== null;
    }
  } catch (error) {
    console.error("Error checking profile completion:", error);
    // Default to false if there's an error
    return false;
  }
}
