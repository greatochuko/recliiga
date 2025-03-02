
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
          privacy_setting: leagueData.privacySetting,
          season_start: leagueData.seasonStartDate,
          season_end: leagueData.seasonEndDate,
          registration_deadline: leagueData.registrationDeadline,
          owner_id: user!.id,
          stat_points: leagueData.statPoints,
          stats: leagueData.stats
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
