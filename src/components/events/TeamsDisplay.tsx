import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventType } from "@/types/events";

interface TeamsDisplayProps {
  event: EventType;
}

export default function TeamsDisplay({ event }: TeamsDisplayProps) {
  return (
    <div className="mb-4 grid grid-cols-3 items-center justify-items-center">
      <div className="flex flex-col items-center">
        <Avatar
          className="h-16 w-16 border-2"
          style={{ borderColor: event.teams[0].color }}
        >
          <AvatarImage src={""} alt={""} />
          <AvatarFallback>
            {event.teams[0].name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])}
          </AvatarFallback>
        </Avatar>
        <span className="mt-2 text-sm font-semibold">
          {event.teams[0].name}
        </span>
      </div>
      <span className="text-lg font-semibold">vs</span>
      <div className="flex flex-col items-center">
        <Avatar
          className="h-16 w-16 border-2"
          style={{ borderColor: event.teams[1].color }}
        >
          <AvatarImage src={""} alt={""} />
          <AvatarFallback>
            {event.teams[1].name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])}
          </AvatarFallback>
        </Avatar>
        <span className="mt-2 text-sm font-semibold">
          {event.teams[1].name}
        </span>
      </div>
    </div>
  );
}
