import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { LeagueType } from "@/types/league";

type LeagueCardProps = {
  league: LeagueType;
};

export const LeagueCard = ({ league }: LeagueCardProps) => {
  return (
    <Card className="w-full overflow-hidden rounded-lg bg-[#F9F9F9]">
      <CardContent className="p-4">
        <div className="flex items-start">
          <Avatar className="mr-4 h-16 w-16">
            <AvatarImage src={league.image} alt={league.name} />
            <AvatarFallback>{league.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.8)]">
                {league.name}
              </h3>
              <span className="text-sm text-[rgba(0,0,0,0.51)]">
                {new Date(league.date).toLocaleDateString("us-en", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="mt-1 flex items-center text-sm text-[#F79602]">
              <Users className="mr-1 h-4 w-4" />
              {league.players.length} Players
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Total Games: {league?.results?.length || 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
