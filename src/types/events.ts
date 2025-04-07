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
  title: string;
  location: string;
  numTeams: number;
  rosterSpots: number;
  startDate: EventDateType;
  rsvpDeadline: number;
  teams: Team[];
  creatorId: string;
}
