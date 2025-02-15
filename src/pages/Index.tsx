import { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LeagueSetup from "@/components/LeagueSetup";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface League {
  id: string;
  name: string;
  sport: string;
  city: string;
  description: string | null;
  logo_url: string | null;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 ${star <= rating ? "text-[#FF7A00] fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

function PlayerRankCard({ league }: { league: { name: string, playerName: string, rank: number, totalPlayers: number, rating: number } }) {
  return (
    <Card className="bg-[#FF7A00] text-white w-full h-full flex flex-col justify-between">
      <CardContent className="p-4 flex flex-col items-center h-full justify-between">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-base font-bold mb-2">{league.name}</h2>
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src="/placeholder.svg" alt="Player avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-semibold mb-1">{league.playerName}</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-start">
            <div className="flex items-start">
              <span className="text-lg font-bold">{league.rank}</span>
              <span className="text-xs font-bold mt-0.5">th</span>
            </div>
            <span className="text-lg font-bold ml-0.5">/{league.totalPlayers}</span>
          </div>
          <span className="text-xs mt-1">{league.name}</span>
          <div className="flex items-center mt-2">
            <span className="text-base font-bold">{Math.max(0.50, Math.min(3.00, league.rating)).toFixed(2)}</span>
            <Star className="w-4 h-4 ml-1 fill-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const LeagueCard = ({ league }: { league: League }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-center gap-4">
        {league.logo_url && (
          <img src={league.logo_url} alt={league.name} className="w-12 h-12 rounded-full object-cover" />
        )}
        <div>
          <h3 className="text-xl font-bold">{league.name}</h3>
          <p className="text-sm text-gray-500">{league.sport} • {league.city}</p>
        </div>
      </CardTitle>
    </CardHeader>
    {league.description && (
      <CardContent>
        <p className="text-gray-600">{league.description}</p>
      </CardContent>
    )}
  </Card>
);

const Index = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLeagueSetup, setShowLeagueSetup] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile
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

  // Fetch leagues based on user role
  const { data: leagues, isLoading } = useQuery({
    queryKey: ['leagues', userRole, user?.id],
    queryFn: async () => {
      if (!user || !userRole) return [];

      if (userRole === 'organizer') {
        // Fetch leagues owned by the organizer
        const { data, error } = await supabase
          .from('leagues')
          .select('*')
          .eq('owner_id', user.id);

        if (error) throw error;
        return data;
      } else {
        // Fetch leagues the player is a member of
        const { data, error } = await supabase
          .from('league_members')
          .select(`
            league_id,
            leagues:league_id (*)
          `)
          .eq('player_id', user.id);

        if (error) throw error;
        return data.map(item => item.leagues);
      }
    },
    enabled: !!user && !!userRole,
  });

  // Fetch player stats
  const { data: playerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['playerStats', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          wins,
          losses,
          ties,
          points,
          leagues:league_id (
            name,
            id
          )
        `)
        .eq('player_id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user && userRole === 'player',
  });

  if (!userRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (userRole === 'player') {
    if (statsLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF7A00]" />
        </div>
      );
    }

    const totalGames = (playerStats?.wins || 0) + (playerStats?.losses || 0) + (playerStats?.ties || 0);
    const rating = 2.5; // This would normally come from the database

    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Stats</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlayerRankCard 
                  league={{
                    name: playerStats?.leagues?.name || 'Premier League',
                    playerName: user?.email?.split('@')[0] || 'Player',
                    rank: 8,
                    totalPlayers: 15,
                    rating: rating
                  }} 
                />
                
                {/* Record Card */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4">Record</h3>
                  <div className="space-y-4">
                    {/* Points Display */}
                    <div className="flex justify-center mb-4">
                      <div className="text-center">
                        <span className="text-3xl font-bold">{playerStats?.points || 0}</span>
                        <span className="text-gray-500 block">PTS</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-emerald-100 rounded p-2">
                        <div className="text-emerald-700 font-bold text-lg">{playerStats?.wins || 0}</div>
                        <div className="text-emerald-600 text-xs">Won</div>
                      </div>
                      <div className="bg-red-100 rounded p-2">
                        <div className="text-red-700 font-bold text-lg">{playerStats?.losses || 0}</div>
                        <div className="text-red-600 text-xs">Loss</div>
                      </div>
                      <div className="bg-orange-100 rounded p-2">
                        <div className="text-orange-700 font-bold text-lg">{playerStats?.ties || 0}</div>
                        <div className="text-orange-600 text-xs">Tied</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teammates Section */}
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Rate Your Teammates</h2>
                <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-grow">
                {[1, 2, 3, 4].map((teammate) => (
                  <div
                    key={teammate}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Player {teammate}</h3>
                        <p className="text-gray-500 text-xs">Midfielder</p>
                      </div>
                    </div>
                    <StarRating rating={3} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!showLeagueSetup ? (
        <div className="container mx-auto px-4 py-8">
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
            
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF7A00]" />
              </div>
            ) : leagues?.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {leagues.map((league: League) => (
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
        </div>
      ) : (
        <LeagueSetup onCancel={() => setShowLeagueSetup(false)} />
      )}
    </div>
  );
};

export default Index;
