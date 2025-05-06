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
import { useMemo, useState } from "react";
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
} from "lucide-react";

type ResultsLeaderboardProps = {
  league: LeagueType;
  results: ResultType[];
};

export const ResultsLeaderboard = ({
  league,
  results,
}: ResultsLeaderboardProps) => {
  const leaderboardData = getLeaderBoardData(league, results);
  const [sortBy, setSortBy] = useState<{ name: string; type: "asc" | "desc" }>({
    name: "PTS",
    type: "desc",
  });

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

  function toggleSortBy(name: string) {
    if (sortBy.name === name) {
      setSortBy((prev) => ({
        ...prev,
        type: prev.type === "asc" ? "desc" : "asc",
      }));
    } else {
      setSortBy({ name, type: "desc" });
    }
  }

  const sortedLeaderboardData = useMemo(
    () =>
      [...leaderboardData].sort((a, b) => {
        switch (sortBy.name) {
          case "PTS": {
            const aGP = a.points;
            const bGP = b.points;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          case "GP": {
            const aGP = a.gamesPlayed;
            const bGP = b.gamesPlayed;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          case "W": {
            const aGP = a.gamesWon;
            const bGP = b.gamesWon;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          case "L": {
            const aGP = a.gamesLost;
            const bGP = b.gamesLost;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          case "T": {
            const aGP = a.gamesTied;
            const bGP = b.gamesTied;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          case "CW": {
            const aGP = a.gamesWonAsCaptain;
            const bGP = b.gamesWonAsCaptain;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          case "ATT": {
            const aGP = a.attendance;
            const bGP = b.attendance;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          case "N-ATT": {
            const aGP = a.nonAttendance;
            const bGP = b.nonAttendance;
            if (aGP === bGP) {
              return 0;
            } else if (aGP > bGP) {
              return sortBy.type === "asc" ? 1 : -1;
            } else {
              return sortBy.type === "asc" ? -1 : 1;
            }
          }

          default:
            break;
        }
      }),
    [leaderboardData, sortBy.name, sortBy.type],
  );

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
                  <TableHead className="w-48 min-w-36 border-l">Name</TableHead>
                  {tableHeaders.map((stat) => (
                    <TableHead
                      key={stat.abbr}
                      className="relative w-16 whitespace-nowrap border-l text-center"
                    >
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() => toggleSortBy(stat.abbr)}
                          className="flex w-full cursor-pointer items-center gap-1"
                        >
                          {stat.abbr}{" "}
                          {sortBy.name === stat.abbr ? (
                            sortBy.type === "desc" ? (
                              <ChevronDownIcon
                                className="h-4 w-4 text-gray-700"
                                strokeWidth={3}
                              />
                            ) : (
                              <ChevronUpIcon
                                className="h-4 w-4 text-gray-700"
                                strokeWidth={3}
                              />
                            )
                          ) : (
                            <ChevronsUpDownIcon className="h-4 w-4" />
                          )}
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
                {sortedLeaderboardData.map((data, index) => (
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
