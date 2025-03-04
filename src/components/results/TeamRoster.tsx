
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Crown } from 'lucide-react'
import { Team } from './types'

interface TeamRosterProps {
  team: Team
  attendance: Record<string, boolean>
  onAttendanceChange: (attendance: Record<string, boolean>) => void
}

export function TeamRoster({ team, attendance, onAttendanceChange }: TeamRosterProps) {
  const allChecked = team.players.every(player => attendance[player.name]) && attendance[team.captain.name]

  const handleSelectAll = (checked: boolean) => {
    const newAttendance: Record<string, boolean> = {}
    newAttendance[team.captain.name] = checked
    team.players.forEach(player => {
      newAttendance[player.name] = checked
    })
    onAttendanceChange(newAttendance)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Team members</h3>
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
            onCheckedChange={handleSelectAll}
            aria-label={`Select all players for ${team.name}`}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg">
          <Avatar className="w-12 h-12" style={{ backgroundColor: team.color }}>
            <AvatarImage src={team.captain.avatar} alt={team.captain.name} />
            <AvatarFallback>{team.captain.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{team.captain.name}</span>
              <Crown className="w-4 h-4 text-[#FF7A00]" />
            </div>
            <span className="text-sm text-muted-foreground">{team.captain.position}</span>
          </div>
          <Checkbox
            checked={attendance[team.captain.name] || false}
            onCheckedChange={(checked) => onAttendanceChange({ ...attendance, [team.captain.name]: checked as boolean })}
            aria-label={`Mark ${team.captain.name} as present`}
          />
        </div>
        {team.players.map((player) => (
          <div key={player.id} className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-semibold">{player.name}</span>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
            <Checkbox
              checked={attendance[player.name] || false}
              onCheckedChange={(checked) => onAttendanceChange({ ...attendance, [player.name]: checked as boolean })}
              aria-label={`Mark ${player.name} as present`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
