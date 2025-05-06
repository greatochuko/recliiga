import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeagueType } from "@/types/league";
import LeagueCard from "./LeagueCard";
import { SearchIcon } from "lucide-react";
import FullScreenLoader from "../FullScreenLoader";

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

  return (
    <div>
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
          className="w-full py-2 pl-10 text-sm"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <FullScreenLoader className="h-40" />
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
            filteredLeagues.map((league) => (
              <LeagueCard key={league.id} league={league} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
