import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { EventType } from "@/types/events";
import { attendEvent, declineEvent } from "@/api/events";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAttend = async () => {
    setLoading(true);
    const { error } = await attendEvent(event.id);
    if (error === null) {
      setAttendanceStatus("attending");
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDecline = async () => {
    setLoading(true);
    const { error } = await declineEvent(event.id);
    if (error === null) {
      setAttendanceStatus("not-attending");
      setIsEditing(false);
    }
    setLoading(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Link
        to={
          event.resultsEntered
            ? `/events/${event.id}/results`
            : `/events/${event.id}`
        }
        className="rounded-md border border-accent-orange bg-white px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange hover:text-white"
      >
        {event.resultsEntered ? "View Results" : "View Details"}
      </Link>
      {!isPastEvent && isRsvpOpen && (
        <div className="flex justify-center space-x-2">
          {(isEditing || !attendanceStatus) && (
            <>
              <button
                className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
                onClick={handleAttend}
                disabled={loading || attendanceStatus === "attending"}
              >
                Attend
              </button>
              <button
                className="rounded-md border bg-white px-4 py-2 text-sm font-medium duration-200 hover:bg-neutral-100"
                onClick={() => setIsEditing(false)}
                disabled={loading || attendanceStatus === "not-attending"}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
                onClick={handleDecline}
                disabled={loading || attendanceStatus === "not-attending"}
              >
                Decline
              </button>
            </>
          )}
          {attendanceStatus && !isEditing && (
            <button
              className="flex items-center gap-2 rounded-md border border-accent-orange px-4 py-2 text-sm font-medium text-accent-orange transition-colors hover:bg-accent-orange hover:text-white"
              onClick={toggleEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit RSVP
            </button>
          )}
        </div>
      )}
      {event.teams.some((team) => team.captain?.id === user.id) && (
        <div className="flex w-full justify-end">
          <Link
            to={`/events/${event.id}/team-draft`}
            className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90"
          >
            Begin Draft
          </Link>
        </div>
      )}
    </div>
  );
};
