import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EventType } from "@/types/events";
import { EventHeader } from "@/components/events/EventHeader";
import TeamsDisplay from "@/components/events/TeamsDisplay";
import { EventActions } from "@/components/events/EventActions";
import { useAuth } from "@/contexts/AuthContext";

export default function EventCard({
  event,
  isPastEvent = false,
}: {
  event: EventType;
  isPastEvent?: boolean;
}) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<
    "attending" | "not-attending"
  >(
    event.players.some((player) => player.id === user?.id)
      ? "attending"
      : "not-attending",
  );

  const eventDate = new Date(event.startTime);

  const isRsvpOpen =
    new Date().getTime() < eventDate.getTime() - event.rsvpDeadline * 60 * 1000;

  return (
    <Card className="mb-4">
      <CardContent className="relative p-4">
        <EventHeader
          event={event}
          attendanceStatus={attendanceStatus}
          isPastEvent={isPastEvent}
        />
        <TeamsDisplay event={event} isRsvpOpen={isRsvpOpen} />

        <EventActions
          event={event}
          isPastEvent={isPastEvent}
          attendanceStatus={attendanceStatus}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setAttendanceStatus={setAttendanceStatus}
        />
      </CardContent>
    </Card>
  );
}
