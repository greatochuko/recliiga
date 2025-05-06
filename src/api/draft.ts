import { supabase } from "@/integrations/supabase/client";
import { DraftSession, DraftPick } from "@/hooks/team-draft/types";

/**
 * Fetch or create draft session for an event
 */
export const getOrCreateDraftSession = async (
  eventId: string | number
): Promise<DraftSession | null> => {
  try {
    // First, check if a draft session already exists for this event
    const { data: existingSessions, error: fetchError } = await supabase
      .from("draft_sessions")
      .select("*")
      .eq("event_id", eventId.toString())
      .limit(1);

    if (fetchError) {
      console.error("Error fetching draft sessions:", fetchError);
      return null;
    }

    // If a session exists, return it
    if (existingSessions && existingSessions.length > 0) {
      return existingSessions[0] as DraftSession;
    }

    // If no session exists, create a new one
    const { data: newSession, error: createError } = await supabase
      .from("draft_sessions")
      .insert({
        event_id: eventId.toString(),
        status: "not_started",
        created_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating draft session:", createError);
      return null;
    }

    return newSession as DraftSession;
  } catch (error) {
    console.error("Error in getOrCreateDraftSession:", error);
    return null;
  }
};

/**
 * Update draft session status
 */
export const updateDraftSessionStatus = async (
  sessionId: string,
  status: "not_started" | "in_progress" | "completed"
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("draft_sessions")
      .update({ status })
      .eq("id", sessionId);

    if (error) {
      console.error("Error updating draft session:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateDraftSessionStatus:", error);
    return false;
  }
};

/**
 * Add a player to a team in the draft
 */
export const draftPlayer = async (
  draftSessionId: string,
  teamId: string, // 'team1' or 'team2'
  playerId: string,
  pickNumber: number
): Promise<DraftPick | null> => {
  try {
    const { data, error } = await supabase
      .from("draft_picks")
      .insert({
        draft_session_id: draftSessionId,
        team_id: teamId,
        player_id: playerId,
        pick_number: pickNumber,
      })
      .select()
      .single();

    if (error) {
      console.error("Error drafting player:", error);
      return null;
    }

    return data as DraftPick;
  } catch (error) {
    console.error("Error in draftPlayer:", error);
    return null;
  }
};

/**
 * Get all players drafted in a session
 */
export const getDraftPicks = async (
  draftSessionId: string
): Promise<DraftPick[]> => {
  try {
    const { data, error } = await supabase
      .from("draft_picks")
      .select(
        `
        *,
        profiles:player_id (
          id,
          full_name,
          avatar_url,
          positions
        )
      `
      )
      .eq("draft_session_id", draftSessionId)
      .order("pick_number");

    if (error) {
      console.error("Error fetching draft picks:", error);
      return [];
    }

    // Transform the data to match our Player interface
    return (data || []).map((pick) => {
      const profile = pick.profiles as any;
      return {
        ...pick,
        player: {
          id: profile.id,
          name: profile.full_name,
          avatar: profile.avatar_url || "/placeholder.svg?height=48&width=48",
          position:
            Array.isArray(profile.positions) && profile.positions.length > 0
              ? profile.positions[0]
              : "Player",
          rating: 3, // Default rating, you may want to get this from elsewhere
        },
      };
    });
  } catch (error) {
    console.error("Error in getDraftPicks:", error);
    return [];
  }
};

/**
 * Finalize a draft by adding all players to team rosters and updating the event status
 */
export const finalizeDraft = async (
  draftSessionId: string,
  eventId: string | number
): Promise<boolean> => {
  try {
    // Call a custom RPC function to handle the finalization transaction
    // Cast supabase.rpc to any to bypass type checking
    const { error } = await (supabase.rpc as any)("finalize_draft", {
      p_draft_session_id: draftSessionId,
      p_event_id: eventId.toString(),
    });

    if (error) {
      console.error("Error finalizing draft:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in finalizeDraft:", error);
    return false;
  }
};
