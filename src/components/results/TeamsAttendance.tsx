import { TeamType } from "@/types/events";
import { TeamRoster } from "./TeamRoster";

interface TeamsAttendanceProps {
  teams: TeamType[];
  attendingPlayers: string[];
  setAttendingPlayers: React.Dispatch<React.SetStateAction<string[]>>;
  captainSelected: boolean;
}

export function TeamsAttendance({
  teams,
  attendingPlayers,
  setAttendingPlayers,
  captainSelected,
}: TeamsAttendanceProps) {
  if (!captainSelected) {
    return (
      <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
        No teams available for attendance.
      </div>
    );
  }

  return (
    <div className="grid gap-8 border-t pt-8 md:grid-cols-2">
      {teams.map((team) => (
        <TeamRoster
          key={team.id}
          team={team}
          attendingPlayers={attendingPlayers}
          setAttendingPlayers={setAttendingPlayers}
        />
      ))}
    </div>
  );
}
