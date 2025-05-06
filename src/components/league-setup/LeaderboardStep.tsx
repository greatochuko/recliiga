import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeagueDataType } from "@/api/league";

export function LeaderboardStep({
  leagueData,
  updateLeagueData,
}: {
  leagueData: LeagueDataType;
  updateLeagueData: (newData: Partial<LeagueDataType>) => void;
}) {
  const [tieLinkedToWin, setTieLinkedToWin] = useState(true);

  const handlePointChange = (statName: string, value: number) => {
    updateLeagueData({
      stats: leagueData.stats.map((stat) =>
        stat.name === statName ? { ...stat, points: Number(value) || 0 } : stat,
      ),
    });

    if (statName === "Tie") {
      setTieLinkedToWin(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Leaderboard Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-4 gap-4 text-sm font-semibold text-gray-600">
          <div className="text-center">Statistic</div>
          <div className="text-center">Abbreviation</div>
          <div className="text-center">Points</div>
          <div className="text-center">Actions</div>
        </div>

        {leagueData.stats.map((stat, index) => (
          <div
            key={stat.name}
            className={`grid grid-cols-4 gap-4 py-2 ${
              index !== leagueData.stats.length - 1 ? "border-b" : ""
            }`}
          >
            <p className="text-center font-semibold">{stat.name}</p>
            <p className="text-center">{stat.abbr}</p>
            <div className="text-center font-semibold">
              <Input
                type="number"
                value={
                  stat.name === "Tie" && tieLinkedToWin
                    ? (
                        leagueData.stats.find((stat) => stat.name === "Win")
                          .points / 2
                      ).toFixed(1)
                    : stat.points
                }
                onChange={(e) =>
                  handlePointChange(stat.name, parseFloat(e.target.value))
                }
                className="mx-auto w-16 text-center"
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePointChange(stat.name, stat.points - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePointChange(stat.name, stat.points + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
