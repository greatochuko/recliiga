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
  const isCaptain = event.teams.some((team) => team.captainId === user.id);
  const isPlayer = event.teams.some((team) =>
    team.players?.some((p) => p.id === user.id),
  );

  const teamCaptained = event.teams.find((team) => team.captainId === user.id);

  const rsvpDeadline = useMemo(() => {
    const start = new Date(event.startTime);
    return new Date(start.getTime() - event.rsvpDeadline * 60 * 60 * 1000);
  }, [event.startTime, event.rsvpDeadline]);

  const isRsvpOpen = new Date() < rsvpDeadline;

  const handleRSVP = async (status: "attending" | "not-attending") => {
    setLoading(true);
    const response =
      status === "attending"
        ? await attendEvent(event.id)
        : await declineEvent(event.id);

    if (!response.error) {
      setAttendanceStatus(status);
      setIsEditing(false);
    }

    setLoading(false);
  };

  const renderRSVPControls = () => (
    <div className="flex justify-center space-x-2">
      <button
        className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
        onClick={() => handleRSVP("attending")}
        disabled={loading || attendanceStatus === "attending"}
      >
        Attend
      </button>
      <button
        className="rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100"
        onClick={() => setIsEditing(false)}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
        onClick={() => handleRSVP("not-attending")}
        disabled={
          loading ||
          isCaptain ||
          isPlayer ||
          attendanceStatus === "not-attending"
        }
      >
        Decline
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-[8rem_1fr_8rem] items-end gap-4">
      <span className="w-fit text-xs font-bold text-accent-orange">
        {event.league.name}
      </span>

      <div className="flex flex-col gap-4">
        <Link
          to={`/events/${event.id}/${event.resultsEntered ? "results" : ""}`}
          className="self-center rounded-md border border-accent-orange bg-white px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange hover:text-white"
        >
          {event.resultsEntered ? "View Results" : "View Details"}
        </Link>
        {!isPastEvent && isRsvpOpen && (
          <>
            {!attendanceStatus || isEditing ? (
              renderRSVPControls()
            ) : spotsRemaining <= 0 ? (
              <p className="text-center text-sm text-red-500">
                No spots remaining
              </p>
            ) : (
              <div className="flex justify-center">
                <button
                  className="flex items-center gap-2 rounded-md border border-accent-orange px-4 py-2 text-sm font-medium text-accent-orange hover:bg-accent-orange hover:text-white disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit RSVP
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isPastEvent ? (
        <div className="w-10" />
      ) : isRsvpOpen ? (
        <CountdownClock deadline={rsvpDeadline} size="sm" />
      ) : (
        teamCaptained &&
        (!teamCaptained.draftCompleted ? (
          <Link
            to={`/events/${event.id}/team-draft`}
            className="ml-auto w-fit rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90"
          >
            {event.teams.some((team) => team.players?.length)
              ? "Continue"
              : "Begin"}{" "}
            Draft
          </Link>
        ) : (
          <span className="text-xs font-medium text-green-600">
            Draft Completed
          </span>
        ))
      )}
    </div>
  );
};
