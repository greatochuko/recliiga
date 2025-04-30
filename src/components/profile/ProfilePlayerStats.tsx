import { fetchLeaguesByUser, fetchResultsByLeague } from "@/api/league";
import { PlayerRankCard } from "@/components/dashboard/PlayerRankCard";
import { useAuth, UserType } from "@/contexts/AuthContext";
import PlayerRecordCard from "@/components/dashboard/PlayerRecordCard";
import { getLeaderBoardData } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FullScreenLoader from "../FullScreenLoader";

export default function ProfilePlayerStats({ user }: { user: UserType }) {
  const { user: authUser } = useAuth();
  const [selectedLeague, setSelectedLeague] = useState(null);

  const {
    data: { leagues },
    isLoading,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  useEffect(() => {
    if (leagues && leagues.length > 0) {
      setSelectedLeague(leagues[0]);
    }
  }, [leagues]);

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
    [...leaderboardData]
      .sort((a, b) => b.points - a.points)
      .findIndex((data) => data.player.id === user.id) + 1;

  if (isLoading || !selectedLeague) {
    return <FullScreenLoader />;
  }

  if (!leagues || leagues.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">No Leagues Found</h1>
        <p className="mt-4 text-gray-600">
          The user is not a member of any leagues. They need to join a league to
          view their stats.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {user.id === authUser.id ? "Your" : user.full_name.split(" ")[0]}
          {"'s "}
          Stats
        </h2>
        <Select
          value={selectedLeague.id}
          onValueChange={(value) =>
            setSelectedLeague(leagues.find((l) => l.id === value))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select League" />
          </SelectTrigger>
          <SelectContent>
            {leagues.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid h-[calc(100%-2rem)] max-h-[320px] grid-cols-2 gap-4">
        <PlayerRankCard
          league={selectedLeague}
          playerRank={playerRank}
          player={user}
        />
        <PlayerRecordCard playerData={playerData} />
      </div>
    </div>
  );
}
