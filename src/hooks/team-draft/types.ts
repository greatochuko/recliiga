
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
  draftSession: DraftSession | null;
  isLoading: boolean;
  event: any;
  showCompletionDialog: boolean;
  isSubmitting: boolean;
}

export interface DraftSession {
  id: string;
  event_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface DraftPick {
  id: string;
  draft_session_id: string;
  team_id: string; // 'team1' or 'team2'
  player_id: string;
  pick_number: number;
  created_at: string;
  player?: Player;
}
