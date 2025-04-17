import { UserType } from "@/contexts/AuthContext";
import { EventType, ResultType } from "./events";

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
  name:
    | "Win"
    | "Loss"
    | "Tie"
    | "Captain Win"
    | "Attendance"
    | "Non-Attendance";
  abbr: string;
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
  events: EventType[];
  results: ResultType[];
};
