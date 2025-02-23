
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayerStats } from "@/components/dashboard/PlayerStats";
import { TeamRatings } from "@/components/dashboard/TeamRatings";
import { UpcomingEvents } from "@/components/dashboard/Events";
import { League, PlayerStats as PlayerStatsType, Event } from "@/types/dashboard";

interface DashboardContentProps {
  userLeagues: League[];
  selectedLeagueId: string | null;
  setSelectedLeagueId: (id: string) => void;
  playerStats: PlayerStatsType | undefined;
  upcomingEvents: Event[] | undefined;
  userName: string;
  userRole: string;
  onCreateLeague: () => void;
}

export function DashboardContent({
  userLeagues,
  selectedLeagueId,
  setSelectedLeagueId,
  playerStats,
  upcomingEvents,
  userName,
  userRole,
  onCreateLeague
}: DashboardContentProps) {
  if (!userLeagues?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">You haven't joined any leagues yet.</p>
        {userRole === 'player' ? (
          <p className="text-gray-500 mt-2">Join a league to get started!</p>
        ) : (
          <Button 
            onClick={onCreateLeague} 
            className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white mt-4"
          >
            Create New League
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Stats</h2>
            <Select value={selectedLeagueId || ''} onValueChange={setSelectedLeagueId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select League" />
              </SelectTrigger>
              <SelectContent>
                {userLeagues.map(league => (
                  <SelectItem key={league.id} value={league.id}>
                    {league.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {playerStats && (
            <PlayerStats 
              stats={playerStats} 
              userName={userName} 
            />
          )}
        </div>
        <TeamRatings />
      </div>
      {upcomingEvents && <UpcomingEvents events={upcomingEvents} />}
    </div>
  );
}
