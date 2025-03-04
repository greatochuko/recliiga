
export interface Player {
  id: number;
  name: string;
  avatar: string;
  position: string;
}

export interface PlayerProfileData {
  id: string;
  full_name: string;
  email?: string;
  city?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
}

export interface PlayerFormData {
  full_name: string;
  email: string;
  city: string;
  phone: string;
  avatar_url?: string;
}

export interface PlayerRankData {
  name: string;
  playerName: string;
  rank: number;
  totalPlayers: number;
  rating: number;
}

export interface PlayerStats {
  name: string;
  position: number;
  totalTeams: number;
  league: string;
  points: number;
  wins: number;
  losses: number;
  ties: number;
  record: {
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
}
