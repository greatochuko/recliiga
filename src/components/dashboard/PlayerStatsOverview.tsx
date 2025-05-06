import { LeaderboardDataType } from "@/types/events";
import { LeagueType } from "@/types/league";
import { LeagueSelector } from "./LeagueSelector";
import { PlayerRankCard } from "./PlayerRankCard";
import PlayerRecordCard from "./PlayerRecordCard";

export default function PlayerStatsOverview({
  leagues,
  selectedLeague,
  setSelectedLeagueId,
  playerRank,
  playerData,
}: {
  leagues: LeagueType[];
  selectedLeague: LeagueType;
  setSelectedLeagueId: (leagueId: string) => void;
  playerRank: number;
  playerData: LeaderboardDataType;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="ml-8 text-2xl font-bold">Your Stats</h2>
        <LeagueSelector
          leagues={leagues}
          onLeagueChange={(leagueId) => setSelectedLeagueId(leagueId)}
          selectedLeague={selectedLeague}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PlayerRankCard league={selectedLeague} playerRank={playerRank} />
        <PlayerRecordCard playerData={playerData} />
      </div>
    </div>
  );
}
