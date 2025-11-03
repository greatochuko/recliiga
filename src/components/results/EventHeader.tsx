import { EventType } from "@/types/events";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface EventHeaderProps {
  event: EventType;
  type: "small" | "large";
}

export function EventHeader({ event, type }: EventHeaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${type === "small" ? "min-[900px]:hidden" : "hidden min-[900px]:flex"}`}
    >
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-xs text-gray-500">
          {format(new Date(event.startTime), "MMM d, yyyy")}
        </span>
        <span className="text-xs text-gray-500">
          {format(new Date(event.startTime), "h:mm aa")}
        </span>
      </div>
      <div className="flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
        <span className="text-xs text-gray-500">{event.location}</span>
      </div>
      <Link
        to={`/dashboard/leagues/${event.league.id}`}
        className="text-xs font-bold text-accent-orange hover:underline"
      >
        {event.league.name}
      </Link>
    </div>
  );
}
