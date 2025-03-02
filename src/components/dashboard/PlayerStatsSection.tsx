
import { PlayerStats } from "./PlayerStats";

export function PlayerStatsSection() {
  const stats = {
    wins: 12,
    losses: 3,
    ties: 2,
    points: 38,
    league: {
      name: "Soccer League"
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>
      <PlayerStats stats={stats} userName="John Doe" />
    </div>
  );
}
