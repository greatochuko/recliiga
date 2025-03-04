
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { DraftCompletionDialog } from '@/components/draft/DraftCompletionDialog'
import { Team, Player, DraftHistoryItem } from '@/components/draft/types'
import { TeamColumn } from '@/components/draft/TeamColumn'
import { PlayersList } from '@/components/draft/PlayersList'
import { DraftControls } from '@/components/draft/DraftControls'
import { mockPlayers } from '@/components/draft/draftData'

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Team Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <DraftControls
            draftType={draftType}
            setDraftType={setDraftType}
            draftStarted={draftStarted}
            draftRound={draftRound}
            handleUndo={handleUndo}
            draftHistory={draftHistory}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.5fr] gap-6 h-[calc(100vh-300px)]">
            {/* Team columns for larger screens */}
            <div className="hidden lg:block" ref={teamColumnRef}>
              <TeamColumn 
                team={teams[0]} 
                index={0}
                toggleEditMode={toggleEditMode}
                handleTeamNameChange={handleTeamNameChange}
                handleTeamColorChange={handleTeamColorChange}
              />
            </div>
            <div className="hidden lg:block">
              <TeamColumn 
                team={teams[1]} 
                index={1}
                toggleEditMode={toggleEditMode}
                handleTeamNameChange={handleTeamNameChange}
                handleTeamColorChange={handleTeamColorChange}
              />
            </div>

            {/* Tabs for team views on smaller screens */}
            <div className="lg:hidden mb-6">
              <Tabs defaultValue="team1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="team1">Team 1</TabsTrigger>
                  <TabsTrigger value="team2">Team 2</TabsTrigger>
                </TabsList>
                <TabsContent value="team1">
                  <TeamColumn 
                    team={teams[0]} 
                    index={0}
                    toggleEditMode={toggleEditMode}
                    handleTeamNameChange={handleTeamNameChange}
                    handleTeamColorChange={handleTeamColorChange}
                  />
                </TabsContent>
                <TabsContent value="team2">
                  <TeamColumn 
                    team={teams[1]} 
                    index={1}
                    toggleEditMode={toggleEditMode}
                    handleTeamNameChange={handleTeamNameChange}
                    handleTeamColorChange={handleTeamColorChange}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Available players */}
            <div className="lg:col-span-1 lg:col-start-3 flex flex-col h-full">
              <PlayersList 
                availablePlayers={availablePlayers}
                teams={teams}
                currentTeam={currentTeam}
                isTeamSetupComplete={isTeamSetupComplete}
                handlePlayerDraft={handlePlayerDraft}
              />
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
