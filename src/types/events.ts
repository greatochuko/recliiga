export interface Team {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface Captain {
  id: string;
  name: string;
  avatar: string;
}

export interface EventType {
  id: number;
  leagueId: number;
  date: string;
  time: string;
  location: string;
  team1: Team;
  team2: Team;
  rsvpDeadline?: Date;
  status?: "upcoming" | "past" | "attending" | "declined";
  spotsLeft?: number;
  resultsEntered?: boolean;
  league?: string;
  hasResults?: boolean;
  captains?: {
    [key: string]: Captain | undefined;
    team1?: Captain;
    team2?: Captain;
  };
  draftStatus?: "not_started" | "in_progress" | "completed";
}
