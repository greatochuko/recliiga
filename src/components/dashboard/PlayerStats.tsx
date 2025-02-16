
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User } from "lucide-react";
import type { PlayerStats as PlayerStatsType } from "@/types/dashboard";

interface PlayerStatsProps {
  stats: PlayerStatsType;
  userName: string;
}

interface PlayerRankCardProps {
  league: {
    name: string;
    playerName: string;
    rank: number;
    totalPlayers: number;
    rating: number;
  };
}

const PlayerRankCard = ({ league }: PlayerRankCardProps) => {
  return (
    <Card className="bg-[#FF7A00] text-white w-full h-full flex flex-col justify-between">
      <CardContent className="p-4 flex flex-col items-center h-full justify-between">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-base font-bold mb-2">{league.name}</h2>
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src="/placeholder.svg" alt="Player avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-semibold mb-1">{league.playerName}</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-start">
            <div className="flex items-start">
              <span className="text-lg font-bold">{league.rank}</span>
              <span className="text-xs font-bold mt-0.5">th</span>
            </div>
            <span className="text-lg font-bold ml-0.5">/{league.totalPlayers}</span>
          </div>
          <span className="text-xs mt-1">{league.name}</span>
          <div className="flex items-center mt-2">
            <span className="text-base font-bold">{Math.max(0.50, Math.min(3.00, league.rating)).toFixed(2)}</span>
            <Star className="w-4 h-4 ml-1 fill-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 ${star <= rating ? "text-[#FF7A00] fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

export const PlayerStatsDisplay = ({ stats, userName }: PlayerStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PlayerRankCard
        league={{
          name: stats.league?.name || 'League',
          playerName: userName,
          rank: 8,
          totalPlayers: 15,
          rating: 2.5,
        }}
      />

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Record</h3>
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="text-center">
              <span className="text-3xl font-bold">{stats.points}</span>
              <span className="text-gray-500 block">PTS</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-100 rounded p-2">
              <div className="text-emerald-700 font-bold text-lg">{stats.wins}</div>
              <div className="text-emerald-600 text-xs">Won</div>
            </div>
            <div className="bg-red-100 rounded p-2">
              <div className="text-red-700 font-bold text-lg">{stats.losses}</div>
              <div className="text-red-600 text-xs">Loss</div>
            </div>
            <div className="bg-orange-100 rounded p-2">
              <div className="text-orange-700 font-bold text-lg">{stats.ties}</div>
              <div className="text-orange-600 text-xs">Tied</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Re-export with the original name for backward compatibility
export { PlayerStatsDisplay as PlayerStats };
