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
import { ResultType } from "@/types/events";
import LeaderboradDataRow from "./LeaderboradDataRow";
import { getLeaderBoardData } from "@/lib/utils";

type ResultsLeaderboardProps = {
  league: LeagueType;
  results: ResultType[];
};

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
