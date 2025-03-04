
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Team } from "./types"

interface ScoreInputProps {
  team: Team
  score: string
  setScore: (score: string) => void
  updateScores: (team1Score: string, team2Score: string) => void
  otherTeamScore: string
  teamType: 'team1' | 'team2'
}

export function ScoreInput({
  team,
  score,
  setScore,
  updateScores,
  otherTeamScore,
  teamType
}: ScoreInputProps) {
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = e.target.value
    setScore(newScore)
    updateScores(
      teamType === 'team1' ? newScore : otherTeamScore,
      teamType === 'team2' ? newScore : otherTeamScore
    )
  }

  const handleAddScore = (amount: number) => {
    const newScore = (parseInt(score) || 0) + amount
    setScore(newScore.toString())
    updateScores(
      teamType === 'team1' ? newScore.toString() : otherTeamScore,
      teamType === 'team2' ? newScore.toString() : otherTeamScore
    )
  }

  const handleNumberInput = (number: string) => {
    const newScore = score + number
    setScore(newScore)
    updateScores(
      teamType === 'team1' ? newScore : otherTeamScore,
      teamType === 'team2' ? newScore : otherTeamScore
    )
  }

  const handleClear = () => {
    setScore('')
    updateScores(
      teamType === 'team1' ? '' : otherTeamScore,
      teamType === 'team2' ? '' : otherTeamScore
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-16 h-16" style={{ backgroundColor: team.color }}>
        <AvatarImage src={team.avatar} alt={team.name} />
        <AvatarFallback>{team.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <Input
        type="number"
        value={score}
        onChange={handleScoreChange}
        className="w-24 text-center"
        min="0"
        required
      />
      <div className="flex space-x-2">
        <Button type="button" onClick={() => handleAddScore(2)} size="sm" variant="outline">+2</Button>
        <Button type="button" onClick={() => handleAddScore(3)} size="sm" variant="outline">+3</Button>
        <Button type="button" onClick={() => handleAddScore(10)} size="sm" variant="outline">+10</Button>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {['1', '2', '3', '4', '5'].map((num) => (
          <Button key={num} type="button" onClick={() => handleNumberInput(num)} size="sm" variant="outline">{num}</Button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {['6', '7', '8', '9', '0'].map((num) => (
          <Button key={num} type="button" onClick={() => handleNumberInput(num)} size="sm" variant="outline">{num}</Button>
        ))}
      </div>
      <Button type="button" onClick={handleClear} size="sm" variant="outline" className="w-full">Clear</Button>
    </div>
  )
}
