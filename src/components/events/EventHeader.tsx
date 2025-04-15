import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { EventType } from "@/types/events";
import { format } from "date-fns";

interface EventHeaderProps {
  event: EventType;
  attendanceStatus: "attending" | "not-attending" | null;
  isEditing: boolean;
  isPastEvent?: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  attendanceStatus,
  isEditing,
  isPastEvent = false,
}) => {
  const spotsLeft = event.numTeams * event.rosterSpots - event.players.length;
  const eventDate = new Date(event.startTime);

  const eventTime = format(event.startTime, "h:mm a");

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
      {attendanceStatus === "attending" && !isEditing && (
        <Badge
          variant="secondary"
          className="bg-accent-orange bg-opacity-20 text-xs text-accent-orange"
        >
          Attending
        </Badge>
      )}
      {attendanceStatus === "not-attending" && !isEditing && (
        <Badge variant="secondary" className="bg-red-100 text-xs text-red-600">
          Not Attending
        </Badge>
      )}
      {!isPastEvent && !attendanceStatus && (
        <span className="text-xs font-semibold text-[#E43226]">
          {!spotsLeft
            ? "No Spots left"
            : spotsLeft === 1
              ? "1 Spot Left"
              : `${spotsLeft} Spots Left`}
        </span>
      )}
    </div>
  );
};
