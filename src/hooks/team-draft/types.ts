
import { Team, Player, DraftHistoryItem } from '@/components/draft/types';

export interface UseTeamDraftProps {
  eventId: string | undefined;
  eventData?: any;
}

export interface UseTeamDraftReturn {
  isLoading: boolean;
  teams: Team[];
  availablePlayers: Player[];
  currentTeam: number;
  draftType: string;
  setDraftType: (type: string) => void;
  draftStarted: boolean;
  draftRound: number;
  draftHistory: DraftHistoryItem[];
  showCompletionDialog: boolean;
  isSubmitting: boolean;
  isTeamSetupComplete: boolean;
  handleTeamNameChange: (teamId: number, name: string) => void;
  handleTeamColorChange: (teamId: number, color: string) => void;
  handlePlayerDraft: (playerId: number) => void;
  handleUndo: () => void;
  toggleEditMode: (teamId: number) => void;
  handleConfirmTeam: (teamId: number) => void;
  handleFinalizeDraft: () => void;
  setShowCompletionDialog: (show: boolean) => void;
}

export interface DraftState {
  teams: Team[];
  availablePlayers: Player[];
  currentTeam: number;
  draftType: string;
  draftRound: number;
  draftStarted: boolean;
  totalPicks: number;
  draftHistory: DraftHistoryItem[];
  draftSession: any;
  isLoading: boolean;
  event: any;
  showCompletionDialog: boolean;
  isSubmitting: boolean;
}
