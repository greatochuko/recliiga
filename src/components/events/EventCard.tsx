import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EventType } from "@/types/events";
import { EventHeader } from "@/components/events/EventHeader";
import TeamsDisplay from "@/components/events/TeamsDisplay";
import { EventActions } from "@/components/events/EventActions";
import { useAuth } from "@/contexts/AuthContext";

export default function EventCard({
  event,
  isPastEvent = false,
  showLeagueName = false,
}: {
  event: EventType;
  isPastEvent?: boolean;
  showLeagueName?: boolean;
}) {
  const { user } = useAuth();
  const [attendanceStatus, setAttendanceStatus] = useState<
    "attending" | "not-attending"
  >(
    event.players.some((player) => player.id === user?.id)
      ? "attending"
      : "not-attending",
  );

  const eventDate = useMemo(() => {
    const date = new Date(event.startDate.date);
    date.setHours(
      event.startDate.startAmPm === "PM"
        ? event.startDate.startHour + 12
        : event.startDate.startHour,
      event.startDate.startMinute,
    );
    return date;
  }, [
    event.startDate.date,
    event.startDate.startAmPm,
    event.startDate.startHour,
    event.startDate.startMinute,
  ]);

  const isRsvpOpen =
    new Date().getTime() < eventDate.getTime() - event.rsvpDeadline * 60 * 1000;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="mb-4">
      <CardContent className="relative p-4">
        <EventHeader
          event={event}
          attendanceStatus={attendanceStatus}
          isEditing={isEditing}
          isPastEvent={isPastEvent}
        />

        <TeamsDisplay event={event} isRsvpOpen={isRsvpOpen} />

        {showLeagueName && (
          <div className="absolute bottom-4 left-4 text-xs">
            <span className="font-bold text-accent-orange">
              {event.league.name}
            </span>
          </div>
        )}

        <EventActions
          event={event}
          isPastEvent={isPastEvent}
          attendanceStatus={attendanceStatus}
          isRsvpOpen={isRsvpOpen}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setAttendanceStatus={setAttendanceStatus}
        />
      </CardContent>
    </Card>
  );
}
