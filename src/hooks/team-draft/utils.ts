
import { Team, Player } from '@/components/draft/types';
import { toast } from "sonner";

export const createInitialTeams = (
  team1Name: string = '', 
  team1Color: string = '#FFFFFF',
  team2Name: string = '',
  team2Color: string = '#000000',
  team1Captain: string | null = null,
  team2Captain: string | null = null
): Team[] => {
  return [
    { 
      id: 1, 
      name: team1Name, 
      color: team1Color, 
      players: [], 
      isEditing: true, 
      captain: team1Captain 
    },
    { 
      id: 2, 
      name: team2Name, 
      color: team2Color, 
      players: [], 
      isEditing: true, 
      captain: team2Captain 
    },
  ];
};

export const getNextTeamInAlternatingDraft = (currentTeam: number, teamsLength: number): number => {
  return (currentTeam + 1) % teamsLength;
};

export const getNextTeamInSnakeDraft = (
  currentTeam: number, 
  totalPicks: number, 
  teamsLength: number
): {
  nextTeam: number;
  newRound: number;
} => {
  const newTotalPicks = totalPicks + 1;
  const newRound = Math.floor(newTotalPicks / teamsLength) + 1;
  
  let nextTeam = currentTeam;
  if (newRound % 2 === 0) {
    if (newTotalPicks % 2 === 1) {
      nextTeam = (currentTeam + 1) % teamsLength;
    }
  } else {
    nextTeam = (currentTeam + 1) % teamsLength;
  }
  
  return { nextTeam, newRound };
};

export const getPreviousTeamInAlternatingDraft = (currentTeam: number, teamsLength: number): number => {
  return (currentTeam - 1 + teamsLength) % teamsLength;
};

export const getPreviousTeamInSnakeDraft = (
  currentTeam: number, 
  totalPicks: number, 
  teamsLength: number
): {
  previousTeam: number;
  newRound: number;
} => {
  const newTotalPicks = totalPicks - 1;
  const newRound = Math.floor(newTotalPicks / teamsLength) + 1;
  
  let previousTeam = currentTeam;
  if (newRound % 2 === 0) {
    if (newTotalPicks % 2 === 0) {
      previousTeam = (currentTeam - 1 + teamsLength) % teamsLength;
    }
  } else {
    previousTeam = (currentTeam - 1 + teamsLength) % teamsLength;
  }
  
  return { previousTeam, newRound };
};

export const validateTeamColorChange = (teams: Team[], teamId: number, color: string): boolean => {
  if (teams.some(t => t.id !== teamId && t.color === color)) {
    toast.error("This color has already been selected by another team.");
    return false;
  }
  return true;
};

export const isTeamSetupComplete = (teams: Team[]): boolean => {
  return teams.every(team => team.name && team.color);
};

export const filterAvailablePlayers = (
  attendingPlayers: Player[], 
  draftedPlayerIds: Set<string | number>,
  captainIds: (string | number)[]
): Player[] => {
  return attendingPlayers.filter(player => 
    !draftedPlayerIds.has(player.id) && !captainIds.includes(player.id)
  );
};
