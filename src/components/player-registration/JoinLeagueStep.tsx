
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface JoinLeagueStepProps {
  onJoinLeague: (leagueId: string) => void;
}

export default function JoinLeagueStep({ onJoinLeague }: JoinLeagueStepProps) {
  const { user } = useAuth();
  const [leagueCode, setLeagueCode] = useState('');
  const [error, setError] = useState('');

  const { data: league, isLoading } = useQuery({
    queryKey: ['league', leagueCode],
    queryFn: async () => {
      if (!leagueCode) return null;
      
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('league_code', leagueCode)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: leagueCode.length > 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!league) {
      setError('No league found with this code. Please check and try again.');
      return;
    }

    if (!user) {
      setError('You must be logged in to join a league.');
      return;
    }

    try {
      const { error } = await supabase
        .from('league_members')
        .insert({
          league_id: league.id,
          player_id: user.id,
          status: league.requires_approval ? 'pending' : 'approved'
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          setError('You have already requested to join this league.');
        } else {
          throw error;
        }
        return;
      }

      if (league.requires_approval) {
        toast.success('Your request to join has been submitted and is pending approval.');
      } else {
        toast.success('Successfully joined the league!');
      }

      onJoinLeague(league.id);
    } catch (error: any) {
      console.error('Error joining league:', error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="leagueCode">
          League Code
        </label>
        <Input
          id="leagueCode"
          value={leagueCode}
          onChange={(e) => setLeagueCode(e.target.value)}
          placeholder="Enter the league code"
          className="uppercase"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#FF7A00]" />
        </div>
      )}

      {league && (
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            {league.is_private && <Lock className="h-4 w-4" />}
            You are about to join: <strong>{league.name}</strong> in {league.city}
            {league.requires_approval && 
              <span className="text-xs text-muted-foreground">(Requires approval)</span>
            }
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90"
        disabled={!league || isLoading}
      >
        {league?.requires_approval ? 'Request to Join' : 'Join League'}
      </Button>
    </form>
  );
}
