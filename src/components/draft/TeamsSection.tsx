
import React from 'react';
import { TeamColumn } from './TeamColumn';
import { Team } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamsSectionProps {
  teams: Team[];
  toggleEditMode: (teamId: number) => void;
  handleTeamNameChange: (teamId: number, name: string) => void;
  handleTeamColorChange: (teamId: number, color: string) => void;
}

export const TeamsSection: React.FC<TeamsSectionProps> = ({
  teams,
  toggleEditMode,
  handleTeamNameChange,
  handleTeamColorChange,
}) => {
  return (
    <>
      {/* Desktop view (side by side) */}
      <div className="hidden lg:block">
        <TeamColumn
          team={teams[0]}
          index={0}
          toggleEditMode={toggleEditMode}
          handleTeamNameChange={handleTeamNameChange}
          handleTeamColorChange={handleTeamColorChange}
        />
      </div>
      <div className="hidden lg:block">
        <TeamColumn
          team={teams[1]}
          index={1}
          toggleEditMode={toggleEditMode}
          handleTeamNameChange={handleTeamNameChange}
          handleTeamColorChange={handleTeamColorChange}
        />
      </div>

      {/* Mobile view (tabs) */}
      <div className="lg:hidden col-span-2">
        <Tabs defaultValue="team1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team1">Team 1</TabsTrigger>
            <TabsTrigger value="team2">Team 2</TabsTrigger>
          </TabsList>
          <TabsContent value="team1">
            <TeamColumn
              team={teams[0]}
              index={0}
              toggleEditMode={toggleEditMode}
              handleTeamNameChange={handleTeamNameChange}
              handleTeamColorChange={handleTeamColorChange}
            />
          </TabsContent>
          <TabsContent value="team2">
            <TeamColumn
              team={teams[1]}
              index={1}
              toggleEditMode={toggleEditMode}
              handleTeamNameChange={handleTeamNameChange}
              handleTeamColorChange={handleTeamColorChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
