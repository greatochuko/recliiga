import { useEffect, useState } from "react";
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
import TeammatesSection from "./TeammatesSection";
import UpcomingEventsSection from "./UpcomingEventsSection";
import PlayerStatsOverview from "./PlayerStatsOverview";

const queryClient = new QueryClient();

export default function PlayerDashboard() {
  const { user } = useAuth();
  const [selectedLeagueId, setSelectedLeagueId] = useState("premier");

  const {
    data: { leagues },
    isLoading: leaguesLoading,
  } = useQuery({
    queryKey: ["teammates"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  useEffect(() => {
    if (leagues.length > 0) {
      const leagueId = leagues[0].id;
      setSelectedLeagueId(leagueId);
    }
  }, [leagues]);

  const teammates = Array.from(
    new Map(
      leagues
        .flatMap((league) => league.players)
        .map((player) => [player.id, player]),
    ).values(),
  ).filter((player) => player.id !== user.id);

  // const {
  //   data: { data: events },
  //   isLoading: eventsLoading,
  // } = useQuery({
  //   queryKey: ["upcomingEvents"],
  //   queryFn: fetchEventsByUser,
  //   initialData: { data: [], error: null },
  // });

  const events = leagues.flatMap((league) => league.events);

  const selectedLeague = leagues.find(
    (league) => league.id === selectedLeagueId,
  );

  const { data } = useQuery({
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
    leaderboardData.findIndex((data) => data.player.id === user.id) + 1;

  const upcomingEvents = getUpcomingEvents(events);

  if (leaguesLoading) {
    return <FullScreenLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-8">
        <PlayerStatsOverview
          leagues={leagues}
          playerData={playerData}
          playerRank={playerRank}
          selectedLeague={selectedLeague}
          setSelectedLeagueId={setSelectedLeagueId}
        />

        <TeammatesSection teammates={teammates} />

        <UpcomingEventsSection events={upcomingEvents} />
      </div>
    </QueryClientProvider>
  );
}
