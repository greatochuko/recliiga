import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Delete all related data in the correct order to handle foreign key constraints
    // 1. Delete event_rsvps where player_id matches
    const { error: rsvpsError } = await supabaseAdmin
      .from("event_rsvps")
      .delete()
      .eq("player_id", user_id);

    if (rsvpsError) {
      console.error("Error deleting event RSVPs:", rsvpsError);
    }

    // 2. Delete teammate_ratings where rater_id or rated_id matches
    const { error: ratingsError } = await supabaseAdmin
      .from("teammate_ratings")
      .delete()
      .or(`rater_id.eq.${user_id},rated_id.eq.${user_id}`);

    if (ratingsError) {
      console.error("Error deleting teammate ratings:", ratingsError);
    }

    // 3. Delete player_stats where player_id matches
    const { error: statsError } = await supabaseAdmin
      .from("player_stats")
      .delete()
      .eq("player_id", user_id);

    if (statsError) {
      console.error("Error deleting player stats:", statsError);
    }

    // 4. Delete league_members where player_id matches
    const { error: membersError } = await supabaseAdmin
      .from("league_members")
      .delete()
      .eq("player_id", user_id);

    if (membersError) {
      console.error("Error deleting league members:", membersError);
    }

    // 5. Get all leagues owned by the user
    const { data: userLeagues } = await supabaseAdmin
      .from("leagues")
      .select("id")
      .eq("owner_id", user_id);

    if (userLeagues && userLeagues.length > 0) {
      const leagueIds = userLeagues.map((league) => league.id);

      // Delete all event_dates for events in user's leagues
      const { error: eventDatesError } = await supabaseAdmin
        .from("event_dates")
        .delete()
        .in(
          "event_id",
          supabaseAdmin.from("events").select("id").in("league_id", leagueIds)
        );

      if (eventDatesError) {
        console.error("Error deleting event dates:", eventDatesError);
      }

      // Delete all events in user's leagues
      const { error: eventsError } = await supabaseAdmin
        .from("events")
        .delete()
        .in("league_id", leagueIds);

      if (eventsError) {
        console.error("Error deleting events:", eventsError);
      }

      // Delete the leagues
      const { error: leaguesError } = await supabaseAdmin
        .from("leagues")
        .delete()
        .eq("owner_id", user_id);

      if (leaguesError) {
        console.error("Error deleting leagues:", leaguesError);
      }
    }

    // 6. Finally delete the user's profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", user_id);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to delete user profile" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // 7. Delete the user from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user_id
    );

    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete user from authentication" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in delete-user function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
