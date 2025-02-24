
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { League, PlayerStats, Event } from '@/types/dashboard';

export function useLeagueData(user: User | null, selectedLeagueId: string | null) {
  const [userLeagues, setUserLeagues] = useState<League[] | null>(null);
  const [allPublicLeagues, setAllPublicLeagues] = useState<League[] | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | undefined>();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[] | undefined>();
  const [membershipStatus, setMembershipStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        console.log('Fetching leagues...');
        
        // Fetch all public leagues
        const { data: publicLeagues, error: publicError } = await supabase
          .from('leagues')
          .select(`
            *,
            league_members!left(player_id)
          `)
          .eq('is_private', false);

        if (publicError) {
          console.error('Error fetching public leagues:', publicError);
          return;
        }

        console.log('Public leagues fetched:', publicLeagues);

        if (publicLeagues) {
          const leaguesWithCounts = publicLeagues.map(league => ({
            ...league,
            member_count: league.league_members?.length || 0
          }));
          setAllPublicLeagues(leaguesWithCounts);
        }

        if (user) {
          // Fetch user's leagues
          const { data: userLeaguesData, error: userError } = await supabase
            .from('leagues')
            .select(`
              *,
              league_members!inner(player_id)
            `)
            .eq('league_members.player_id', user.id);

          if (userError) {
            console.error('Error fetching user leagues:', userError);
            return;
          }

          console.log('User leagues fetched:', userLeaguesData);

          if (userLeaguesData) {
            setUserLeagues(userLeaguesData);
            
            const status: Record<string, string> = {};
            userLeaguesData.forEach(league => {
              status[league.id] = 'member';
            });
            setMembershipStatus(status);
          }
        }
      } catch (error) {
        console.error('Error in fetchLeagues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, [user]);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!user || !selectedLeagueId) return;

      try {
        const { data: stats } = await supabase
          .from('player_stats')
          .select('*, leagues(name)')
          .eq('player_id', user.id)
          .eq('league_id', selectedLeagueId)
          .single();

        if (stats) {
          setPlayerStats({
            wins: stats.wins || 0,
            losses: stats.losses || 0,
            ties: stats.ties || 0,
            points: stats.points || 0,
            league: { name: stats.leagues?.name || '' }
          });
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    fetchPlayerStats();
  }, [user, selectedLeagueId]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!selectedLeagueId) return;

      try {
        const { data: eventsData } = await supabase
          .from('events')
          .select(`
            *,
            event_dates(date, start_time, end_time)
          `)
          .eq('league_id', selectedLeagueId)
          .limit(5);

        if (eventsData) {
          const transformedEvents: Event[] = eventsData.map(event => ({
            id: event.id,
            date: event.event_dates?.[0]?.date || '',
            time: event.event_dates?.[0]?.start_time || '',
            location: event.location,
            team1: {
              name: event.team1_name || '',
              avatar: '',
              color: event.team1_color || '#000000'
            },
            team2: {
              name: event.team2_name || '',
              avatar: '',
              color: event.team2_color || '#000000'
            },
            rsvp_deadline: new Date(Date.now() + (event.rsvp_deadline_hours * 60 * 60 * 1000)),
            status: null,
            league: userLeagues?.find(league => league.id === event.league_id)?.name || '',
            hasResults: false,
            spotsLeft: event.roster_spots * event.num_teams
          }));

          setUpcomingEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    fetchUpcomingEvents();
  }, [selectedLeagueId, userLeagues]);

  const joinLeague = async (leagueId: string) => {
    if (!user) {
      toast.error('You must be logged in to join a league');
      return;
    }

    try {
      console.log('Joining league:', leagueId);
      
      const { data: league } = await supabase
        .from('leagues')
        .select('requires_approval')
        .eq('id', leagueId)
        .single();

      await supabase
        .from('league_members')
        .insert({
          league_id: leagueId,
          player_id: user.id,
          status: league?.requires_approval ? 'pending' : 'active'
        });

      setMembershipStatus(prev => ({
        ...prev,
        [leagueId]: league?.requires_approval ? 'pending' : 'member'
      }));

      const { data: newLeague } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single();

      if (newLeague) {
        setUserLeagues(prev => prev ? [...prev, newLeague] : [newLeague]);
      }

      console.log('Successfully joined league');
    } catch (error) {
      console.error('Error joining league:', error);
      throw error;
    }
  };

  return { 
    userLeagues,
    allPublicLeagues,
    playerStats,
    upcomingEvents,
    membershipStatus,
    joinLeague,
    loading
  };
}
