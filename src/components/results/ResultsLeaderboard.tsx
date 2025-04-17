import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LeagueType } from "@/types/league";
import { LeaderboardDataType, ResultType } from "@/types/events";
import LeaderboradDataRow from "./LeaderboradDataRow";

type ResultsLeaderboardProps = {
  league: LeagueType;
  results: ResultType[];
};

function getLeaderBoardData(league: LeagueType, results: ResultType[]) {
  const leaderboardData: LeaderboardDataType[] = league.players.map(
    (player) => {
      const gamesPlayed = league.events.filter(
        (event) =>
          event.resultsEntered &&
          event.players.some((pl) => pl.id === player.id),
      ).length;

      const attendance = results.filter((result) =>
        result.attendingPlayers.some((pl) => pl.id === player.id),
      ).length;

      const nonAttendance = gamesPlayed - attendance;

      let gamesWon = 0;
      let gamesLost = 0;
      let gamesWonAsCaptain = 0;

      results.forEach((result) => {
        const attended = result.attendingPlayers.some(
          (pl) => pl.id === player.id,
        );
        if (!attended) return;

        const isTeam1 = result.events.some(
          (event) =>
            event.teams[0].players.some((pl) => pl.id === player.id) ||
            event.teams[0].captain.id === player.id,
        );
        const isTeam2 = result.events.some(
          (event) =>
            event.teams[1].players.some((pl) => pl.id === player.id) ||
            event.teams[1].captain.id === player.id,
        );

        if (isTeam1 || isTeam2) {
          const teamScore = isTeam1 ? result.team1Score : result.team2Score;
          const opponentScore = isTeam1 ? result.team2Score : result.team1Score;

          if (teamScore > opponentScore) gamesWon++;
          else if (teamScore < opponentScore) gamesLost++;

          const wasCaptain = result.events.some(
            (event) =>
              (event.teams[0].captain.id === player.id &&
                teamScore > opponentScore &&
                isTeam1) ||
              (event.teams[1].captain.id === player.id &&
                teamScore > opponentScore &&
                isTeam2),
          );
          if (wasCaptain) gamesWonAsCaptain++;
        }
      });

      const gamesTied = gamesPlayed - gamesWon - gamesLost;

      const points =
        gamesWon * league.stats.find((stat) => stat.name === "Win").points +
        gamesTied * league.stats.find((stat) => stat.name === "Tie").points +
        gamesWonAsCaptain *
          league.stats.find((stat) => stat.name === "Captain Win").points +
        attendance *
          league.stats.find((stat) => stat.name === "Attendance").points +
        nonAttendance *
          league.stats.find((stat) => stat.name === "Non-Attendance").points;

      return {
        player,
        gamesPlayed,
        gamesWon,
        gamesLost,
        gamesTied,
        gamesWonAsCaptain,
        attendance,
        nonAttendance,
        points,
      };
    },
  );

  return leaderboardData;
}

export const ResultsLeaderboard = ({
  league,
  results,
}: ResultsLeaderboardProps) => {
  const leaderboardData = getLeaderBoardData(league, results);

  const tableHeaders = [
    {
      abbr: "GP",
      name: "Games Played",
      points: "",
    },
    ...league.stats,
    {
      abbr: "PTS",
      name: "Total Points",
      points: "",
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Results Leaderboard</h2>
      <Card>
        <CardContent className="p-0">
          <TooltipProvider delayDuration={300}>
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead className="w-48 min-w-36">Name</TableHead>
                  {tableHeaders.map((stat) => (
                    <TableHead
                      key={stat.abbr}
                      className="relative w-16 whitespace-nowrap text-center"
                    >
                      <Tooltip>
                        <TooltipTrigger className="w-full cursor-help">
                          {stat.abbr}
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="center"
                          className="z-50"
                          sideOffset={5}
                        >
                          <p>
                            {stat.name} {stat.points && `(${stat.points})`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((data, index) => (
                  <LeaderboradDataRow
                    key={index}
                    data={data}
                    rank={index + 1}
                  />
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};
