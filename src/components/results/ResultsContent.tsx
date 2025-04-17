import { useState } from "react";
import { LeagueCard } from "./LeagueCard";
import { LeagueSelector } from "./LeagueSelector";
import { ResultsLeaderboard } from "./ResultsLeaderboard";
import { LeagueType } from "@/types/league";
import FullScreenLoader from "../FullScreenLoader";
import { useQuery } from "@tanstack/react-query";
import { fetchResultsByLeague } from "@/api/league";

export const ResultsContent = ({ leagues }: { leagues: LeagueType[] }) => {
  const [selectedLeagueId, setSelectedLeagueId] = useState(leagues[0]?.id);

  const selectedLeague = leagues.find(
    (league) => league.id === selectedLeagueId,
  );

  const { data, isLoading } = useQuery({
    queryKey: [`results-${selectedLeague.id}`],
    queryFn: () => fetchResultsByLeague(selectedLeague.id),
  });

  if (isLoading || !data) {
    return <FullScreenLoader />;
  }

  const results = data.data;

  console.log(selectedLeague);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="ml-6 text-2xl font-bold">Results</h1>
        <LeagueSelector
          leagues={leagues}
          selectedLeagueId={selectedLeagueId}
          setSelectedLeagueId={setSelectedLeagueId}
        />
      </div>

      <LeagueCard league={selectedLeague} />

      <ResultsLeaderboard league={selectedLeague} results={results} />
    </div>
  );
};
