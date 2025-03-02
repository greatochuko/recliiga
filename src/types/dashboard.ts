
export interface PlayerStats {
  wins: number;
  losses: number;
  ties: number;
  points: number;
  league?: {
    name: string;
  };
  name?: string;
  position?: number;
  totalTeams?: number;
  record?: {
    wins: number;
    losses: number;
    ties: number;
  };
}

export interface League {
  id: string;
  name: string;
  sport?: string;
  city?: string;
  location?: string;
  description?: string | null;
  logo_url?: string | null;
  is_private?: boolean;
  requires_approval?: boolean;
  league_code?: string | null;
  member_count?: number;
  created_at?: string;
  start_date?: string;
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
  status: string | null;
  league: string;
  hasResults: boolean;
  spotsLeft?: number;
  rsvp_deadline?: Date;
}

export interface Teammate {
  id: string;
  name: string;
  position: string;
  rating: number;
  avatarUrl: string;
}
