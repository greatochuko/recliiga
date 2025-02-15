
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JoinLeagueStepProps {
  onJoinLeague: (leagueId: string) => void;
}

export default function JoinLeagueStep({ onJoinLeague }: JoinLeagueStepProps) {
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
        .single();

      if (error) throw error;
      return data;
    },
    enabled: leagueCode.length > 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!league) {
      setError('Please enter a valid league code');
      return;
    }

    onJoinLeague(league.id);
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
          <AlertDescription>
            You are about to join: <strong>{league.name}</strong> in {league.city}
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
        Join League
      </Button>
    </form>
  );
}
