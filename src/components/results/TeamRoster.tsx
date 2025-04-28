import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown } from "lucide-react";
import { TeamType } from "@/types/events";

interface TeamRosterProps {
  team: TeamType;
  attendingPlayers: string[];
  setAttendingPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}

export function TeamRoster({
  team,
  attendingPlayers: attendance,
  setAttendingPlayers: setAttendance,
}: TeamRosterProps) {
  const allChecked =
    team.players.every((player) => attendance.includes(player.id)) &&
    attendance.includes(team.captain.id);

  const toggleAttendance = (playerId: string) => {
    if (attendance.includes(playerId)) {
      setAttendance((prev) => prev.filter((att) => att !== playerId));
    } else {
      setAttendance((prev) => [...prev, playerId]);
    }
  };

  const toggleSelectAll = () => {
    const allPlayerIds = [
      team.captain.id,
      ...team.players.map((player) => player.id),
    ];

    const allSelected = allPlayerIds.every((id) => attendance.includes(id));

    if (allSelected) {
      setAttendance((prev) => prev.filter((id) => !allPlayerIds.includes(id)));
    } else {
      setAttendance((prev) => [
        ...prev,
        ...allPlayerIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Team members
        </h3>
        <div className="flex items-center gap-2">
          <label
            htmlFor={`select-all-${team.name}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All
          </label>
          <Checkbox
            id={`select-all-${team.name}`}
            checked={allChecked}
            onCheckedChange={toggleSelectAll}
            aria-label={`Select all players for ${team.name}`}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-2">
          <Avatar className="h-12 w-12" style={{ backgroundColor: team.color }}>
            <AvatarImage
              src={team.captain.avatar_url}
              alt={team.captain.full_name}
              className="object-cover"
            />
            <AvatarFallback>
              {team.captain.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{team.captain.full_name}</span>
              <Crown className="h-4 w-4 text-accent-orange" />
            </div>
            <span className="text-sm text-muted-foreground">
              {team.captain.positions[0]}
            </span>
          </div>
          <Checkbox
            checked={attendance.includes(team.captain.id)}
            onCheckedChange={() => toggleAttendance(team.captain.id)}
            aria-label={`Mark ${team.captain.full_name} as present`}
          />
        </div>
        {team.players.map((player) => (
          <div key={player.id} className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={player.avatar_url}
                alt={player.full_name}
                className="object-cover"
              />
              <AvatarFallback>
                {player.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-semibold">{player.full_name}</span>
              <p className="text-sm text-muted-foreground">
                {player.positions[0]}
              </p>
            </div>
            <Checkbox
              checked={attendance.includes(player.id)}
              onCheckedChange={() => toggleAttendance(player.id)}
              aria-label={`Mark ${player.full_name} as present`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
