
export interface Event {
  id: string;
  date: string;
  time: string;
  location: string;
  league: string;
  leagueId?: string | number;
  team1?: TeamInfo;
  team2?: TeamInfo;
  rsvpDeadline?: Date;
  status?: string;
  spotsLeft?: number;
  hasResults?: boolean;
  resultsEntered?: boolean;
}

export interface TeamInfo {
  name: string;
  avatar: string;
  color: string;
}

export interface Captain {
  name: string;
  avatar: string;
  position: string;
}

export interface Team {
  name: string;
  avatar: string;
  color: string;
  captain: Captain;
  players: Player[];
}

export interface TeamData {
  team1: Team;
  team2: Team;
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  position: string;
}
