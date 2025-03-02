
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LeagueSetup } from '@/components/league-setup/LeagueSetup';
import { toast } from 'sonner';

export default function CreateLeague() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async () => {
    try {
      // For Phase 1, just simulate success
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
