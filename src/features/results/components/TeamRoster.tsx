
import { Team } from '../types';
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamRosterProps {
  team: Team;
  attendance: Record<string, boolean>;
  onAttendanceChange: (attendance: Record<string, boolean>) => void;
}

export function TeamRoster({ team, attendance, onAttendanceChange }: TeamRosterProps) {
  const handleAttendanceChange = (playerId: number) => {
    const playerKey = `player_${playerId}`;
    const newAttendance = {
      ...attendance,
      [playerKey]: !attendance[playerKey]
    };
    onAttendanceChange(newAttendance);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center mb-4">
        <Avatar 
          className="w-10 h-10 mr-3"
          style={{ backgroundColor: team.color }}
        >
          <AvatarImage src={team.avatar} alt={team.name} />
          <AvatarFallback>{team.name[0]}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold">{team.name}</h3>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mr-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={team.captain.avatar} alt={team.captain.name} />
              <AvatarFallback>{team.captain.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-sm">{team.captain.name}</p>
            <p className="text-xs text-gray-500">{team.captain.position}</p>
          </div>
          <div className="bg-[#FF7A00] text-white text-xs px-2 py-1 rounded">Captain</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {team.players.map(player => {
          const playerKey = `player_${player.id}`;
          return (
            <div key={player.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <Checkbox 
                id={playerKey}
                checked={attendance[playerKey] || false}
                onCheckedChange={() => handleAttendanceChange(player.id)}
                className="mr-3"
              />
              <Avatar className="w-8 h-8 mr-3">
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback>{player.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <label 
                  htmlFor={playerKey}
                  className="text-sm font-medium cursor-pointer"
                >
                  {player.name}
                </label>
                <p className="text-xs text-gray-500">{player.position}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
