
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { PlayerStats } from "./PlayerStats";

const mockPlayerData = {
  fullName: "John Doe",
  position: "Forward",
  league: {
    name: "Downtown Basketball League",
    sport: "Basketball",
    location: "City Sports Center",
    teamName: "Thunder",
    nextGame: "2024-03-15T18:00:00Z"
  },
  stats: {
    points: 86,
    wins: 7,
    losses: 2,
    ties: 1
  }
};

export function HomeScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Player Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Player Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#FF7A00]">
                  {mockPlayerData.fullName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{mockPlayerData.fullName}</h3>
                <p className="text-sm text-gray-500">{mockPlayerData.position}</p>
                <div className="mt-2">
                  <StarRating rating={2} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* League Info Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Current League</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{mockPlayerData.league.name}</h3>
                <p className="text-sm text-gray-500">{mockPlayerData.league.sport}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Team</p>
                  <p className="font-medium">{mockPlayerData.league.teamName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{mockPlayerData.league.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Stats */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle>Season Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerStats 
              stats={mockPlayerData.stats}
              userName={mockPlayerData.fullName}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
