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
  const [spotsLeft, setSpotsLeft] = useState(
    event.numTeams * event.rosterSpots - event.players.length,
  );
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<
    "attending" | "neutral" | "not-attending"
  >(
    event.players.some((player) => player.id === user?.id)
      ? "attending"
      : event.unAttendingPlayers.some((player) => player.id === user?.id)
        ? "not-attending"
        : "neutral",
  );

  return (
    <Card>
      <CardContent className="relative p-4">
        <EventHeader
          spotsLeft={spotsLeft}
          event={event}
          attendanceStatus={attendanceStatus}
          isPastEvent={isPastEvent}
        />
        <TeamsDisplay event={event} />

        <EventActions
          event={event}
          spotsLeft={spotsLeft}
          setSpotsRemaining={setSpotsLeft}
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
