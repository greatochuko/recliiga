
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { LeagueData } from "./types";

type LeagueCardProps = {
  league: LeagueData;
};

export const LeagueCard = ({ league }: LeagueCardProps) => {
  return (
    <Card className="w-full mb-6 bg-[#F9F9F9] rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start">
          <Avatar className="w-16 h-16 mr-4">
            <AvatarImage src={league.logo} alt={league.name} />
            <AvatarFallback>{league.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.8)]">{league.name}</h3>
              <span className="text-sm text-[rgba(0,0,0,0.51)]">{league.date}</span>
            </div>
            <div className="flex items-center text-sm text-[#F79602] mt-1">
              <Users className="w-4 h-4 mr-1" />
              {league.players} Players
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total Games: {league.totalGames}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
