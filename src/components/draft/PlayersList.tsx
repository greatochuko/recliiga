
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player, Team } from "./types";
import { PlayerRating } from "./DraftUIComponents";

interface PlayersListProps {
  availablePlayers: Player[];
  teams: Team[];
  currentTeam: number;
  isTeamSetupComplete: boolean;
  handlePlayerDraft: (playerId: number) => void;
}

export function PlayersList({
  availablePlayers,
  teams,
  currentTeam,
  isTeamSetupComplete,
  handlePlayerDraft
}: PlayersListProps) {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Available Players ({availablePlayers.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          {availablePlayers.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{player.name}</p>
                    <PlayerRating rating={player.rating} />
                  </div>
                  <p className="text-sm text-gray-500">{player.position}</p>
                </div>
              </div>
              <Button 
                onClick={() => handlePlayerDraft(player.id)}
                disabled={!isTeamSetupComplete}
                className="bg-black text-white hover:bg-gray-800"
              >
                Draft to {teams[currentTeam].name || `Team ${currentTeam + 1}`}
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
