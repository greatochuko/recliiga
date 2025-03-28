import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { EventType } from "@/types/events";

interface EventHeaderProps {
  event: EventType;
  attendanceStatus: "attending" | "declined" | null;
  isEditing: boolean;
  isPastEvent?: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  attendanceStatus,
  isEditing,
  isPastEvent = false,
}) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-xs text-gray-500 mr-4">{event.date}</span>
        <span className="text-xs text-gray-500 mr-4">{event.time}</span>
        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-xs text-gray-500">{event.location}</span>
      </div>
      {attendanceStatus === "attending" && !isEditing && (
        <Badge
          variant="secondary"
          className="bg-[#FF7A00] bg-opacity-20 text-[#FF7A00] text-xs"
        >
          Attending
        </Badge>
      )}
      {attendanceStatus === "declined" && !isEditing && (
        <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
          Declined
        </Badge>
      )}
      {!isPastEvent && event.spotsLeft && !attendanceStatus && (
        <span className="text-[#E43226] text-xs font-semibold">
          {event.spotsLeft === 1
            ? "1 Spot Left"
            : `${event.spotsLeft} Spots Left`}
        </span>
      )}
    </div>
  );
};
