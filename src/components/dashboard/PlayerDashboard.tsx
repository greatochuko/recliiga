import { useEffect, useMemo, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { fetchResultsByLeague } from "@/api/league";
import { getLeaderBoardData, getUpcomingEvents } from "@/lib/utils";
import { fetchLeaguesByUser } from "@/api/league";
import { useAuth } from "@/contexts/AuthContext";
import FullScreenLoader from "../FullScreenLoader";
import RatingSection from "./RatingSection";
import UpcomingEventsSection from "./UpcomingEventsSection";
import PlayerStatsOverview from "./PlayerStatsOverview";

const queryClient = new QueryClient();

export default function PlayerDashboard() {
  const { user } = useAuth();
  const [selectedLeagueId, setSelectedLeagueId] = useState("premier");

  const { data: leaguesData, isLoading: leaguesLoading } = useQuery({
    queryKey: ["teammates"],
    queryFn: fetchLeaguesByUser,
  });

  const leagues = useMemo(
    () => leaguesData?.leagues || [],
    [leaguesData?.leagues],
  );

  useEffect(() => {
    if (leagues.length > 0) {
      const leagueId = leagues[1].id;
      setSelectedLeagueId(leagueId);
    }
  }, [leagues]);

  const events = leagues.flatMap((league) => league.events);

  const selectedLeague = leagues.find(
    (league) => league.id === selectedLeagueId,
  );

  const { data, isLoading: resultsLoading } = useQuery({
    queryKey: [`results-${selectedLeague?.id}`],
    queryFn: () => fetchResultsByLeague(selectedLeague?.id),
  });

  const results = data?.data;

  const leaderboardData =
    selectedLeague && results
      ? getLeaderBoardData(selectedLeague, results)
      : [];

  const playerData = leaderboardData.find((data) => data.player.id === user.id);

  const playerRank =
    [...leaderboardData]
      .sort((a, b) => b.points - a.points)
      .findIndex((data) => data.player.id === user.id) + 1;

  const upcomingEvents = getUpcomingEvents(events);

  if (leaguesLoading) {
    return <FullScreenLoader />;
  }

  const selectedLeagueEvents = selectedLeague?.events || [];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-12">
        <PlayerStatsOverview
          leagues={leagues}
          playerData={playerData}
          playerRank={playerRank}
          selectedLeague={selectedLeague}
          setSelectedLeagueId={setSelectedLeagueId}
        />

        <RatingSection
          events={selectedLeagueEvents}
          isLoading={leaguesLoading}
        />

        <UpcomingEventsSection
          isLoading={leaguesLoading || resultsLoading}
          events={upcomingEvents}
        />
      </div>
    </QueryClientProvider>
  );
}
