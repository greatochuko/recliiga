import { UserType } from "@/contexts/AuthContext";
import { LeagueType } from "./league";

export interface TeamType {
  id: string;
  name: string;
  logo: string;
  color: string;
  captain: UserType;
}

export interface Captain {
  id: string;
  name: string;
  avatar: string;
}

export interface EventDateType {
  date: Date | undefined;
  startHour: number;
  startMinute: number;
  startAmPm: string;
  endHour: number;
  endMinute: number;
  endAmPm: string;
}

export interface EventType {
  id: string;
  leagueId: string;
  league: LeagueType;
  title: string;
  location: string;
  numTeams: number;
  rosterSpots: number;
  startDate: EventDateType;
  rsvpDeadline: number;
  teams: TeamType[];
  creatorId: string;
  resultsEntered: boolean;
  players: UserType[];
}
