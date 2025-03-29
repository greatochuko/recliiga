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
  startHour: string;
  startMinute: string;
  startAmPm: string;
  endHour: string;
  endMinute: string;
  endAmPm: string;
}

export interface EventType {
  id: string;
  leagueId: string;
  title: string;
  location: string;
  numTeams: number;
  rosterSpots: number;
  isRepeatingEvent: boolean;
  repeatFrequency?: string;
  repeatStartDate?: Date;
  repeatEndDate?: Date;
  rsvpDeadline: string;
  customRsvpHours: number;
  eventDates: EventDateType[];
}
