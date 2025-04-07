import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface PlayerRankCardProps {
  league: {
    name: string;
    rank: number;
    totalPlayers: number;
    rating: number;
  };
}

export function PlayerRankCard({ league }: PlayerRankCardProps) {
  const { user } = useAuth();

  return (
    <Card className="bg-accent-orange flex h-full w-full flex-col justify-between text-white">
      <CardContent className="flex h-full flex-col items-center justify-between p-4">
        <div className="flex w-full flex-col items-center">
          <h2 className="mb-2 text-base font-bold">{league.name}</h2>
          <Avatar className="mb-2 h-16 w-16">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="Player avatar"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3 className="mb-1 text-sm font-semibold">{user.full_name}</h3>
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
}
