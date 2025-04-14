import React from "react";
import { TeamColumn } from "./TeamColumn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamType } from "@/types/events";

interface TeamsSectionProps {
  teams: TeamType[];
  toggleEditMode: (teamId: string) => void;
  handleTeamNameChange: (teamId: string, name: string) => void;
  handleTeamColorChange: (teamId: string, color: string) => void;
  teamEditing: string;
  cancelTeamEditing: () => void;
  refetchEvent: () => void;
}

export const TeamsSection: React.FC<TeamsSectionProps> = ({
  teams,
  toggleEditMode,
  handleTeamNameChange,
  handleTeamColorChange,
  teamEditing,
  cancelTeamEditing,
  refetchEvent,
}) => {
  return (
    <>
      {/* Desktop view (side by side) */}
      {teams.map((team, i) => (
        <div key={team.id} className="hidden flex-1 lg:block">
          <TeamColumn
            isEditingTeam={teamEditing === team.id}
            team={team}
            index={i}
            toggleEditMode={toggleEditMode}
            handleTeamNameChange={handleTeamNameChange}
            handleTeamColorChange={handleTeamColorChange}
            cancelTeamEditing={cancelTeamEditing}
            refetchEvent={refetchEvent}
          />
        </div>
      ))}

      {/* Mobile view (tabs) */}
      <div className="col-span-2 flex-1 lg:hidden">
        <Tabs defaultValue="team1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team1">Team 1</TabsTrigger>
            <TabsTrigger value="team2">Team 2</TabsTrigger>
          </TabsList>
          {teams.map((team, i) => (
            <TabsContent value={`team${i + 1}`} key={team.id}>
              <TeamColumn
                isEditingTeam={teamEditing === team.id}
                team={team}
                index={i}
                toggleEditMode={toggleEditMode}
                handleTeamNameChange={handleTeamNameChange}
                handleTeamColorChange={handleTeamColorChange}
                cancelTeamEditing={cancelTeamEditing}
                refetchEvent={refetchEvent}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};
