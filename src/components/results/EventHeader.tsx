import { Calendar, MapPin } from "lucide-react";
import { Event } from "./types";

interface EventHeaderProps {
  event: Event;
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-1 flex items-center">
        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
        <span className="mr-2 text-xs text-gray-500">{event.date}</span>
        <span className="text-xs text-gray-500">{event.time}</span>
      </div>
      <div className="mb-1 flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
        <span className="text-xs text-gray-500">{event.location}</span>
      </div>
      <span className="text-accent-orange mb-2 text-xs font-bold">
        {event.league}
      </span>
      <span className="text-2xl font-bold">vs</span>
    </div>
  );
}
