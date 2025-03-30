import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EventType } from "@/types/events";
import { EventStatus } from "@/components/events/EventStatus";
import { EventHeader } from "@/components/events/EventHeader";
import TeamsDisplay from "@/components/events/TeamsDisplay";
import { EventActions } from "@/components/events/EventActions";

export function EventsCard({
  event,
  isPastEvent = false,
  showLeagueName = false,
}: {
  event: EventType;
  isPastEvent?: boolean;
  showLeagueName?: boolean;
}) {
  const [attendanceStatus, setAttendanceStatus] = useState<
    "attending" | "declined" | null
  >(
    event.status === "attending" || event.status === "declined"
      ? event.status
      : null
  );
  const isRsvpOpen = event.rsvpDeadline && new Date() < event.rsvpDeadline;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="mb-4">
      <CardContent className="p-4 relative">
        <EventHeader
          event={event}
          attendanceStatus={attendanceStatus}
          isEditing={isEditing}
          isPastEvent={isPastEvent}
        />

        <TeamsDisplay event={event} isRsvpOpen={isRsvpOpen} />

        {showLeagueName && (
          <div className="absolute bottom-4 left-4 text-xs">
            <span className="font-bold text-[#FF7A00]">{event.league}</span>
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

        {!isPastEvent && <EventStatus event={event} />}
      </CardContent>
    </Card>
  );
}
