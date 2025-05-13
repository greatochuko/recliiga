import { Users, MapPin, Calendar, LockIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeagueType } from "@/types/league";
import CopyLeagueCodeButton from "./CopyLeagueCodeButton";
import { useAuth } from "@/contexts/AuthContext";

export default function LeagueCard({ league }: { league: LeagueType }) {
  const { user } = useAuth();

  const isJoined =
    league.owner_id === user.id ||
    league.players.some((player) => player.id === user.id);

  return (
    <Card key={league.id} className="overflow-hidden border border-gray-200">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={league.image}
              alt={league.name}
              className="object-cover"
            />
            <AvatarFallback>
              {league.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start justify-between gap-x-4 gap-y-1 sm:flex-row">
            <h3 className="flex flex-1 items-center gap-2 text-lg font-semibold text-gray-800 sm:text-xl">
              {league.name}
              {league.is_private && (
                <LockIcon className="h-4 w-4 text-accent-orange" />
              )}
            </h3>
            {league.owner_id === user.id && (
              <CopyLeagueCodeButton leagueCode={league.leagueCode} />
            )}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#707B81] sm:-mt-10 sm:ml-20">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>
                {league.players.length} Player
                {league.players.length !== 1 && "s"}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span className="line-clamp-1">{league.city}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {new Date(league.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">{league.sport}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {isJoined ? (
          <Link
            to={`/leagues/${league.id}`}
            className={`w-full rounded-md py-2 text-center text-sm font-medium duration-200 ${"border border-accent-orange bg-white text-accent-orange hover:bg-accent-orange/10"}`}
          >
            See More
          </Link>
        ) : (
          <button
            className={`w-full rounded-md py-2 text-center text-sm font-medium duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white ${"border border-accent-orange bg-white text-accent-orange hover:bg-accent-orange/10"}`}
            disabled
          >
            Awaiting confirmation
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
