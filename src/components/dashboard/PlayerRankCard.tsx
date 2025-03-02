
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerRankCardProps {
  league: {
    name: string;
    playerName: string;
    rank: number;
    totalPlayers: number;
    rating: number;
  };
}

export function PlayerRankCard({ league }: PlayerRankCardProps) {
  return (
    <Card className="bg-[#FF7A00] text-white w-full h-full flex flex-col justify-between">
      <CardContent className="p-4 flex flex-col items-center h-full justify-between">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-base font-bold mb-2">{league.name}</h2>
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Player avatar" />
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
}
