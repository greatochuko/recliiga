import { useMemo, useState } from "react";
import { Users, Search, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { LeagueType } from "@/types/league";
import CopyLeagueCodeButton from "./CopyLeagueCodeButton";

export function LeaguesContent({
  leagues,
  isLoading,
  error,
}: {
  leagues: LeagueType[];
  isLoading: boolean;
  error: Error;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const filteredLeagues = useMemo(
    () =>
      leagues.filter(
        (league) =>
          league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          league.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
          league.leagueCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          league.city.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [leagues, searchTerm],
  );

  const handleJoinLeague = (leagueId: string) => {
    console.log("Joining league:", leagueId);
  };

  return (
    <div className="container px-6 pt-10">
      <Label htmlFor="search" className="sr-only">
        Search leagues
      </Label>
      <div className="relative mb-4">
        <Input
          id="search"
          type="text"
          placeholder="Search by Name, Sport, League Code or City"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center bg-accent-orange px-4 text-white hover:bg-accent-orange/90"
        >
          Search
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-600">
          Searching leagues...
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">{error.message}</div>
      ) : leagues.length < 1 ? (
        <div className="p-4 text-center text-gray-600">
          No leagues available at the moment.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredLeagues.length < 1 ? (
            <div className="p-4 text-center text-gray-600">
              No leagues found matching your search.
            </div>
          ) : (
            filteredLeagues.map((league) => {
              const isJoined =
                league.owner_id === user.id ||
                league.players.some((player) => player.id === user.id);

              return (
                <Card
                  key={league.id}
                  className="overflow-hidden border border-gray-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={league.image} alt={league.name} />
                        <AvatarFallback>
                          {league.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {league.name}
                          </h3>
                          {league.owner_id === user.id && (
                            <CopyLeagueCodeButton
                              leagueCode={league.leagueCode}
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-[#707B81]">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <span>{league.players.length} Players</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            <span className="line-clamp-1">{league.city}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>
                              {new Date(league.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">{league.sport}</span>
                          </div>
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
                        className={`w-full rounded-md py-2 text-center text-sm font-medium duration-200 ${"bg-accent-orange text-white hover:bg-accent-orange/90"}`}
                        onClick={() => handleJoinLeague(league.id)}
                      >
                        Join
                      </button>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
