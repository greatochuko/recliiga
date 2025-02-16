
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
          
          // If user is a player and hasn't completed their profile, redirect to registration
          if (profile.role === 'player' && (!profile.nickname || !profile.date_of_birth || !profile.sports)) {
            navigate('/complete-registration');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, navigate]);

  const { data: userLeagues } = useQuery({
    queryKey: ['userLeagues', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
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

      if (error) throw error;
      return data.map(item => item.league);
    },
    enabled: !!user && userRole === 'player',
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

      if (error) throw error;
      return data || { 
        wins: 0, 
        losses: 0, 
        ties: 0, 
        points: 0,
        league: { name: 'League' }
      };
    },
    enabled: !!selectedLeagueId && !!user,
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
    enabled: !!selectedLeagueId,
  });

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  const content = userRole === 'player' ? (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Stats</h2>
              {userLeagues && userLeagues.length > 0 && (
                <Select value={selectedLeagueId || ''} onValueChange={setSelectedLeagueId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select League" />
                  </SelectTrigger>
                  <SelectContent>
                    {userLeagues.map((league) => (
                      <SelectItem key={league.id} value={league.id}>
                        {league.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {playerStats && <PlayerStats stats={playerStats} userName={user?.email?.split('@')[0] || 'Player'} />}
          </div>

          <TeamRatings />
        </div>

        {upcomingEvents && <UpcomingEvents events={upcomingEvents} />}
      </div>
    </div>
  ) : (
    <div className="p-6">
      {showLeagueSetup ? (
        <LeagueSetup onCancel={() => setShowLeagueSetup(false)} />
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#FF7A00]">My Leagues</h1>
            <Button 
              onClick={() => setShowLeagueSetup(true)}
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
            >
              Create New League
            </Button>
          </div>
          
          {userLeagues?.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">You haven't created any leagues yet.</p>
              <p className="text-gray-500 mt-2">Click the button above to create your first league!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-100">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <SidebarTrigger />
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
          {content}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
