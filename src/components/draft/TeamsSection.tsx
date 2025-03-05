
import { useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Team } from './types';
import { TeamColumn } from './TeamColumn';

interface TeamsSectionProps {
  teams: Team[];
  toggleEditMode: (teamId: number) => void;
  handleTeamNameChange: (teamId: number, name: string) => void;
  handleTeamColorChange: (teamId: number, color: string) => void;
}

export function TeamsSection({ 
  teams, 
  toggleEditMode, 
  handleTeamNameChange, 
  handleTeamColorChange 
}: TeamsSectionProps) {
  const teamColumnRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateTeamColumnHeight = () => {
      if (teamColumnRef.current) {
        // We're not setting state here anymore as we don't need to track the height globally
      }
    };

    updateTeamColumnHeight();
    window.addEventListener('resize', updateTeamColumnHeight);

    return () => {
      window.removeEventListener('resize', updateTeamColumnHeight);
    };
  }, []);

  return (
    <>
      {/* Team columns for larger screens */}
      <div className="hidden lg:block" ref={teamColumnRef}>
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

      {/* Tabs for team views on smaller screens */}
      <div className="lg:hidden mb-6">
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
}
