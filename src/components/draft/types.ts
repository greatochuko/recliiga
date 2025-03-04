
export interface ColorOption {
  name: string;
  value: string;
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  position: string;
  rating: number;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  players: Player[];
  isEditing: boolean;
  captain: string | null;
  confirmed?: boolean;
}

export interface DraftHistoryItem {
  player: Player;
  teamIndex: number;
}
