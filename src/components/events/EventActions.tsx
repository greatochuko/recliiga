import React from "react";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { EventType } from "@/types/events";

interface EventActionsProps {
  event: EventType;
  isPastEvent?: boolean;
  attendanceStatus: "attending" | "not-attending" | null;
  isRsvpOpen: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setAttendanceStatus: (status: "attending" | "not-attending" | null) => void;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  isPastEvent = false,
  attendanceStatus,
  isRsvpOpen,
  isEditing,
  setIsEditing,
  setAttendanceStatus,
}) => {
  const handleAttend = () => {
    setAttendanceStatus("attending");
    setIsEditing(false);
  };

  const handleDecline = () => {
    setAttendanceStatus("not-attending");
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <div className="mt-2 flex justify-center space-x-2">
        <Link
          to={
            event.resultsEntered
              ? `/events/${event.id}/results`
              : `/events/${event.id}`
          }
          className="hover:bg-accent-orange text-accent-orange border-accent-orange rounded-md border bg-white px-4 py-2 text-sm font-medium duration-200 hover:text-white"
        >
          {event.resultsEntered ? "View Results" : "View Details"}
        </Link>
      </div>
      {!isPastEvent && isRsvpOpen && (
        <div className="mt-2 flex justify-center space-x-2">
          {(isEditing || !attendanceStatus) && (
            <>
              <button
                className="bg-accent-orange hover:bg-accent-orange/90 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                onClick={handleAttend}
              >
                Attend
              </button>
              <button
                className="bg-accent-orange hover:bg-accent-orange/90 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                onClick={handleDecline}
              >
                Decline
              </button>
            </>
          )}
          {attendanceStatus && !isEditing && (
            <button
              className="text-accent-orange border-accent-orange hover:bg-accent-orange flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:text-white"
              onClick={toggleEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit RSVP
            </button>
          )}
        </div>
      )}
    </>
  );
};
