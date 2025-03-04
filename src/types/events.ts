
export interface Team {
  name: string;
  avatar: string;
  color: string;
}

export interface Captain {
  id: string;
  name: string;
  avatar: string;
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
  status?: 'upcoming' | 'past' | 'attending' | 'declined';
  spotsLeft?: number;
  resultsEntered?: boolean;
  league?: string;
  hasResults?: boolean;
  captains?: {
    team1?: Captain;
    team2?: Captain;
  };
  draftStatus?: 'not_started' | 'in_progress' | 'completed';
}

export interface League {
  id: number;
  name: string;
}
