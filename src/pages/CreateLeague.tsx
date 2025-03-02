
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LeagueSetup } from '@/components/league-setup/LeagueSetup';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function CreateLeague() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async (leagueData: any) => {
    try {
      // Save the league data to Supabase
      const { error } = await supabase
        .from('leagues')
        .insert({
          name: leagueData.leagueName,
          sport: leagueData.sport,
          is_private: leagueData.privacySetting === 'private',
          start_date: leagueData.seasonStartDate,
          city: 'Default City', // Required field that wasn't in the form
          location: 'Default Location', // Required field that wasn't in the form
          owner_id: user!.id
        });

      if (error) {
        throw error;
      }

      toast.success('League created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to create league: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FF7A00] text-center mb-8">Create Your League</h1>
        
        <LeagueSetup onComplete={handleComplete} />
      </div>
    </div>
  );
}
