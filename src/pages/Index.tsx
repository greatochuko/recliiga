
import { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LeagueSetup from "@/components/LeagueSetup";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLeagueSetup, setShowLeagueSetup] = useState(false);
  const navigate = useNavigate();

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

  if (!userRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (userRole === 'player') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to REC LiiGA</h1>
          <p className="text-xl text-gray-600">Browse and join leagues in your area!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!showLeagueSetup ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-[#FF7A00]">Welcome to REC LiiGA</h1>
            <p className="text-xl text-gray-600 mb-8">Start organizing your sports leagues today!</p>
            <Button 
              onClick={() => setShowLeagueSetup(true)}
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
            >
              Create New League
            </Button>
          </div>
        </div>
      ) : (
        <LeagueSetup onCancel={() => setShowLeagueSetup(false)} />
      )}
    </div>
  );
};

export default Index;
