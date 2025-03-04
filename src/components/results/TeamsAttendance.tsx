
import { TeamRoster } from './TeamRoster'
import { TeamData } from './types'

interface TeamsAttendanceProps {
  teamData: TeamData
  attendance: Record<string, boolean>
  onAttendanceChange: (attendance: Record<string, boolean>) => void
}

export function TeamsAttendance({ teamData, attendance, onAttendanceChange }: TeamsAttendanceProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t">
      <TeamRoster 
        team={teamData.team1}
        attendance={attendance}
        onAttendanceChange={onAttendanceChange}
      />
      <TeamRoster 
        team={teamData.team2}
        attendance={attendance}
        onAttendanceChange={onAttendanceChange}
      />
    </div>
  )
}
