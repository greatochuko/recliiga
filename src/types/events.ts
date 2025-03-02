
export interface Team {
  name: string;
  avatar: string;
  color: string;
}

export interface Event {
  id: number;
  leagueId: number;
  date: string;
  time: string;
  location: string;
  team1: Team;
  team2: Team;
  rsvpDeadline?: Date;
  status?: 'upcoming' | 'past';
  spotsLeft?: number;
  resultsEntered?: boolean;
}

export interface League {
  id: number;
  name: string;
}
