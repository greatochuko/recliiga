import { PlayerProfile } from "@/pages/PlayerRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { positions, sports } from "@/lib/constants";

interface SportsAndPositionsProps {
  playerData: { sports: string[]; positions: Record<string, string[]> };
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
}

export default function SportsAndPositions({
  playerData,
  updatePlayerData,
}: SportsAndPositionsProps) {
  const handleSportChange = (sport: string) => {
    const updatedSports = playerData.sports.includes(sport)
      ? playerData.sports.filter((s) => s !== sport)
      : [...playerData.sports, sport];

    updatePlayerData({
      sports: updatedSports,
      positions: updatedSports.reduce(
        (acc, s) => {
          if (!playerData.positions[s]) {
            acc[s] = [];
          } else {
            acc[s] = playerData.positions[s];
          }
          return acc;
        },
        {} as Record<string, string[]>,
      ),
    });
  };

  const handlePositionChange = (sport: string, position: string) => {
    const updatedPositions = playerData.positions[sport]?.includes(position)
      ? playerData.positions[sport].filter((p) => p !== position)
      : [...(playerData.positions[sport] || []), position];

    updatePlayerData({
      positions: {
        ...playerData.positions,
        [sport]: updatedPositions,
      },
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Sports & Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Sports
            </Label>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
              {sports.map((sport) => (
                <Label
                  htmlFor={sport}
                  key={sport}
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                >
                  <Checkbox
                    id={sport}
                    checked={playerData.sports.includes(sport)}
                    onCheckedChange={() => handleSportChange(sport)}
                  />
                  {sport}
                </Label>
              ))}
            </div>
          </div>

          {playerData.sports.length > 0 && (
            <>
              <div className="my-6 border-t border-gray-200"></div>
              <div className="rounded-lg bg-gray-50 p-4">
                <Label className="mb-4 block text-sm font-semibold text-gray-700">
                  Select Positions for Your Sports
                </Label>
                {playerData.sports.map((sport) => (
                  <div key={sport} className="mb-6 last:mb-0">
                    <Label className="mb-2 block text-sm font-medium text-gray-700">
                      {sport}
                    </Label>
                    <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
                      {positions[sport].map((position: string) => (
                        <Label
                          key={position}
                          htmlFor={`${sport}-${position}`}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                        >
                          <Checkbox
                            id={`${sport}-${position}`}
                            checked={playerData.positions[sport]?.includes(
                              position,
                            )}
                            onCheckedChange={() =>
                              handlePositionChange(sport, position)
                            }
                          />
                          {position}
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
