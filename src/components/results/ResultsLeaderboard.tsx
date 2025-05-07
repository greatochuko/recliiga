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
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-bold">Results Leaderboard</h2>

      <div className="w-full overflow-x-auto rounded-md border text-sm">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-500">Rank</th>
              <th className="border-l p-4 text-left font-medium text-gray-500">
                Name
              </th>
              {tableHeaders.map((stat) => (
                <th
                  key={stat.abbr}
                  className="whitespace-nowrap border-l p-4 font-medium text-gray-500"
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
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboardData.map((data, index) => (
              <tr key={data.player.id} className="border-b last:border-b-0">
                <td className="p-3 text-center font-medium">{index + 1}</td>
                <td className="border-l p-3 font-medium">
                  <Link
                    to={`/profile/${data.player.id}`}
                    className="group flex cursor-pointer items-center whitespace-nowrap transition-colors"
                  >
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage
                        src={data.player.avatar_url}
                        alt={data.player.full_name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {data.player.full_name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="group-hover:text-accent-orange group-hover:underline">
                      {data.player.full_name}
                    </span>
                  </Link>
                </td>
                <td className="border-l p-3 text-center">{data.gamesPlayed}</td>
                <td className="border-l p-3 text-center">{data.gamesWon}</td>
                <td className="border-l p-3 text-center">{data.gamesLost}</td>
                <td className="border-l p-3 text-center">{data.gamesTied}</td>
                <td className="border-l p-3 text-center">
                  {data.gamesWonAsCaptain}
                </td>
                <td className="border-l p-3 text-center">{data.attendance}</td>
                <td className="border-l p-3 text-center">
                  {data.nonAttendance}
                </td>
                <td className="border-l p-3 text-center font-bold">
                  {data.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
