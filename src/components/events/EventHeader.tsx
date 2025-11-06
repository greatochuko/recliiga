import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, ClockIcon, MapPin } from "lucide-react";
import { EventType } from "@/types/events";
import { format } from "date-fns";

interface EventHeaderProps {
  event: EventType;
  attendanceStatus: "attending" | "not-attending" | "neutral" | null;
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
    <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
      <div className="flex w-full flex-col flex-wrap gap-x-4 gap-y-2 sm:flex-row">
        <div className="flex justify-between gap-4">
          <h3 className="text-base font-medium">{event.title}</h3>
          <span className="mt-1 whitespace-nowrap text-xs font-bold text-accent-orange sm:hidden">
            {event.league.name}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-2 text-gray-500 sm:gap-x-4">
          <div className="flex items-center text-xs">
            <Calendar className="mr-1 h-4 w-4" />
            {eventDate.toDateString()}
          </div>
          <div className="flex items-center text-xs">
            <ClockIcon className="mr-1 h-4 w-4" />
            {eventTime}
          </div>
          <div className="flex items-center text-xs">
            <MapPin className="mr-1 h-4 w-4" />
            {event.location}
          </div>
        </div>
      </div>

      {!isPastEvent &&
        (attendanceStatus === "attending" ? (
          <Badge
            variant="secondary"
            className="mt-2 hidden whitespace-nowrap bg-accent-orange bg-opacity-20 text-xs text-accent-orange sm:mt-0 sm:block"
          >
            Attending
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="mt-2 hidden whitespace-nowrap text-xs text-red-600 sm:mt-0 sm:block"
          >
            {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
          </Badge>
        ))}
    </div>
  );
};
