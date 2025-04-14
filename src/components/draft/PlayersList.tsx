import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayerRating } from "./DraftUIComponents";
import { TeamType } from "@/types/events";
import { UserType } from "@/contexts/AuthContext";

interface PlayersListProps {
  availablePlayers: UserType[];
  teams: TeamType[];
  currentTeam: number;
  isTeamSetupComplete: boolean;
  handlePlayerDraft: (playerId: string) => void;
}

export const PlayersList: React.FC<PlayersListProps> = ({
  availablePlayers,
  teams,
  currentTeam,
  isTeamSetupComplete,
  handlePlayerDraft,
}) => {
  return (
    <Card className="flex h-full flex-1 flex-col">
      <CardHeader>
        <CardTitle>Available Players ({availablePlayers.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {availablePlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded p-2 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={player.avatar_url} alt={player.full_name} />
                  <AvatarFallback>
                    {player.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{player.full_name}</p>
                    <PlayerRating rating={3} />
                  </div>
                  <p className="text-sm text-gray-500">{player.positions[0]}</p>
                </div>
              </div>
              <Button
                onClick={() => handlePlayerDraft(player.id)}
                disabled={!isTeamSetupComplete}
                className="bg-black text-white hover:bg-gray-800"
              >
                Draft to {teams[currentTeam]?.name || `Team ${currentTeam + 1}`}
              </Button>
            </div>
          ))}
          {availablePlayers.length === 0 && (
            <div className="flex h-24 items-center justify-center text-gray-500">
              No players available
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
