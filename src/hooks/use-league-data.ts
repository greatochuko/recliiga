
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
        // First, get events data
        const { data: eventsData } = await supabase
          .from('events')
          .select(`
            *,
            event_dates(date, start_time, end_time)
          `)
          .eq('league_id', selectedLeagueId)
          .limit(5);

        if (eventsData) {
          // Transform the data to match the Event type
          const transformedEvents: Event[] = eventsData.map(event => {
            // Get the first event date (assuming it's the primary date)
            const eventDate = event.event_dates?.[0];
            
            return {
              id: event.id,
              date: eventDate?.date || '',
              time: eventDate?.start_time || '',
              location: event.location,
              team1: {
                name: event.team1_name || '',
                avatar: '', // Add default avatar if needed
                color: event.team1_color || '#000000'
              },
              team2: {
                name: event.team2_name || '',
                avatar: '', // Add default avatar if needed
                color: event.team2_color || '#000000'
              },
              rsvp_deadline: new Date(Date.now() + (event.rsvp_deadline_hours * 60 * 60 * 1000)),
              status: null,
              league: userLeagues?.find(league => league.id === event.league_id)?.name || '',
              hasResults: false, // Add logic for results if needed
              spotsLeft: event.roster_spots * event.num_teams // Calculate available spots
            };
          });

          setUpcomingEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    fetchUpcomingEvents();
  }, [selectedLeagueId, userLeagues]);

  return { userLeagues, playerStats, upcomingEvents };
}
