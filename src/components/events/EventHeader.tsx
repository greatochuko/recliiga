import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, ClockIcon, MapPin } from "lucide-react";
import { EventType } from "@/types/events";
import { format } from "date-fns";

interface EventHeaderProps {
  event: EventType;
  attendanceStatus: "attending" | "not-attending" | null;
  isPastEvent: boolean;
  spotsLeft: number;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  attendanceStatus,
  isPastEvent,
  spotsLeft,
}) => {
  const eventDate = new Date(event.startTime);

  const eventTime = format(event.startTime, "h:mm a");

  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center">
        <h3 className="mr-4 text-base font-medium">{event.title}</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center text-gray-500">
            <Calendar className="mr-1 h-4 w-4" />
            <span className="text-xs">{eventDate.toDateString()}</span>
          </div>
          <span className="flex items-center text-xs text-gray-500">
            <ClockIcon className="mr-1 h-4 w-4" />
            {eventTime}
          </span>
          <div className="flex items-center text-gray-500">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="text-xs">{event.location}</span>
          </div>
        </div>
      </div>
      {!isPastEvent &&
        (attendanceStatus === "attending" ? (
          <Badge
            variant="secondary"
            className="mt-2 hidden self-start bg-accent-orange bg-opacity-20 text-xs text-accent-orange sm:mt-0 sm:block sm:self-auto"
          >
            Attending
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="mt-2 hidden self-start text-xs text-red-600 sm:mt-0 sm:block sm:self-auto"
          >
            {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
          </Badge>
        ))}
    </div>
  );
};
