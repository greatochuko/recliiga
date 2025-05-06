import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventType } from "@/types/events";
import React from "react";

interface TeamsDisplayProps {
  event: EventType;
}

export default function TeamsDisplay({ event }: TeamsDisplayProps) {
  return (
    <div className="mb-4 grid grid-cols-3 items-center justify-items-center">
      {event.teams.map((team) => (
        <React.Fragment key={team.id}>
          <div className="flex flex-col items-center">
            <Avatar
              className="h-16 w-16 border-2"
              style={{ borderColor: team.color }}
            >
              <AvatarImage src={team.logo} alt={team.name} />
              <AvatarFallback>
                {team.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])}
              </AvatarFallback>
            </Avatar>
            <span className="mt-2 text-sm font-semibold">{team.name}</span>
          </div>
          <span className="text-lg font-semibold last:hidden">vs</span>
        </React.Fragment>
      ))}
    </div>
  );
}
