
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { League, Event, PlayerStats } from "@/types/dashboard";

export function useLeagueData(user: User | null, selectedLeagueId: string | null) {
  const { data: userLeagues } = useQuery({
    queryKey: ['userLeagues', user?.id],
    queryFn: async () => {
      const { data: memberLeagues, error: memberError } = await supabase
        .from('league_members')
        .select(`
          league:league_id (
            id,
            name,
            sport,
            city,
            description,
            logo_url
          )
        `)
        .eq('player_id', user?.id);

      if (memberError) throw memberError;

      const { data: ownedLeagues, error: ownerError } = await supabase
        .from('leagues')
        .select('id, name, sport, city, description, logo_url')
        .eq('owner_id', user?.id);

      if (ownerError) throw ownerError;

      const memberLeaguesData = memberLeagues.map(item => item.league);
      const allLeagues = [...memberLeaguesData, ...(ownedLeagues || [])];
      const uniqueLeagues = Array.from(new Map(allLeagues.map(item => [item.id, item])).values());

      return uniqueLeagues;
    },
    enabled: !!user
  });

  const { data: playerStats } = useQuery({
    queryKey: ['playerStats', selectedLeagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          wins,
          losses,
          ties,
          points,
          league:league_id (
            name
          )
        `)
        .eq('player_id', user?.id)
        .eq('league_id', selectedLeagueId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data || {
        wins: 0,
        losses: 0,
        ties: 0,
        points: 0,
        league: { name: 'League' }
      };
    },
    enabled: !!selectedLeagueId && !!user
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcomingEvents', selectedLeagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_dates (
            date,
            start_time,
            end_time
          ),
          event_rsvps (
            status
          )
        `)
        .eq('league_id', selectedLeagueId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(event => ({
        id: event.id,
        date: new Date(event.event_dates[0].date).toLocaleDateString(),
        time: event.event_dates[0].start_time,
        location: event.location,
        team1: {
          name: event.team1_name || 'Team 1',
          avatar: '/placeholder.svg',
          color: event.team1_color || '#272D31'
        },
        team2: {
          name: event.team2_name || 'Team 2',
          avatar: '/placeholder.svg',
          color: event.team2_color || '#FFC700'
        },
        rsvp_deadline: new Date(event.event_dates[0].date),
        status: event.event_rsvps[0]?.status || null,
        league: event.league_id,
        hasResults: false,
        spotsLeft: event.roster_spots
      }));
    },
    enabled: !!selectedLeagueId
  });

  return {
    userLeagues,
    playerStats,
    upcomingEvents
  };
}
