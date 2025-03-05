import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { 
  Team, 
  Player, 
  DraftHistoryItem 
} from '@/components/draft/types';
import { 
  getOrCreateDraftSession, 
  updateDraftSessionStatus, 
  draftPlayer, 
  getDraftPicks,
  finalizeDraft 
} from '@/api/draft';
import { fetchEventById, getAttendingPlayers } from '@/api/events';
import { supabase } from '@/integrations/supabase/client';

export function useTeamDraft(eventId: string | undefined, eventData?: any) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: '', color: '#FFFFFF', players: [], isEditing: true, captain: null },
    { id: 2, name: '', color: '#000000', players: [], isEditing: true, captain: null },
  ]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [draftType, setDraftType] = useState('Alternating');
  const [draftRound, setDraftRound] = useState(0);
  const [draftStarted, setDraftStarted] = useState(false);
  const [totalPicks, setTotalPicks] = useState(0);
  const [draftHistory, setDraftHistory] = useState<DraftHistoryItem[]>([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [event, setEvent] = useState<any>(eventData);
  const [draftSession, setDraftSession] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch event and draft data
  useEffect(() => {
    const loadDraftData = async () => {
      if (!eventId) return;

      setIsLoading(true);
      try {
        // Use passed event data if available, otherwise fetch it
        let eventData = event;
        if (!eventData) {
          eventData = await fetchEventById(eventId);
          if (!eventData) {
            toast.error("Event not found");
            navigate('/events');
            return;
          }
          setEvent(eventData);
        }

        // Set up teams based on event data
        const updatedTeams = [
          { 
            id: 1, 
            name: eventData.team1.name, 
            color: eventData.team1.color, 
            players: [], 
            isEditing: true, 
            captain: eventData.captains?.team1?.name || null 
          },
          { 
            id: 2, 
            name: eventData.team2.name, 
            color: eventData.team2.color, 
            players: [], 
            isEditing: true, 
            captain: eventData.captains?.team2?.name || null 
          }
        ];
        setTeams(updatedTeams);

        // Get or create draft session
        const session = await getOrCreateDraftSession(eventId);
        if (!session) {
          toast.error("Failed to initialize draft session");
          return;
        }
        setDraftSession(session);

        // If draft is already in progress, load existing picks
        if (session.status === 'in_progress' || session.status === 'completed') {
          setDraftStarted(true);
          const picks = await getDraftPicks(session.id);
          
          // Process picks to update teams and draft history
          if (picks.length > 0) {
            const newDraftHistory: DraftHistoryItem[] = [];
            const teamPlayers: { [key: string]: Player[] } = { team1: [], team2: [] };
            
            picks.forEach(pick => {
              if (pick.player) {
                const teamIndex = pick.team_id === 'team1' ? 0 : 1;
                teamPlayers[pick.team_id] = [...(teamPlayers[pick.team_id] || []), pick.player];
                
                newDraftHistory.push({
                  player: pick.player,
                  teamIndex
                });
              }
            });
            
            // Update teams with drafted players
            setTeams(teams => teams.map((team, index) => ({
              ...team,
              players: [
                ...(team.players || []),
                ...(index === 0 ? teamPlayers.team1 || [] : teamPlayers.team2 || [])
              ]
            })));
            
            setDraftHistory(newDraftHistory);
            setTotalPicks(picks.length);
            
            // Set current team for the next pick
            if (draftType === 'Alternating') {
              setCurrentTeam(picks.length % 2);
            } else if (draftType === 'Snake') {
              const round = Math.floor(picks.length / 2) + 1;
              setDraftRound(round);
              setCurrentTeam(round % 2 === 0 ? picks.length % 2 : (picks.length + 1) % 2);
            }
          }
        }

        // Fetch available players (attending but not drafted)
        const attendingPlayers = await getAttendingPlayers(eventId);
        
        // Filter out players who have already been drafted
        const draftedPlayerIds = new Set(draftHistory.map(item => item.player.id.toString()));
        const captainIds = [
          eventData.captains?.team1?.id,
          eventData.captains?.team2?.id
        ].filter(Boolean);
        
        // Filter available players to exclude captains and already drafted players
        const availablePlayersList = attendingPlayers.filter(player => 
          !draftedPlayerIds.has(player.id) && !captainIds.includes(player.id)
        );
        
        setAvailablePlayers(availablePlayersList);
      } catch (error) {
        console.error("Error loading draft data:", error);
        toast.error("Failed to load draft data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDraftData();
  }, [eventId, navigate, draftHistory, draftType, event]);

  // Set up realtime subscription to draft picks
  useEffect(() => {
    if (!draftSession?.id) return;

    const channel = supabase
      .channel('draft-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'draft_picks',
          filter: `draft_session_id=eq.${draftSession.id}`
        },
        (payload) => {
          console.log('New draft pick:', payload);
          // Reload draft picks when a new one is added
          getDraftPicks(draftSession.id).then(picks => {
            // Update state based on new picks
            toast.info("Draft updated");
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [draftSession?.id]);

  // Check if all players have been drafted
  useEffect(() => {
    if (draftStarted && availablePlayers.length === 0 && !showCompletionDialog) {
      // Show completion dialog after a short delay
      setTimeout(() => {
        setShowCompletionDialog(true);
      }, 500);
    }
  }, [availablePlayers.length, draftStarted, showCompletionDialog]);

  const handleTeamNameChange = async (teamId: number, name: string) => {
    if (!eventId) return;
    setTeams(teams.map(team => team.id === teamId ? { ...team, name } : team));
    
    // Update event in database
    try {
      const field = teamId === 1 ? 'team1_name' : 'team2_name';
      await supabase
        .from('events')
        .update({ [field]: name })
        .eq('id', eventId);
    } catch (error) {
      console.error('Error updating team name:', error);
    }
  };

  const handleTeamColorChange = async (teamId: number, color: string) => {
    if (!eventId) return;
    
    if (teams.some(t => t.id !== teamId && t.color === color)) {
      toast.error("This color has already been selected by another team.");
      return;
    }
    
    setTeams(teams.map(team => team.id === teamId ? { ...team, color } : team));
    
    // Update event in database
    try {
      const field = teamId === 1 ? 'team1_color' : 'team2_color';
      await supabase
        .from('events')
        .update({ [field]: color })
        .eq('id', eventId);
    } catch (error) {
      console.error('Error updating team color:', error);
    }
  };

  const handlePlayerDraft = async (playerId: number) => {
    if (!draftSession) {
      toast.error("Draft session not initialized");
      return;
    }

    setDraftStarted(true);
    setTotalPicks(prevTotalPicks => prevTotalPicks + 1);
    
    const player = availablePlayers.find(p => p.id.toString() === playerId.toString());
    if (player) {
      const updatedTeams = teams.map((team, index) => 
        index === currentTeam 
          ? { ...team, players: [...team.players, player] }
          : team
      );
      setTeams(updatedTeams);
      setAvailablePlayers(availablePlayers.filter(p => p.id.toString() !== playerId.toString()));
      setDraftHistory([...draftHistory, { player, teamIndex: currentTeam }]);
    
      // Update draft session status if just starting
      if (draftSession.status === 'not_started') {
        await updateDraftSessionStatus(draftSession.id, 'in_progress');
      }
      
      // Add pick to database
      const teamId = currentTeam === 0 ? 'team1' : 'team2';
      await draftPlayer(draftSession.id, teamId, playerId.toString(), totalPicks + 1);
      
      if (draftType === 'Alternating') {
        setCurrentTeam((currentTeam + 1) % teams.length);
      } else if (draftType === 'Snake') {
        const newTotalPicks = totalPicks + 1;
        const newRound = Math.floor(newTotalPicks / teams.length) + 1;
        setDraftRound(newRound);

        if (newRound % 2 === 0) {
          if (newTotalPicks % 2 === 1) {
            setCurrentTeam((currentTeam + 1) % teams.length);
          }
        } else {
          setCurrentTeam((currentTeam + 1) % teams.length);
        }
      }
    }
  };

  const handleUndo = async () => {
    // For simplicity, we're just updating the local state
    // A more complete implementation would also update the database
    if (draftHistory.length > 0) {
      const lastDraft = draftHistory[draftHistory.length - 1];
      const updatedTeams = teams.map((team, index) => 
        index === lastDraft.teamIndex
          ? { ...team, players: team.players.filter(p => p.id.toString() !== lastDraft.player.id.toString()) }
          : team
      );
      setTeams(updatedTeams);
      setAvailablePlayers([...availablePlayers, lastDraft.player]);
      setDraftHistory(draftHistory.slice(0, -1));
      setTotalPicks(prevTotalPicks => prevTotalPicks - 1);

      if (draftType === 'Alternating') {
        setCurrentTeam((currentTeam - 1 + teams.length) % teams.length);
      } else if (draftType === 'Snake') {
        const newTotalPicks = totalPicks - 1;
        const newRound = Math.floor(newTotalPicks / teams.length) + 1;
        setDraftRound(newRound);

        if (newRound % 2 === 0) {
          if (newTotalPicks % 2 === 0) {
            setCurrentTeam((currentTeam - 1 + teams.length) % teams.length);
          }
        } else {
          setCurrentTeam((currentTeam - 1 + teams.length) % teams.length);
        }
      }
      if (draftHistory.length === 1) {
        setDraftStarted(false);
        setDraftRound(0);
      }
    }
  };

  const toggleEditMode = (teamId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, isEditing: !team.isEditing } : team
    ));
  };

  const handleConfirmTeam = (teamId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, confirmed: true } : team
    ));
    
    toast.success(`Team ${teams.find(t => t.id === teamId)?.name} roster has been confirmed!`);
  };
  
  const handleFinalizeDraft = async () => {
    if (!draftSession || !eventId) {
      toast.error("Draft session not initialized");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await finalizeDraft(draftSession.id, eventId);
      
      if (success) {
        toast.success("Draft finalized successfully!");
      } else {
        toast.error("Failed to finalize draft");
      }
      
      // Redirect after short delay regardless of result
      setTimeout(() => {
        setShowCompletionDialog(false);
        navigate(`/events/${eventId}`);
      }, 1500);
    } catch (error) {
      console.error("Error finalizing draft:", error);
      toast.error("An error occurred while finalizing the draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTeamSetupComplete = teams.every(team => team.name && team.color);

  return {
    isLoading,
    teams,
    availablePlayers,
    currentTeam,
    draftType,
    setDraftType,
    draftStarted,
    draftRound,
    draftHistory,
    showCompletionDialog,
    isSubmitting,
    isTeamSetupComplete,
    handleTeamNameChange,
    handleTeamColorChange,
    handlePlayerDraft,
    handleUndo,
    toggleEditMode,
    handleConfirmTeam,
    handleFinalizeDraft,
    setShowCompletionDialog
  };
}
