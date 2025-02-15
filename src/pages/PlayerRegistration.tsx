
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoStep from '@/components/player-registration/PersonalInfoStep';
import JoinLeagueStep from '@/components/player-registration/JoinLeagueStep';
import { toast } from 'sonner';

export type PlayerProfile = {
  nickname: string;
  date_of_birth: string;
  city: string;
  sports: string[];
  positions: string[];
  avatar_url?: string;
}

const PlayerRegistration = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<PlayerProfile>({
    nickname: '',
    date_of_birth: '',
    city: '',
    sports: [],
    positions: [],
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  const handleProfileUpdate = async (profileData: Partial<PlayerProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      setProfile(prev => ({ ...prev, ...profileData }));
      setStep(2);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLeagueJoin = async (leagueId: string) => {
    try {
      const { error } = await supabase
        .from('league_members')
        .insert({
          league_id: leagueId,
          player_id: user?.id,
        });

      if (error) throw error;
      
      toast.success('Successfully joined the league!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FF7A00] text-center mb-8">Complete Your Profile</h1>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-[#FF7A00] text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-[#FF7A00]' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[#FF7A00] text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              {step === 1 ? 'Personal Information' : 'Join a League'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <PersonalInfoStep onSubmit={handleProfileUpdate} initialData={profile} />
            ) : (
              <JoinLeagueStep onJoinLeague={handleLeagueJoin} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerRegistration;
