
export interface Team {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface League {
  id: string;
  name: string;
  rating?: number;
}

export interface Event {
  id: string | number;
  date: string;
  time: string;
  location: string;
  team1: {
    name: string;
    avatar: string;
    color: string;
  };
  team2: {
    name: string;
    avatar: string;
    color: string;
  };
  rsvpDeadline?: Date;
  rsvp_deadline?: Date; // For backward compatibility
  status: string | null;
  league: string | { name: string; id?: string };
  hasResults: boolean;
  spotsLeft?: number;
}

export interface PlayerStats {
  name: string;
  position: number;
  totalTeams: number;
  league: string | { name: string; id?: string };
  points: number;
  wins: number;
  losses: number;
  ties: number;
  record?: {
    wins: number;
    losses: number;
    ties: number;
  };
}

export interface Teammate {
  id: string;
  name: string;
  position: string;
  rating: number;
  avatarUrl?: string;
}
