import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, UserType } from "@/contexts/AuthContext";
import { LeagueType } from "@/types/league";
import { getCardinalSuffix } from "@/lib/utils";
import { useMemo } from "react";

export function PlayerRankCard({
  league,
  playerRank,
  player,
}: {
  league: LeagueType;
  playerRank: number;
  player?: UserType;
}) {
  const { user: authUser } = useAuth();

  const user = player || authUser;

  const userRatings = useMemo(
    () => user.ratings.filter((rating) => rating.event.leagueId === league?.id),
    [league?.id, user.ratings],
  );

  const userRating = useMemo(
    () =>
      userRatings.length > 0
        ? userRatings.reduce((acc, curr) => acc + curr.score, 0) /
          userRatings.length
        : 0,
    [userRatings],
  );

  return (
    <Card className="flex h-full w-full flex-col justify-between bg-accent-orange text-white">
      <CardContent className="flex h-full flex-col items-center justify-between p-4">
        <div className="flex w-full flex-col items-center">
          <h2 className="mb-2 text-base font-bold">
            {league?.name || "League"}
          </h2>
          <Avatar className="mb-2 h-16 w-16">
            <AvatarImage
              src={user.avatar_url}
              alt="Player avatar"
              className="object-cover"
            />
            <AvatarFallback className="text-gray-800">
              {user.full_name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])}
            </AvatarFallback>
          </Avatar>
          <h3 className="mb-1 text-sm font-semibold">{user.full_name}</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-start">
            <div className="flex items-start">
              <span className="text-lg font-bold">{playerRank}</span>
              <span className="mt-0.5 text-xs font-bold">
                {getCardinalSuffix(playerRank)}
              </span>
            </div>
            <span className="ml-0.5 text-lg font-bold">
              /{league?.players.length || 0}
            </span>
          </div>
          <span className="mt-1 text-xs">{league?.name || "League"}</span>
          <div className="mt-2 flex items-center">
            <span className="text-base font-bold">{userRating.toFixed(2)}</span>
            <Star className="ml-1 h-4 w-4 fill-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
