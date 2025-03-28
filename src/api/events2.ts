import { supabase } from "@/integrations/supabase/client";
import { EventType, League } from "@/types/events";

// Fetch all events from the database

export const fetchEvents = async (): Promise<EventType[]> => {
  try {
    const { data: events, error } = await supabase
      .from("events")
      .select(
        `
        id,
        title,
        location,
        league_id,
        team1_name,
        team1_color,
        team2_name,
        team2_color,
        draft_status,
        event_dates(date, start_time),
        leagues:league_id(name),
        event_rsvps(status, player_id)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }

    // Get the current user's ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // Transform data to match our Event interface
    return events.map((event) => {
      const eventDate = event.event_dates?.[0]?.date || "";
      const eventTime = event.event_dates?.[0]?.start_time || "";

      // Calculate RSVP deadline (24 hours before event)
      const dateObj = new Date(`${eventDate}T${eventTime}`);
      // Subtract hours based on rsvp_deadline_hours field, default to 24
      dateObj.setHours(dateObj.getHours() - 24);

      // Check if user is attending
      let status: EventType["status"] = "upcoming";

      if (userId) {
        const userRsvp = event.event_rsvps?.find(
          (rsvp) => rsvp.player_id === userId
        );
        if (userRsvp) {
          status = userRsvp.status as "attending" | "declined";
        }
      }

      // Calculate spots left (dummy logic - replace with real logic)
      const spotsLeft =
        10 -
        (event.event_rsvps?.filter((rsvp) => rsvp.status === "attending")
          ?.length || 0);

      return {
        id: Number(event.id), // Convert string to number
        leagueId: Number(event.league_id), // Convert string to number
        date: eventDate,
        time: eventTime,
        location: event.location,
        league: event.leagues?.name,
        team1: {
          name: event.team1_name || "Team 1",
          avatar: "/placeholder.svg?height=64&width=64",
          color: event.team1_color || "#272D31",
        },
        team2: {
          name: event.team2_name || "Team 2",
          avatar: "/placeholder.svg?height=64&width=64",
          color: event.team2_color || "#FFC700",
        },
        rsvpDeadline: dateObj,
        status,
        spotsLeft,
        draftStatus: event.draft_status as
          | "not_started"
          | "in_progress"
          | "completed",
      };
    });
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    return [];
  }
};

/**
 * Fetch a single event by ID
 */
export const fetchEventById = async (
  eventId: string | number
): Promise<EventType | null> => {
  try {
    const { data: event, error } = await supabase
      .from("events")
      .select(
        `
        id,
        title,
        location,
        league_id,
        team1_name,
        team1_color,
        team2_name,
        team2_color,
        draft_status,
        event_dates(date, start_time),
        leagues:league_id(name),
        event_rsvps(status, player_id)
      `
      )
      .eq("id", eventId.toString())
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return null;
    }

    // Get the current user's ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // Transform data to match our Event interface
    const eventDate = event.event_dates?.[0]?.date || "";
    const eventTime = event.event_dates?.[0]?.start_time || "";

    // Calculate RSVP deadline (24 hours before event)
    const dateObj = new Date(`${eventDate}T${eventTime}`);
    // Subtract hours based on rsvp_deadline_hours field, default to 24
    dateObj.setHours(dateObj.getHours() - 24);

    // Check if user is attending
    let status: EventType["status"] = "upcoming";

    if (userId) {
      const userRsvp = event.event_rsvps?.find(
        (rsvp) => rsvp.player_id === userId
      );
      if (userRsvp) {
        status = userRsvp.status as "attending" | "declined";
      }
    }

    // Calculate spots left (dummy logic - replace with real logic)
    const spotsLeft =
      10 -
      (event.event_rsvps?.filter((rsvp) => rsvp.status === "attending")
        ?.length || 0);

    // Fetch team captains
    const { data: teamCaptains, error: captainsError } = await supabase
      .from("team_captains")
      .select(
        `
        team_id,
        profiles:captain_id (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq("event_id", eventId.toString());

    if (captainsError) {
      console.error("Error fetching team captains:", captainsError);
    }

    // Transform captains data
    const captains: { [key: string]: any } = {};
    if (teamCaptains) {
      teamCaptains.forEach((tc) => {
        const profile = tc.profiles as any;
        captains[tc.team_id] = {
          id: profile.id,
          name: profile.full_name,
          avatar: profile.avatar_url || "/placeholder.svg?height=48&width=48",
        };
      });
    }

    return {
      id: Number(event.id), // Convert string to number
      leagueId: Number(event.league_id), // Convert string to number
      date: eventDate,
      time: eventTime,
      location: event.location,
      league: event.leagues?.name,
      team1: {
        name: event.team1_name || "Team 1",
        logo: "/placeholder.svg?height=64&width=64",
        color: event.team1_color || "#272D31",
      },
      team2: {
        name: event.team2_name || "Team 2",
        logo: "/placeholder.svg?height=64&width=64",
        color: event.team2_color || "#FFC700",
      },
      rsvpDeadline: dateObj,
      status,
      spotsLeft,
      draftStatus: event.draft_status as
        | "not_started"
        | "in_progress"
        | "completed",
      captains,
    };
  } catch (error) {
    console.error("Error in fetchEventById:", error);
    return null;
  }
};

/**
 * Fetch all leagues from the database
 */
export const fetchLeagues = async (): Promise<League[]> => {
  try {
    const { data: leagues, error } = await supabase
      .from("leagues")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error fetching leagues:", error);
      return [];
    }

    return leagues.map((league) => ({
      id: Number(league.id),
      name: league.name,
    }));
  } catch (error) {
    console.error("Error in fetchLeagues:", error);
    return [];
  }
};

/**
 * RSVP to an event
 */
export const rsvpToEvent = async (
  eventId: string | number,
  status: "attending" | "declined"
): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found");
      return false;
    }

    // Check if user has already RSVPed
    const { data: existingRsvp, error: checkError } = await supabase
      .from("event_rsvps")
      .select("id")
      .eq("event_id", eventId.toString())
      .eq("player_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing RSVP:", checkError);
      return false;
    }

    if (existingRsvp) {
      // Update existing RSVP
      const { error: updateError } = await supabase
        .from("event_rsvps")
        .update({ status })
        .eq("id", existingRsvp.id);

      if (updateError) {
        console.error("Error updating RSVP:", updateError);
        return false;
      }
    } else {
      // Create new RSVP
      const { error: insertError } = await supabase.from("event_rsvps").insert({
        event_id: eventId.toString(),
        player_id: user.id,
        status,
      });

      if (insertError) {
        console.error("Error creating RSVP:", insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in rsvpToEvent:", error);
    return false;
  }
};

/**
 * Get attending players for an event
 */
export const getAttendingPlayers = async (eventId: string | number) => {
  try {
    const { data, error } = await supabase
      .from("event_rsvps")
      .select(
        `
        player_id,
        profiles:player_id(
          id,
          full_name,
          avatar_url,
          positions
        ),
        team_captains!inner(team_id)
      `
      )
      .eq("event_id", eventId.toString())
      .eq("status", "attending");

    if (error) {
      console.error("Error fetching attending players:", error);
      return [];
    }

    return data.map((item) => {
      const profile = item.profiles as any;
      return {
        id: profile.id,
        name: profile.full_name,
        avatar: profile.avatar_url || "/placeholder.svg?height=48&width=48",
        position:
          Array.isArray(profile.positions) && profile.positions.length > 0
            ? profile.positions[0]
            : "Player",
        rating: 3, // Default rating, you may want to get this from elsewhere
        isCaptain: !!item.team_captains,
      };
    });
  } catch (error) {
    console.error("Error in getAttendingPlayers:", error);
    return [];
  }
};
