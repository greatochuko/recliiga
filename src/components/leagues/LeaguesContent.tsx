import { useMemo, useState } from "react";
import { Users, Search, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaguesByUser } from "@/api/league";

export function LeaguesContent() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: { leagues },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  const filteredLeagues = useMemo(
    () =>
      leagues.filter(
        (league) =>
          league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          league.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
          league.leagueCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          league.city.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [leagues, searchTerm]
  );

  const handleJoinLeague = (leagueId: string) => {
    console.log("Joining league:", leagueId);
    // Here you would typically make an API call to join the league
  };

  const handleViewLeague = (leagueId: string) => {
    // Navigate to the league details page
    navigate(`/leagues/${leagueId}`);
  };

  return (
    <div className="container px-6 pt-16">
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
          className="w-full pl-10 pr-4 py-2"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
        >
          Search
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-4 text-gray-600">
          Searching leagues...
        </div>
      ) : error ? (
        <div className="text-center p-4 text-red-600">{error.message}</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filteredLeagues.length === 0 ? (
            <div className="text-center p-4 text-gray-600">
              No leagues found matching your search.
            </div>
          ) : (
            filteredLeagues.map((league) => {
              // const isJoined = league.players.some(
              //   (player) => player.id === user.id
              // );
              const isJoined = false;
              return (
                <Card
                  key={league.id}
                  className="overflow-hidden border border-gray-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={league.image} alt={league.name} />
                        <AvatarFallback>
                          {league.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {league.name}
                          </h3>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {league.leagueCode}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-[#707B81]">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {/* <span>{league.players.length} Players</span> */}
                            <span>27 Players</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="line-clamp-1">{league.city}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {new Date(league.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
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
                    <Button
                      className={`w-full py-2 text-base ${
                        !isJoined
                          ? "bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
                          : "bg-white text-[#FF7A00] border border-[#FF7A00] hover:bg-[#FF7A00]/10"
                      }`}
                      onClick={() =>
                        !isJoined
                          ? handleJoinLeague(league.id)
                          : handleViewLeague(league.id)
                      }
                    >
                      {!isJoined ? "Join" : "See More"}
                    </Button>
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
