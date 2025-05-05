// Player types
export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  position: Position;
  inventory: string[];
}

export interface Position {
  x: number;
  y: number;
}

// Game state types
export interface GameState {
  timeRemaining: number;
  puzzles: {
    keypad: PuzzleState & { code: string };
    lockbox: PuzzleState & { requires: string };
    bookshelf: PuzzleState & { combination: number[] };
    finalDoor: PuzzleState & { requires: string[] };
  };
  inventory: Record<string, boolean>;
  gameStarted: boolean;
  gameOver: boolean;
  escaped: boolean;
}

export interface PuzzleState {
  solved: boolean;
}

// Socket event types
export interface RoomJoinedEvent {
  roomId: string;
  playerId: string;
  players: Player[];
  gameState: GameState;
}

export interface PlayerJoinedEvent {
  player: Player;
}

export interface PlayerMovedEvent {
  playerId: string;
  position: Position;
}

export interface InteractionData {
  roomId: string;
  objectId: string;
  action: string;
  data: any;
}

export interface InteractionResult {
  playerId: string;
  objectId: string;
  action: string;
  result: {
    success: boolean;
    message: string;
    puzzleId?: string;
    solved?: boolean;
    inventory?: string[];
  };
}

export interface GameStartedEvent {
  timeRemaining: number;
}

export interface UpdateTimerEvent {
  timeRemaining: number;
}

export interface GameOverEvent {
  escaped: boolean;
}