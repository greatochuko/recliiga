
import { supabase } from '@/integrations/supabase/client';
import { Captain } from '@/types/events';

export interface TeamCaptain {
  id: string;
  event_id: string;
  team_id: string;
  captain_id: string;
  created_at: string;
}

/**
 * Fetch captains for a specific event
 */
export const fetchEventCaptains = async (eventId: string | number): Promise<{[key: string]: Captain | undefined}> => {
  try {
    // Get team captains from database
    const { data: teamCaptains, error: captainsError } = await supabase
      .from('team_captains')
      .select(`
        id,
        team_id,
        captain_id,
        profiles:captain_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('event_id', eventId.toString());

    if (captainsError) {
      console.error('Error fetching team captains:', captainsError);
      return {};
    }

    // Transform data into the expected format
    const captains: {[key: string]: Captain | undefined} = {};
    
    teamCaptains.forEach((tc) => {
      const profile = tc.profiles as any;
      captains[tc.team_id] = {
        id: profile.id,
        name: profile.full_name,
        avatar: profile.avatar_url || '/placeholder.svg?height=48&width=48'
      };
    });

    return captains;
  } catch (error) {
    console.error('Error in fetchEventCaptains:', error);
    return {};
  }
};

/**
 * Select captains for an event
 */
export const selectEventCaptains = async (
  eventId: string | number, 
  team1CaptainId: string, 
  team2CaptainId: string
): Promise<boolean> => {
  try {
    // Use a workaround to call the RPC function without TypeScript errors
    // Cast the supabase.rpc to any to bypass type checking
    const { error } = await (supabase.rpc as any)('select_event_captains', {
      p_event_id: eventId.toString(),
      p_team1_captain_id: team1CaptainId,
      p_team2_captain_id: team2CaptainId
    });

    if (error) {
      console.error('Error selecting captains:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in selectEventCaptains:', error);
    return false;
  }
};
