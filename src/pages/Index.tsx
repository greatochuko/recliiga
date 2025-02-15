
import { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LeagueSetup from "@/components/LeagueSetup";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface League {
  id: string;
  name: string;
  sport: string;
  city: string;
  description: string | null;
  logo_url: string | null;
}

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

  if (!userRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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

  if (userRole === 'player') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-[#FF7A00]">My Leagues</h1>
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
              <p className="text-xl text-gray-600">You haven't joined any leagues yet.</p>
              <p className="text-gray-500 mt-2">Ask your league organizer for an invite code to join!</p>
            </div>
          )}
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
