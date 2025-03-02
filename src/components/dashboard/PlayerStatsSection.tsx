import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getLeagueName } from '@/types/dashboard';

interface PlayerStatsProps {
  playerStats: {
    name: string;
    position: number;
    totalTeams: number;
    league: string | { name: string; id?: string };
    points: number;
    wins: number;
    losses: number;
    ties: number;
  };
}

export function PlayerStatsSection({ playerStats }: PlayerStatsProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold">{getLeagueName(playerStats.league)}</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-md font-bold">Player Info</h3>
            <p>Name: {playerStats.name}</p>
            <p>Position: {playerStats.position} / {playerStats.totalTeams}</p>
          </div>
          <div>
            <h3 className="text-md font-bold">Record</h3>
            <p>Wins: {playerStats.wins}</p>
            <p>Losses: {playerStats.losses}</p>
            <p>Ties: {playerStats.ties}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-bold">Points</h3>
          <p>{playerStats.points}</p>
        </div>
      </CardContent>
    </Card>
  );
}
