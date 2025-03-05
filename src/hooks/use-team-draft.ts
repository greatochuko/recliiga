
import { useEffect } from 'react';
import { UseTeamDraftProps, UseTeamDraftReturn } from './team-draft/types';
import { useTeamDraftSetup } from './team-draft/useTeamDraftSetup';
import { useTeamManagement } from './team-draft/useTeamManagement';
import { useDraftOperations } from './team-draft/useDraftOperations';
import { useRealtimeUpdates } from './team-draft/useRealtimeUpdates';
import { isTeamSetupComplete } from './team-draft/utils';

export function useTeamDraft(
  eventId: string | undefined, 
  eventData?: any
): UseTeamDraftReturn {
  
  // Set up draft data
  const {
    isLoading,
    teams,
    setTeams,
    availablePlayers,
    setAvailablePlayers,
    currentTeam,
    setCurrentTeam,
    draftType,
    setDraftType,
    draftRound,
    setDraftRound,
    draftStarted,
    setDraftStarted,
    totalPicks,
    setTotalPicks,
    draftHistory,
    setDraftHistory,
    draftSession
  } = useTeamDraftSetup(eventId, eventData);

  // Set up team management
  const {
    handleTeamNameChange,
    handleTeamColorChange,
    toggleEditMode,
    handleConfirmTeam
  } = useTeamManagement(teams, setTeams, eventId);

  // Set up draft operations
  const {
    handlePlayerDraft,
    handleUndo,
    handleFinalizeDraft,
    isSubmitting,
    showCompletionDialog,
    setShowCompletionDialog
  } = useDraftOperations(
    draftSession,
    teams,
    setTeams,
    availablePlayers,
    setAvailablePlayers,
    currentTeam,
    setCurrentTeam,
    draftType,
    draftRound,
    setDraftRound,
    draftStarted,
    setDraftStarted,
    totalPicks,
    setTotalPicks,
    draftHistory,
    setDraftHistory,
    eventId
  );

  // Set up realtime updates
  useRealtimeUpdates(draftSession?.id);

  // Check for available players when they change
  useEffect(() => {
    // Subscription is handled in useRealtimeUpdates
  }, [availablePlayers.length, draftStarted, showCompletionDialog]);

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
    isTeamSetupComplete: isTeamSetupComplete(teams),
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
