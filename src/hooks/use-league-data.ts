import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { League, PlayerStats, Event } from '@/types/dashboard';

export function useLeagueData(user: User | null, selectedLeagueId: string | null) {
  const [userLeagues, setUserLeagues] = useState<League[] | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | undefined>();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[] | undefined>();

  useEffect(() => {
    const fetchUserLeagues = async () => {
      if (!user) return;

      try {
        const { data: leaguesData } = await supabase
          .from('leagues')
          .select('id, name, sport, city, description, logo_url, is_private, requires_approval, league_code');

        if (leaguesData) {
          setUserLeagues(leaguesData as League[]);
        }
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };

    fetchUserLeagues();
  }, [user]);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!user || !selectedLeagueId) return;

      try {
        const { data: stats } = await supabase
          .from('player_stats')
          .select('*')
          .eq('player_id', user.id)
          .eq('league_id', selectedLeagueId)
          .single();

        if (stats) {
          setPlayerStats(stats as PlayerStats);
        } else {
          // If no stats, initialize with default values
          setPlayerStats({
            wins: 0,
            losses: 0,
            ties: 0,
            points: 0,
            league: { name: userLeagues?.find(league => league.id === selectedLeagueId)?.name || '' }
          });
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    fetchPlayerStats();
  }, [user, selectedLeagueId, userLeagues]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!selectedLeagueId) return;

      try {
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('league_id', selectedLeagueId)
          .limit(5);

        if (events) {
          setUpcomingEvents(events as Event[]);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    fetchUpcomingEvents();
  }, [selectedLeagueId]);

  return { userLeagues, playerStats, upcomingEvents };
}
