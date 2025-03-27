import { UserType } from "@/contexts/AuthContext";

export type League = {
  id: string;
  name: string;
  sport: string;
  is_private: boolean;
  city: string;
  location: string;
  description: string | null;
  logo_url: string | null;
  owner_id: string;
};

export type LeagueStatType = {
  name: string;
  abbr: string;
  isEditing: boolean;
  points: number;
};

export type LeagueType = {
  id: string;
  name: string;
  sport: string;
  is_private: boolean;
  leagueCode: string;
  players: UserType[];
  date: string;
  owner_id: string;
  image?: string;
  city: string;
  stats: LeagueStatType[];
};
