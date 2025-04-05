import { PlayerProfile } from "@/pages/PlayerRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle } from "lucide-react";

interface ConfirmationAndLeagueCodeProps {
  playerData: PlayerProfile;
}

export function ConfirmationAndLeagueCode({
  playerData,
}: ConfirmationAndLeagueCodeProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Confirmation & League Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h3 className="mb-2 text-xl font-semibold">
              Your Profile is Ready!
            </h3>
            <p className="mb-6 text-[#707B81]">
              You've successfully set up your Player Profile. Get ready for an
              exciting season!
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">
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
                  <ul className="list-inside list-disc pl-4">
                    {Object.entries(playerData.positions).map(
                      ([sport, sportPositions]) => (
                        <li key={sport}>
                          {sport}:{" "}
                          {sportPositions.length > 0
                            ? sportPositions.join(", ")
                            : "None selected"}
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <span>None selected</span>
                )}
              </div>
            </div>
          </div>

          <div className="my-6 border-t border-gray-200"></div>

          <div className="text-center">
            {/* Confirmation text removed as per previous instruction */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
