import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Team } from "./types";
import { JerseyIcon, colorOptions } from "./DraftUIComponents";

interface TeamSetupFormProps {
  team: Team;
  teamId: number;
  handleTeamNameChange: (teamId: number, name: string) => void;
  handleTeamColorChange: (teamId: number, color: string) => void;
  toggleEditMode: (teamId: number) => void;
}

export function TeamSetupForm({
  team,
  teamId,
  handleTeamNameChange,
  handleTeamColorChange,
  toggleEditMode,
}: TeamSetupFormProps) {
  return (
    <>
      <div>
        <Label htmlFor={`team-name-${teamId}`}>Team Name</Label>
        <Input
          id={`team-name-${teamId}`}
          value={team.name}
          onChange={(e) => handleTeamNameChange(teamId, e.target.value)}
          placeholder="Enter team name"
        />
      </div>
      <div>
        <Label>Team Color</Label>
        <div className="mt-2 flex items-center space-x-4">
          <div className="flex-shrink-0">
            <JerseyIcon color={team.color} size={64} />
          </div>
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`focus:ring-accent-orange h-8 w-8 rounded-full border-2 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 ${team.color === color.value ? "ring-accent-orange ring-2 ring-offset-2" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleTeamColorChange(teamId, color.value)}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      </div>
      {team.name && team.color && (
        <Button onClick={() => toggleEditMode(teamId)}>
          Confirm Team Setup
        </Button>
      )}
    </>
  );
}
