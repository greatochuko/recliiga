
import { Event, League } from '@/types/events';

// Mock data
const mockLeagues: League[] = [
  { id: 1, name: "Premier League" },
  { id: 2, name: "Championship" },
  { id: 3, name: "League One" },
];

const mockEvents: Event[] = [
  {
    id: 1,
    leagueId: 1,
    date: '20-Aug-2024',
    time: '6:00 PM',
    location: 'Allianz Arena',
    team1: { name: 'Eagle Claws', avatar: '/placeholder.svg?height=64&width=64', color: '#272D31' },
    team2: { name: 'Ravens', avatar: '/placeholder.svg?height=64&width=64', color: '#FFC700' },
    rsvpDeadline: new Date('2024-08-19T18:00:00'),
    status: 'upcoming',
    spotsLeft: 2
  },
  {
    id: 2,
    leagueId: 1,
    date: '25-Aug-2024',
    time: '7:30 PM',
    location: 'Stamford Bridge',
    team1: { name: 'Blue Lions', avatar: '/placeholder.svg?height=64&width=64', color: '#034694' },
    team2: { name: 'Red Devils', avatar: '/placeholder.svg?height=64&width=64', color: '#DA291C' },
    rsvpDeadline: new Date('2024-08-24T19:30:00'),
    status: 'upcoming',
    spotsLeft: 1
  },
  {
    id: 3,
    leagueId: 1,
    date: '15-Jul-2024',
    time: '8:00 PM',
    location: 'Old Trafford',
    team1: { name: 'Red Devils', avatar: '/placeholder.svg?height=64&width=64', color: '#DA291C' },
    team2: { name: 'Sky Blues', avatar: '/placeholder.svg?height=64&width=64', color: '#6CABDD' },
    status: 'past',
    resultsEntered: true
  },
  {
    id: 4,
    leagueId: 2,
    date: '10-Jul-2024',
    time: '7:00 PM',
    location: 'Anfield',
    team1: { name: 'The Reds', avatar: '/placeholder.svg?height=64&width=64', color: '#C8102E' },
    team2: { name: 'Spurs', avatar: '/placeholder.svg?height=64&width=64', color: '#132257' },
    status: 'past',
    resultsEntered: false
  },
];

// API functions
export const fetchEvents = async (): Promise<Event[]> => {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockEvents;
};

export const fetchLeagues = async (): Promise<League[]> => {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLeagues;
};
