
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Star, Undo2 } from 'lucide-react'
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useParams, useNavigate } from 'react-router-dom'
import { DraftCompletionDialog } from '@/components/draft/DraftCompletionDialog'

const JerseyIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8.5V20.5H4V8.5L8 4.5H16L20 8.5Z" stroke={color === '#FFFFFF' ? '#000000' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 4.5H16V8.5H8V4.5Z" stroke={color === '#FFFFFF' ? '#000000' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlayerRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center text-[#FF7A00] font-bold">
    <span className="mr-1">{rating.toFixed(2)}</span>
    <Star className="w-4 h-4 fill-[#FF7A00]" />
  </div>
)

interface ColorOption {
  name: string;
  value: string;
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  position: string;
  rating: number;
}

interface Team {
  id: number;
  name: string;
  color: string;
  players: Player[];
  isEditing: boolean;
  captain: string | null;
  confirmed?: boolean;
}

interface DraftHistoryItem {
  player: Player;
  teamIndex: number;
}

const colorOptions: ColorOption[] = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
]

const mockPlayers: Player[] = [
  { id: 1, name: 'John Smith', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward', rating: 2.50 },
  { id: 2, name: 'Alex Johnson', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder', rating: 3.00 },
  { id: 3, name: 'Sarah Williams', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender', rating: 2.00 },
  { id: 4, name: 'Chris Lee', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper', rating: 2.50 },
  { id: 5, name: 'Pat Taylor', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward', rating: 1.50 },
  { id: 6, name: 'Jamie Brown', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder', rating: 2.00 },
  { id: 7, name: 'Sam Green', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender', rating: 1.00 },
  { id: 8, name: 'Mike Davis', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder', rating: 3.00 },
  { id: 9, name: 'Tom Wilson', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender', rating: 2.50 },
  { id: 10, name: 'Casey Morgan', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward', rating: 2.00 },
  { id: 11, name: 'Jordan Riley', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper', rating: 1.50 },
  { id: 12, name: 'Emma Thompson', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder', rating: 2.50 },
  { id: 13, name: 'Olivia Chen', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward', rating: 3.00 },
  { id: 14, name: 'Ryan Patel', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender', rating: 0.50 },
]

export default function TeamDraftPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: '', color: '#FFFFFF', players: [], isEditing: true, captain: null },
    { id: 2, name: '', color: '#000000', players: [], isEditing: true, captain: null },
  ])
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [currentTeam, setCurrentTeam] = useState(0)
  const [draftType, setDraftType] = useState('Alternating')
  const [draftRound, setDraftRound] = useState(0)
  const [draftStarted, setDraftStarted] = useState(false)
  const [totalPicks, setTotalPicks] = useState(0)
  const [draftHistory, setDraftHistory] = useState<DraftHistoryItem[]>([])
  const teamColumnRef = useRef<HTMLDivElement>(null)
  const [teamColumnHeight, setTeamColumnHeight] = useState(0)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  useEffect(() => {
    const captains = ['John Smith', 'Mike Davis']
    const shuffledCaptains = captains.sort(() => Math.random() - 0.5)

    setTeams(teams.map((team, index) => ({
      ...team,
      captain: shuffledCaptains[index],
      players: [mockPlayers.find(p => p.name === shuffledCaptains[index])!]
    })))

    setAvailablePlayers(mockPlayers.filter(p => !captains.includes(p.name)))
  }, [])

  useEffect(() => {
    const updateTeamColumnHeight = () => {
      if (teamColumnRef.current) {
        setTeamColumnHeight(teamColumnRef.current.offsetHeight)
      }
    }

    updateTeamColumnHeight()
    window.addEventListener('resize', updateTeamColumnHeight)

    return () => {
      window.removeEventListener('resize', updateTeamColumnHeight)
    }
  }, [])

  // Check if all players have been drafted
  useEffect(() => {
    if (draftStarted && availablePlayers.length === 0 && !showCompletionDialog) {
      // Show completion dialog after a short delay
      setTimeout(() => {
        setShowCompletionDialog(true)
      }, 500)
    }
  }, [availablePlayers.length, draftStarted, showCompletionDialog])

  const handleTeamNameChange = (teamId: number, name: string) => {
    setTeams(teams.map(team => team.id === teamId ? { ...team, name } : team))
  }

  const handleTeamColorChange = (teamId: number, color: string) => {
    if (teams.some(t => t.id !== teamId && t.color === color)) {
      toast({
        title: "Color Not Available",
        description: "This color has already been selected by another team.",
        variant: "destructive",
      });
      return;
    }
    setTeams(teams.map(team => team.id === teamId ? { ...team, color } : team));
  }

  const handlePlayerDraft = (playerId: number) => {
    setDraftStarted(true)
    setTotalPicks(prevTotalPicks => prevTotalPicks + 1)
    
    const player = availablePlayers.find(p => p.id === playerId)
    if (player) {
      const updatedTeams = teams.map((team, index) => 
        index === currentTeam 
          ? { ...team, players: [...team.players, player] }
          : team
      )
      setTeams(updatedTeams)
      setAvailablePlayers(availablePlayers.filter(p => p.id !== playerId))
      setDraftHistory([...draftHistory, { player, teamIndex: currentTeam }])
    
      if (draftType === 'Alternating') {
        setCurrentTeam((currentTeam + 1) % teams.length)
      } else if (draftType === 'Snake') {
        const newTotalPicks = totalPicks + 1
        const newRound = Math.floor(newTotalPicks / teams.length) + 1
        setDraftRound(newRound)

        if (newRound % 2 === 0) {
          if (newTotalPicks % 2 === 1) {
            setCurrentTeam((currentTeam + 1) % teams.length)
          }
        } else {
          setCurrentTeam((currentTeam + 1) % teams.length)
        }
      }
    }
  }

  const handleUndo = () => {
    if (draftHistory.length > 0) {
      const lastDraft = draftHistory[draftHistory.length - 1]
      const updatedTeams = teams.map((team, index) => 
        index === lastDraft.teamIndex
          ? { ...team, players: team.players.filter(p => p.id !== lastDraft.player.id) }
          : team
      )
      setTeams(updatedTeams)
      setAvailablePlayers([...availablePlayers, lastDraft.player])
      setDraftHistory(draftHistory.slice(0, -1))
      setTotalPicks(prevTotalPicks => prevTotalPicks - 1)

      if (draftType === 'Alternating') {
        setCurrentTeam((currentTeam - 1 + teams.length) % teams.length)
      } else if (draftType === 'Snake') {
        const newTotalPicks = totalPicks - 1
        const newRound = Math.floor(newTotalPicks / teams.length) + 1
        setDraftRound(newRound)

        if (newRound % 2 === 0) {
          if (newTotalPicks % 2 === 0) {
            setCurrentTeam((currentTeam - 1 + teams.length) % teams.length)
          }
        } else {
          setCurrentTeam((currentTeam - 1 + teams.length) % teams.length)
        }
      }
      if (draftHistory.length === 1) {
        setDraftStarted(false)
        setDraftRound(0)
      }
    }
  }

  const toggleEditMode = (teamId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, isEditing: !team.isEditing } : team
    ))
  }

  const handleConfirmTeam = (teamId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, confirmed: true } : team
    ))
    
    toast({
      title: "Team Confirmed",
      description: `Team ${teams.find(t => t.id === teamId)?.name} roster has been confirmed!`,
      variant: "default",
    })
  }
  
  const handleFinalizeDraft = () => {
    toast({
      title: "Draft Finalized",
      description: "All teams have been confirmed and the draft is now complete!",
      variant: "default",
    })
    
    // Here you would typically save the draft results to your backend
    // For now, we'll just redirect back to the event page
    setTimeout(() => {
      setShowCompletionDialog(false)
      navigate(`/events/${eventId}`)
    }, 1500)
  }

  const isTeamSetupComplete = teams.every(team => team.name && team.color)

  const renderTeamColumn = (team: Team, index: number) => (
    <Card key={team.id} className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span>Team {index + 1}: {team.name}</span>
              <JerseyIcon color={team.color} size={24} />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={team.players[0]?.avatar} alt={team.captain || ''} />
                <AvatarFallback>{team.captain?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Captain: {team.captain}</span>
            </div>
          </div>
          {!team.isEditing && (
            <Button variant="ghost" size="sm" onClick={() => toggleEditMode(team.id)}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit team</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {team.isEditing ? (
          <>
            <div>
              <Label htmlFor={`team-name-${team.id}`}>Team Name</Label>
              <Input
                id={`team-name-${team.id}`}
                value={team.name}
                onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                placeholder="Enter team name"
              />
            </div>
            <div>
              <Label>Team Color</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex-shrink-0">
                  <JerseyIcon color={team.color} size={64} />
                </div>
                <div className="grid grid-cols-3 grid-rows-2 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 border-2 border-black ${team.color === color.value ? 'ring-2 ring-[#FF7A00] ring-offset-2' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleTeamColorChange(team.id, color.value)}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {team.name && team.color && (
              <Button onClick={() => toggleEditMode(team.id)}>
                Confirm Team Setup
              </Button>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span><strong>Team {index + 1}: {team.name}</strong></span>
              <JerseyIcon color={team.color} size={24} />
            </div>
            <p><strong>Team Color:</strong> {colorOptions.find(c => c.value === team.color)?.name}</p>
          </div>
        )}
        <div className="mt-4 h-[calc(100%-200px)]">
          <Label>Drafted Players ({team.players.length})</Label>
          <ScrollArea className="h-full w-full border rounded-md p-2">
            {team.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-gray-500">{player.position}</p>
                  </div>
                </div>
                <PlayerRating rating={player.rating} />
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Team Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Card className="border-2 border-[#FF7A00] w-fit">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center space-x-4">
                    <CardTitle className="text-base font-semibold text-black">Draft Type</CardTitle>
                    <RadioGroup
                      value={draftType}
                      onValueChange={(value) => setDraftType(value)}
                      className="flex space-x-4"
                      disabled={draftStarted}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Alternating" id="alternating" />
                        <Label htmlFor="alternating" className="text-sm">Alternating</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Snake" id="snake" />
                        <Label htmlFor="snake" className="text-sm">Snake</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
            {draftStarted && (
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold">
                  Round: {draftRound}
                </div>
                <Button
                  onClick={handleUndo}
                  disabled={draftHistory.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <Undo2 className="mr-2 h-4 w-4" />
                  Undo Pick
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.5fr] gap-6 h-[calc(100vh-300px)]">
            {/* Team columns for larger screens */}
            <div className="hidden lg:block" ref={teamColumnRef}>
              {renderTeamColumn(teams[0], 0)}
            </div>
            <div className="hidden lg:block">
              {renderTeamColumn(teams[1], 1)}
            </div>

            {/* Tabs for team views on smaller screens */}
            <div className="lg:hidden mb-6">
              <Tabs defaultValue="team1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="team1">Team 1</TabsTrigger>
                  <TabsTrigger value="team2">Team 2</TabsTrigger>
                </TabsList>
                <TabsContent value="team1">
                  {renderTeamColumn(teams[0], 0)}
                </TabsContent>
                <TabsContent value="team2">
                  {renderTeamColumn(teams[1], 1)}
                </TabsContent>
              </Tabs>
            </div>

            {/* Available players */}
            <div className="lg:col-span-1 lg:col-start-3 flex flex-col h-full">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Available Players ({availablePlayers.length})</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full w-full">
                    {availablePlayers.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={player.avatar} alt={player.name} />
                            <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{player.name}</p>
                              <PlayerRating rating={player.rating} />
                            </div>
                            <p className="text-sm text-gray-500">{player.position}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handlePlayerDraft(player.id)}
                          disabled={!isTeamSetupComplete}
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Draft to {teams[currentTeam].name || `Team ${currentTeam + 1}`}
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draft Completion Dialog */}
      <DraftCompletionDialog
        open={showCompletionDialog}
        teams={teams}
        onOpenChange={setShowCompletionDialog}
        onConfirmTeam={handleConfirmTeam}
        onFinalizeDraft={handleFinalizeDraft}
      />
    </div>
  )
}
