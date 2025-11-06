import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { EventType } from "@/types/events";
import { attendEvent, declineEvent } from "@/api/events";
import { useAuth } from "@/contexts/AuthContext";
import CountdownClock from "./CountdownClock";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

interface EventActionsProps {
  event: EventType;
  spotsLeft: number;
  setSpotsRemaining: React.Dispatch<React.SetStateAction<number>>;
  isPastEvent?: boolean;
  attendanceStatus: "attending" | "not-attending" | "neutral" | null;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  setAttendanceStatus: (
    status: "attending" | "not-attending" | "neutral" | null,
  ) => void;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  spotsLeft,
  setSpotsRemaining,
  isPastEvent = false,
  attendanceStatus,
  isEditing,
  setIsEditing,
  setAttendanceStatus,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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
      if (status === "attending") setSpotsRemaining((prev) => prev - 1);
      else setSpotsRemaining((prev) => prev + 1);
      setAttendanceStatus(status);
      setIsEditing(false);
    } else {
      toast.error(response.error, { style: { color: "#ef4444" } });
    }

    setLoading(false);
  };

  const renderRSVPControls = () => (
    <div className="flex gap-2 sm:justify-center sm:space-x-2">
      <button
        className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
        onClick={() => handleRSVP("attending")}
        disabled={loading || attendanceStatus === "attending" || spotsLeft < 1}
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
    <>
      <div className="hidden grid-cols-[10rem_1fr_10rem] items-end gap-4 sm:grid">
        <span className="static w-fit text-xs font-bold text-accent-orange">
          {event.league.name}
        </span>

        <div className="flex flex-col items-center justify-center gap-4 whitespace-nowrap">
          <Link
            to={`/dashboard/events/${event.id}/${event.resultsEntered ? "results" : ""}`}
            className="self-center rounded-md border border-accent-orange bg-white px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange hover:text-white"
          >
            {event.resultsEntered ? "View Results" : "View Details"}
          </Link>
          {!isPastEvent && isRsvpOpen && (
            <>
              {!attendanceStatus || isEditing ? (
                renderRSVPControls()
              ) : (
                <div className="flex justify-center gap-2 sm:flex-row">
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

        {isRsvpOpen ? (
          <div className="flex justify-end">
            <CountdownClock deadline={rsvpDeadline} size="sm" />
          </div>
        ) : (
          teamCaptained &&
          (!teamCaptained.draftCompleted ? (
            <Link
              to={`/dashboard/events/${event.id}/team-draft`}
              className="ml-auto w-fit whitespace-nowrap rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90"
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
      <div className="grid grid-cols-1 items-end gap-4 sm:hidden">
        <div className="flex flex-col items-center justify-center gap-4">
          <Link
            to={`/dashboard/events/${event.id}/${event.resultsEntered ? "results" : ""}`}
            className="self-center rounded-md border border-accent-orange bg-white px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange hover:text-white"
          >
            {event.resultsEntered ? "View Results" : "View Details"}
          </Link>
          {!isPastEvent && isRsvpOpen && (
            <>
              {!attendanceStatus || isEditing ? (
                renderRSVPControls()
              ) : (
                <div className="flex justify-center gap-2 sm:flex-row">
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

        {isRsvpOpen ? (
          <div className="flex justify-end">
            <CountdownClock deadline={rsvpDeadline} size="sm" />
          </div>
        ) : (
          teamCaptained &&
          (!teamCaptained.draftCompleted ? (
            <Link
              to={`/dashboard/events/${event.id}/team-draft`}
              className="ml-auto w-fit whitespace-nowrap rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90"
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

        {!isPastEvent &&
          (attendanceStatus === "attending" ? (
            <Badge
              variant="secondary"
              className="absolute bottom-4 left-4 mt-2 self-start bg-accent-orange/20 text-xs text-accent-orange"
            >
              Attending
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="absolute bottom-4 left-4 mt-2 self-start text-xs text-red-600"
            >
              {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
            </Badge>
          ))}
      </div>
    </>
  );
};
