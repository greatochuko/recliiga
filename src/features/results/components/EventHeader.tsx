
import { Calendar, MapPin } from 'lucide-react'

interface Event {
  date: string
  time: string
  location: string
  league: string
}

interface EventHeaderProps {
  event: Event
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center mb-1">
        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-xs text-gray-500 mr-2">{event.date}</span>
        <span className="text-xs text-gray-500">{event.time}</span>
      </div>
      <div className="flex items-center mb-1">
        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-xs text-gray-500">{event.location}</span>
      </div>
      <span className="text-xs font-bold text-[#FF7A00] mb-2">{event.league}</span>
      <span className="text-2xl font-bold">vs</span>
    </div>
  )
}
