export interface EventDate {
  date: Date | null;
  startHour: string;
  startMinute: string;
  startAmPm: string;
  endHour: string;
  endMinute: string;
  endAmPm: string;
}

export interface Event {
  title: string;
  location: string;
  numTeams: string;
  rosterSpots: string;
  rsvpDeadlineOption: string;
  customRsvpHours: string;
  eventDates: EventDate[];
}

export interface LeagueFormData {
  leagueName: string;
  sport: string;
  city: string;
  location: string;
  description: string;
  logo: File | null;
  events: Event[];
}
