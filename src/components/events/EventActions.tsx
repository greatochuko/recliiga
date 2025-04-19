import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { EventType } from "@/types/events";
import { attendEvent, declineEvent } from "@/api/events";
import { useAuth } from "@/contexts/AuthContext";
import CountdownClock from "./CountdownClock";

interface EventActionsProps {
  event: EventType;
  isPastEvent?: boolean;
  attendanceStatus: "attending" | "not-attending" | null;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  setAttendanceStatus: (status: "attending" | "not-attending" | null) => void;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  isPastEvent = false,
  attendanceStatus,
  isEditing,
  setIsEditing,
  setAttendanceStatus,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const spotsRemaining =
    event.numTeams * event.rosterSpots - event.players.length;
  const isCaptain = event.teams.some((team) => team.captain?.id === user.id);
  const isPlayer = event.teams.some((team) =>
    team.players?.some((player) => player.id === user.id),
  );

  const rsvpDeadline = useMemo(() => {
    const startTime = new Date(event.startTime);
    return new Date(startTime.getTime() - event.rsvpDeadline * 60 * 60 * 1000);
  }, [event.startTime, event.rsvpDeadline]);

  const isRsvpOpen = new Date() < rsvpDeadline;

  const handleRSVP = async (type: "attending" | "not-attending") => {
    setLoading(true);
    const response =
      type === "attending"
        ? await attendEvent(event.id)
        : await declineEvent(event.id);

    if (!response.error) {
      setAttendanceStatus(type);
      setIsEditing(false);
    }
    setLoading(false);
  };

  const renderRSVPButtons = () => (
    <>
      <button
        className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
        onClick={() => handleRSVP("attending")}
        disabled={loading || attendanceStatus === "attending"}
      >
        Attend
      </button>
      <button
        className="rounded-md border bg-white px-4 py-2 text-sm font-medium duration-200 hover:bg-neutral-100"
        onClick={() => setIsEditing(false)}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
        onClick={() => handleRSVP("not-attending")}
        disabled={
          isCaptain ||
          isPlayer ||
          loading ||
          attendanceStatus === "not-attending"
        }
      >
        Decline
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Link
        to={`/events/${event.id}/${event.resultsEntered ? "results" : ""}`}
        className="rounded-md border border-accent-orange bg-white px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange hover:text-white"
      >
        {event.resultsEntered ? "View Results" : "View Details"}
      </Link>

      {!isPastEvent && isRsvpOpen && (
        <div className="flex justify-center space-x-2">
          {(isEditing || !attendanceStatus) && renderRSVPButtons()}
          {attendanceStatus &&
            !isEditing &&
            (spotsRemaining <= 0 ? (
              <p className="text-sm text-red-500">No spots remaining</p>
            ) : (
              <button
                className="flex items-center gap-2 rounded-md border border-accent-orange px-4 py-2 text-sm font-medium text-accent-orange transition-colors hover:bg-accent-orange hover:text-white disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
                Edit RSVP
              </button>
            ))}
        </div>
      )}

      <div className="flex w-full justify-end">
        {!isPastEvent &&
          (isRsvpOpen ? (
            <CountdownClock deadline={rsvpDeadline} size="sm" />
          ) : (
            <Link
              to={`/events/${event.id}/team-draft`}
              className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90"
            >
              {event.teams.some((team) => team.players.length > 0)
                ? "Continue"
                : "Begin"}{" "}
              Draft
            </Link>
          ))}
      </div>
    </div>
  );
};
