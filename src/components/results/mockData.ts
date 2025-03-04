
import { TeamData, Event } from './types'

export const mockTeamData: TeamData = {
  team1: {
    name: 'Red Devils',
    avatar: '/placeholder.svg?height=64&width=64',
    color: '#DA291C',
    captain: {
      name: 'John Smith',
      avatar: '/placeholder.svg?height=48&width=48',
      position: 'Captain'
    },
    players: [
      { id: 1, name: 'Alex Johnson', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
      { id: 2, name: 'Sam Williams', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender' },
      { id: 3, name: 'Chris Brown', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward' },
      { id: 4, name: 'Pat Taylor', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper' }
    ]
  },
  team2: {
    name: 'Sky Blues',
    avatar: '/placeholder.svg?height=64&width=64',
    color: '#6CABDD',
    captain: {
      name: 'Mike Davis',
      avatar: '/placeholder.svg?height=48&width=48',
      position: 'Captain'
    },
    players: [
      { id: 5, name: 'Tom Wilson', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender' },
      { id: 6, name: 'Jamie Lee', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
      { id: 7, name: 'Casey Morgan', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward' },
      { id: 8, name: 'Jordan Riley', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper' }
    ]
  }
}

export const mockEvent: Event = {
  date: '15-Jul-2024',
  time: '8:00 PM',
  location: 'Old Trafford',
  league: 'Premier League'
}
