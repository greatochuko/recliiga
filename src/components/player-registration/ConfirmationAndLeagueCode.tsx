import { PlayerProfile } from "@/pages/PlayerRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CheckCircle } from "lucide-react";

interface ConfirmationAndLeagueCodeProps {
  playerData: PlayerProfile;
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
}

export function ConfirmationAndLeagueCode({
  playerData,
  updatePlayerData,
}: ConfirmationAndLeagueCodeProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Confirmation & League Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Your Profile is Ready!
            </h3>
            <p className="text-[#707B81] mb-6">
              You've successfully set up your Player Profile. Get ready for an
              exciting season!
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Confirm Your Information
            </h3>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Nickname:</span>{" "}
                {playerData?.nickname || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span>{" "}
                {playerData?.dateOfBirth
                  ? playerData.dateOfBirth.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Not provided"}
              </div>
              <div>
                <span className="font-medium">City:</span>{" "}
                {playerData?.city || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Sports:</span>{" "}
                {playerData?.sports?.length > 0
                  ? playerData.sports.join(", ")
                  : "None selected"}
              </div>
              <div>
                <span className="font-medium">Positions:</span>
                {playerData?.positions &&
                Object.keys(playerData.positions).length > 0 ? (
                  <ul className="list-disc list-inside pl-4">
                    {Object.entries(playerData.positions).map(
                      ([sport, sportPositions]) => (
                        <li key={sport}>
                          {sport}:{" "}
                          {sportPositions.length > 0
                            ? sportPositions.join(", ")
                            : "None selected"}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <span>None selected</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div>
            <Label htmlFor="leagueCode" className="text-sm text-gray-700">
              League Code
            </Label>
            <Input
              id="leagueCode"
              value={playerData?.leagueCode || ""}
              onChange={(e) => updatePlayerData({ leagueCode: e.target.value })}
              placeholder="Enter league code"
              className="mt-1"
            />
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div className="text-center">
            {/* Confirmation text removed as per previous instruction */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
