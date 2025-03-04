
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2 } from "lucide-react";
import { Team } from "./types";
import { JerseyIcon, PlayerRating, colorOptions } from "./DraftUIComponents";
import { TeamSetupForm } from "./TeamSetupForm";

interface TeamColumnProps {
  team: Team;
  index: number;
  toggleEditMode: (teamId: number) => void;
  handleTeamNameChange: (teamId: number, name: string) => void;
  handleTeamColorChange: (teamId: number, color: string) => void;
}

export function TeamColumn({
  team,
  index,
  toggleEditMode,
  handleTeamNameChange,
  handleTeamColorChange
}: TeamColumnProps) {
  return (
    <Card key={team.id} className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span>Team {index + 1}: {team.name}</span>
              <JerseyIcon color={team.color} size={24} />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={team.players[0]?.avatar} alt={team.captain || ''} />
                <AvatarFallback>{team.captain?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Captain: {team.captain}</span>
            </div>
          </div>
          {!team.isEditing && (
            <Button variant="ghost" size="sm" onClick={() => toggleEditMode(team.id)}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit team</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {team.isEditing ? (
          <TeamSetupForm 
            team={team}
            teamId={team.id}
            handleTeamNameChange={handleTeamNameChange}
            handleTeamColorChange={handleTeamColorChange}
            toggleEditMode={toggleEditMode}
          />
        ) : (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span><strong>Team {index + 1}: {team.name}</strong></span>
              <JerseyIcon color={team.color} size={24} />
            </div>
            <p><strong>Team Color:</strong> {colorOptions.find(c => c.value === team.color)?.name}</p>
          </div>
        )}
        <div className="mt-4 h-[calc(100%-200px)]">
          <Label>Drafted Players ({team.players.length})</Label>
          <ScrollArea className="h-full w-full border rounded-md p-2">
            {team.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-gray-500">{player.position}</p>
                  </div>
                </div>
                <PlayerRating rating={player.rating} />
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
