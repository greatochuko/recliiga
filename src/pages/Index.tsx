
import { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LeagueSetup from "@/components/LeagueSetup";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PlayerStats } from "@/components/dashboard/PlayerStats";
import { TeamRatings } from "@/components/dashboard/TeamRatings";
import { UpcomingEvents } from "@/components/dashboard/Events";
import { LeagueCard } from "@/components/dashboard/LeagueCard";
import { League, Event, PlayerStats as PlayerStatsType } from "@/types/dashboard";

const Index = () => {
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLeagueSetup, setShowLeagueSetup] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, nickname, date_of_birth, sports')
          .eq('id', user?.id)
          .single();

        if (profile) {
          setUserRole(profile.role);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, navigate]);

  // Fetch leagues where user is either a member or the owner
  const { data: userLeagues } = useQuery({
    queryKey: ['userLeagues', user?.id],
    queryFn: async () => {
      // First get leagues where user is a member
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

      // Then get leagues where user is the owner
      const { data: ownedLeagues, error: ownerError } = await supabase
        .from('leagues')
        .select('id, name, sport, city, description, logo_url')
        .eq('owner_id', user?.id);

      if (ownerError) throw ownerError;

      // Combine and deduplicate leagues
      const memberLeaguesData = memberLeagues.map(item => item.league);
      const allLeagues = [...memberLeaguesData, ...(ownedLeagues || [])];
      const uniqueLeagues = Array.from(new Map(allLeagues.map(item => [item.id, item])).values());

      return uniqueLeagues;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (userLeagues?.length && !selectedLeagueId) {
      setSelectedLeagueId(userLeagues[0].id);
    }
  }, [userLeagues]);

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

  if (!userRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const content = (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {userLeagues?.length ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Stats</h2>
                  <Select value={selectedLeagueId || ''} onValueChange={setSelectedLeagueId}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select League" />
                    </SelectTrigger>
                    <SelectContent>
                      {userLeagues.map(league => (
                        <SelectItem key={league.id} value={league.id}>
                          {league.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {playerStats && (
                  <PlayerStats 
                    stats={playerStats} 
                    userName={user?.email?.split('@')[0] || 'Player'} 
                  />
                )}
              </div>
              <TeamRatings />
            </div>
            {upcomingEvents && <UpcomingEvents events={upcomingEvents} />}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">You haven't joined any leagues yet.</p>
            {userRole === 'player' ? (
              <p className="text-gray-500 mt-2">Join a league to get started!</p>
            ) : (
              <Button 
                onClick={() => setShowLeagueSetup(true)} 
                className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white mt-4"
              >
                Create New League
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-100">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <SidebarTrigger />
            <Button onClick={handleLogout} variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          {showLeagueSetup ? (
            <LeagueSetup onCancel={() => setShowLeagueSetup(false)} />
          ) : (
            content
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
