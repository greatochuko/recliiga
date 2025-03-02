import { useQuery } from '@tanstack/react-query';
import { PlayerStats } from "@/types/dashboard";

async function fetchPlayerStats(): Promise<PlayerStats> {
  return {
    name: "John Doe",
    position: 5,
    totalTeams: 12,
    league: "Premier League",
    points: 15,
    wins: 5,
    losses: 2,
    ties: 1,
    record: { wins: 5, losses: 2, ties: 1 }
  };
}

export function PlayerStatsSection() {
  const { data: playerStats, isLoading } = useQuery({
    queryKey: ['playerStats'],
    queryFn: fetchPlayerStats
  });

  if (isLoading || !playerStats) {
    return <div>Loading player stats...</div>;
  }

  const playerStatsData: PlayerStats = {
    name: "John Doe", // Add player name
    position: 5, // Add position (rank)
    totalTeams: 12, // Add total teams
    league: "Premier League",
    points: 15,
    wins: 5,
    losses: 2,
    ties: 1,
    record: { wins: 5, losses: 2, ties: 1 }
  };

  return (
    <div>
      {/* Display player stats here */}
      <p>Name: {playerStatsData.name}</p>
      <p>Position: {playerStatsData.position}</p>
      <p>Total Teams: {playerStatsData.totalTeams}</p>
      <p>League: {playerStatsData.league}</p>
      <p>Points: {playerStatsData.points}</p>
      <p>Wins: {playerStatsData.wins}</p>
      <p>Losses: {playerStatsData.losses}</p>
      <p>Ties: {playerStatsData.ties}</p>
    </div>
  );
}
