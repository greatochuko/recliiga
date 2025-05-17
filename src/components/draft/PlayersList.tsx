import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayerRating } from "./DraftUIComponents";
import { EventType, TeamType } from "@/types/events";
import { useAuth, UserType } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getInitials, getUserRating } from "@/lib/utils";

interface PlayersListProps {
  availablePlayers: UserType[];
  currentTeam: TeamType;
  teams: TeamType[];
  handlePlayerDraft: (teamId: string, playerId: string) => void;
  isDrafting: boolean;
  event: EventType;
}

export const PlayersList: React.FC<PlayersListProps> = ({
  availablePlayers,
  currentTeam,
  teams,
  handlePlayerDraft,
  isDrafting,
  event,
}) => {
  const { user } = useAuth();

  return (
    <Card className="flex h-full flex-1 flex-col">
      <CardHeader>
        <CardTitle>Available Players ({availablePlayers.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {availablePlayers.map((player) => {
            const playerIsDrafted =
              teams.some((team) =>
                team.players.some((pl) => pl.id === player.id),
              ) || teams.some((team) => team.captainId === player.id);
            return (
              <div
                key={player.id}
                className="flex items-center justify-between rounded p-2 hover:bg-gray-100"
              >
                <Link
                  to={`/dashboard/profile/${player.id}`}
                  className="group flex items-center space-x-2"
                >
                  <Avatar>
                    <AvatarImage
                      src={player.avatar_url}
                      alt={player.full_name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getInitials(player.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium group-hover:text-accent-orange group-hover:underline">
                        {player.full_name}
                      </p>
                      <PlayerRating
                        rating={getUserRating(event.leagueId, player.ratings)}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      {player.positions[0]}
                    </p>
                  </div>
                </Link>
                <Button
                  onClick={() => handlePlayerDraft(currentTeam.id, player.id)}
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={
                    currentTeam.captainId !== user.id ||
                    playerIsDrafted ||
                    isDrafting
                  }
                >
                  {playerIsDrafted ? "Drafted" : `Draft to ${currentTeam.name}`}
                </Button>
              </div>
            );
          })}
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
