import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { EventType } from "@/types/events";
import { format } from "date-fns";

interface EventHeaderProps {
  event: EventType;
  attendanceStatus: "attending" | "not-attending" | null;
  isPastEvent: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  attendanceStatus,
  isPastEvent,
}) => {
  const eventDate = new Date(event.startTime);

  const eventTime = format(event.startTime, "h:mm a");

  const spotsLeft = event.numTeams * event.rosterSpots - event.players.length;

  return (
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-center">
        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
        <span className="mr-2 text-xs text-gray-500">
          {eventDate.toDateString()}
        </span>
        <span className="mr-6 text-xs text-gray-500">{eventTime}</span>
        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
        <span className="text-xs text-gray-500">{event.location}</span>
      </div>
      {!isPastEvent &&
        (attendanceStatus === "attending" ? (
          <Badge
            variant="secondary"
            className="bg-accent-orange bg-opacity-20 text-xs text-accent-orange"
          >
            Attending
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs text-red-600">
            {spotsLeft} spots left
          </Badge>
        ))}
    </div>
  );
};
