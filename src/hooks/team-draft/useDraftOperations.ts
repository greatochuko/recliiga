
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Player, Team, DraftHistoryItem } from '@/components/draft/types';
import { draftPlayer, updateDraftSessionStatus, finalizeDraft } from '@/api/draft';
import { getNextTeamInAlternatingDraft, getNextTeamInSnakeDraft, getPreviousTeamInAlternatingDraft, getPreviousTeamInSnakeDraft } from './utils';

export const useDraftOperations = (
  draftSession: any,
  teams: Team[],
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>,
  availablePlayers: Player[],
  setAvailablePlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  currentTeam: number,
  setCurrentTeam: React.Dispatch<React.SetStateAction<number>>,
  draftType: string,
  draftRound: number,
  setDraftRound: React.Dispatch<React.SetStateAction<number>>,
  draftStarted: boolean,
  setDraftStarted: React.Dispatch<React.SetStateAction<boolean>>,
  totalPicks: number,
  setTotalPicks: React.Dispatch<React.SetStateAction<number>>,
  draftHistory: DraftHistoryItem[],
  setDraftHistory: React.Dispatch<React.SetStateAction<DraftHistoryItem[]>>,
  eventId?: string
) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Check if all players have been drafted
  const checkDraftComplete = (availablePlayersCount: number) => {
    if (draftStarted && availablePlayersCount === 0 && !showCompletionDialog) {
      // Show completion dialog after a short delay
      setTimeout(() => {
        setShowCompletionDialog(true);
      }, 500);
    }
  };

  // Handle drafting a player
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
        setCurrentTeam(getNextTeamInAlternatingDraft(currentTeam, teams.length));
      } else if (draftType === 'Snake') {
        const { nextTeam, newRound } = getNextTeamInSnakeDraft(currentTeam, totalPicks, teams.length);
        setDraftRound(newRound);
        setCurrentTeam(nextTeam);
      }
      
      // Check if draft is complete
      checkDraftComplete(availablePlayers.length - 1);
    }
  };

  // Handle undoing a pick
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
        setCurrentTeam(getPreviousTeamInAlternatingDraft(currentTeam, teams.length));
      } else if (draftType === 'Snake') {
        const { previousTeam, newRound } = getPreviousTeamInSnakeDraft(currentTeam, totalPicks, teams.length);
        setDraftRound(newRound);
        setCurrentTeam(previousTeam);
      }
      if (draftHistory.length === 1) {
        setDraftStarted(false);
        setDraftRound(0);
      }
    }
  };

  // Finalize the draft
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

  return {
    handlePlayerDraft,
    handleUndo,
    handleFinalizeDraft,
    isSubmitting,
    showCompletionDialog,
    setShowCompletionDialog
  };
};
