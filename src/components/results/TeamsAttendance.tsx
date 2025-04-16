import { TeamType } from "@/types/events";
import { TeamRoster } from "./TeamRoster";

interface TeamsAttendanceProps {
  teams: TeamType[];
  attendingPlayers: string[];
  setAttendingPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}

export function TeamsAttendance({
  teams,
  attendingPlayers,
  setAttendingPlayers,
}: TeamsAttendanceProps) {
  return (
    <div className="grid gap-8 border-t pt-8 md:grid-cols-2">
      {teams.map((team) => (
        <TeamRoster
          team={team}
          attendingPlayers={attendingPlayers}
          setAttendingPlayers={setAttendingPlayers}
        />
      ))}
    </div>
  );
}
