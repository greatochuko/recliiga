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
    <Card className="bg-accent-orange flex h-full w-full flex-col justify-between text-white">
      <CardContent className="flex h-full flex-col items-center justify-between p-4">
        <div className="flex w-full flex-col items-center">
          <h2 className="mb-2 text-base font-bold">{league.name}</h2>
          <Avatar className="mb-2 h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt="Player avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3 className="mb-1 text-sm font-semibold">{league.playerName}</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-start">
            <div className="flex items-start">
              <span className="text-lg font-bold">{league.rank}</span>
              <span className="mt-0.5 text-xs font-bold">th</span>
            </div>
            <span className="ml-0.5 text-lg font-bold">
              /{league.totalPlayers}
            </span>
          </div>
          <span className="mt-1 text-xs">{league.name}</span>
          <div className="mt-2 flex items-center">
            <span className="text-base font-bold">
              {Math.max(0.5, Math.min(3.0, league.rating)).toFixed(2)}
            </span>
            <Star className="ml-1 h-4 w-4 fill-white" />
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
          className={`h-6 w-6 ${star <= rating ? "text-accent-orange fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

export function PlayerStats({ playerStats }: { playerStats: PlayerStatsType }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <PlayerRankCard
        league={{
          name:
            typeof playerStats.league === "string"
              ? playerStats.league
              : playerStats.league.name,
          playerName: playerStats.name,
          rank: playerStats.position,
          totalPlayers: playerStats.totalTeams,
          rating: 2.5,
        }}
      />

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-bold">Record</h3>
        <div className="space-y-4">
          <div className="mb-4 flex justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold">{playerStats.points}</span>
              <span className="block text-gray-500">PTS</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded bg-emerald-100 p-2">
              <div className="text-lg font-bold text-emerald-700">
                {playerStats.wins}
              </div>
              <div className="text-xs text-emerald-600">Won</div>
            </div>
            <div className="rounded bg-red-100 p-2">
              <div className="text-lg font-bold text-red-700">
                {playerStats.losses}
              </div>
              <div className="text-xs text-red-600">Loss</div>
            </div>
            <div className="rounded bg-orange-100 p-2">
              <div className="text-lg font-bold text-orange-700">
                {playerStats.ties}
              </div>
              <div className="text-xs text-orange-600">Tied</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PlayerStats as PlayerStatsDisplay };
