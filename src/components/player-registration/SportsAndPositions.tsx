import { PlayerProfile } from "@/pages/PlayerRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface SportsAndPositionsProps {
  playerData: PlayerProfile;
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
  sports: string[];
  positions: Record<string, string[]>;
}

export default function SportsAndPositions({
  playerData,
  updatePlayerData,
  sports,
  positions,
}: SportsAndPositionsProps) {
  const handleSportChange = (sport: string) => {
    const updatedSports = playerData.sports.includes(sport)
      ? playerData.sports.filter((s) => s !== sport)
      : [...playerData.sports, sport];

    updatePlayerData({
      sports: updatedSports,
      positions: updatedSports.reduce((acc, s) => {
        if (!playerData.positions[s]) {
          acc[s] = [];
        } else {
          acc[s] = playerData.positions[s];
        }
        return acc;
      }, {} as Record<string, string[]>),
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
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Sports & Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-sm text-gray-700 mb-2 block font-semibold">
              Select Sports
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {sports.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox
                    id={sport}
                    checked={playerData.sports.includes(sport)}
                    onCheckedChange={() => handleSportChange(sport)}
                  />
                  <Label htmlFor={sport} className="text-sm text-gray-600">
                    {sport}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {playerData.sports.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-6"></div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm text-gray-700 mb-4 block font-semibold">
                  Select Positions for Your Sports
                </Label>
                {playerData.sports.map((sport) => (
                  <div key={sport} className="mb-6 last:mb-0">
                    <Label className="text-sm text-gray-700 mb-2 block font-medium">
                      {sport}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {positions[sport].map((position) => (
                        <div
                          key={position}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${sport}-${position}`}
                            checked={playerData.positions[sport]?.includes(
                              position
                            )}
                            onCheckedChange={() =>
                              handlePositionChange(sport, position)
                            }
                          />
                          <Label
                            htmlFor={`${sport}-${position}`}
                            className="text-sm text-gray-600"
                          >
                            {position}
                          </Label>
                        </div>
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
