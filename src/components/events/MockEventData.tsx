
import { Event } from '@/types/events';

export const upcomingEvents: Event[] = [
  {
    id: 1,
    leagueId: 1,
    date: '20-Aug-2025',
    time: '6:00 PM',
    location: 'Allianz Arena',
    team1: {
      name: 'Eagle Claws',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#272D31'
    },
    team2: {
      name: 'Ravens',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#FFC700'
    },
    rsvpDeadline: new Date('2025-08-19T18:00:00'),
    status: 'attending',
    league: 'Premier League',
    hasResults: false
  },
  {
    id: 2,
    leagueId: 1,
    date: '25-Aug-2025',
    time: '7:30 PM',
    location: 'Stamford Bridge',
    team1: {
      name: 'Blue Lions',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#034694'
    },
    team2: {
      name: 'Red Devils',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#DA291C'
    },
    rsvpDeadline: new Date(Date.now() - 86400000),
    status: null,
    spotsLeft: 2,
    league: 'Championship',
    hasResults: false,
    captains: {
      team1: {
        id: '1',
        name: 'John Smith',
        avatar: '/placeholder.svg?height=32&width=32'
      },
      team2: {
        id: '2',
        name: 'Alex Johnson',
        avatar: '/placeholder.svg?height=32&width=32'
      }
    },
    draftStatus: 'not_started'
  },
  {
    id: 3,
    leagueId: 2,
    date: '01-Sep-2025',
    time: '5:00 PM',
    location: 'Camp Nou',
    team1: {
      name: 'Catalonia FC',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#A50044'
    },
    team2: {
      name: 'White Angels',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#FFFFFF'
    },
    rsvpDeadline: new Date(Date.now() - 43200000),
    status: null,
    spotsLeft: 1,
    league: 'La Liga',
    hasResults: false
  }
];

export const pastEvents: Event[] = [
  {
    id: 4,
    leagueId: 1,
    date: '15-Jul-2025',
    time: '8:00 PM',
    location: 'Old Trafford',
    team1: {
      name: 'Red Devils',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#DA291C'
    },
    team2: {
      name: 'Sky Blues',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#6CABDD'
    },
    status: 'past',
    league: 'Premier League',
    hasResults: true
  },
  {
    id: 5,
    leagueId: 1,
    date: '10-Jul-2025',
    time: '7:00 PM',
    location: 'Anfield',
    team1: {
      name: 'The Reds',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#C8102E'
    },
    team2: {
      name: 'Spurs',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#132257'
    },
    status: 'past',
    league: 'Premier League',
    hasResults: true
  },
  {
    id: 6,
    leagueId: 1,
    date: '05-Jul-2025',
    time: '6:30 PM',
    location: 'Emirates Stadium',
    team1: {
      name: 'Gunners',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#EF0107'
    },
    team2: {
      name: 'Hammers',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#7A263A'
    },
    status: 'past',
    league: 'Premier League',
    hasResults: true
  }
];
