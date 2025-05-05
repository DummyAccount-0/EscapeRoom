import { create } from 'zustand';
import { Player, GameState, Position } from '../types';

interface GameStore {
  // Connection state
  connected: boolean;
  connectionError: string | null;
  
  // Room and player information
  roomId: string | null;
  playerId: string | null;
  players: Map<string, Player>;
  
  // Game state
  gameState: GameState | null;
  
  // Local player state
  playerName: string;
  avatarColor: string;
  inventory: string[];
  
  // UI state
  showJoinModal: boolean;
  showGameOverModal: boolean;
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  activeInteraction: string | null;
  
  // Actions
  setConnected: (connected: boolean) => void;
  setConnectionError: (error: string | null) => void;
  setRoomInfo: (roomId: string, playerId: string) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerPosition: (playerId: string, position: Position) => void;
  setGameState: (gameState: GameState) => void;
  updatePuzzleState: (puzzleId: string, solved: boolean) => void;
  setPlayerInfo: (name: string, avatarColor: string) => void;
  updateInventory: (inventory: string[]) => void;
  setShowJoinModal: (show: boolean) => void;
  setShowGameOverModal: (show: boolean) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  setActiveInteraction: (objectId: string | null) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Connection state
  connected: false,
  connectionError: null,
  
  // Room and player information
  roomId: null,
  playerId: null,
  players: new Map(),
  
  // Game state
  gameState: null,
  
  // Local player state
  playerName: `Player ${Math.floor(Math.random() * 1000)}`,
  avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  inventory: [],
  
  // UI state
  showJoinModal: true,
  showGameOverModal: false,
  notifications: [],
  activeInteraction: null,
  
  // Actions
  setConnected: (connected) => set({ connected }),
  
  setConnectionError: (error) => set({ connectionError: error }),
  
  setRoomInfo: (roomId, playerId) => set({ roomId, playerId }),
  
  setPlayers: (players) => {
    const playersMap = new Map();
    players.forEach(player => playersMap.set(player.id, player));
    set({ players: playersMap });
  },
  
  addPlayer: (player) => set((state) => {
    const newPlayers = new Map(state.players);
    newPlayers.set(player.id, player);
    return { players: newPlayers };
  }),
  
  removePlayer: (playerId) => set((state) => {
    const newPlayers = new Map(state.players);
    newPlayers.delete(playerId);
    return { players: newPlayers };
  }),
  
  updatePlayerPosition: (playerId, position) => set((state) => {
    const newPlayers = new Map(state.players);
    const player = newPlayers.get(playerId);
    if (player) {
      newPlayers.set(playerId, { ...player, position });
    }
    return { players: newPlayers };
  }),
  
  setGameState: (gameState) => set({ gameState }),
  
  updatePuzzleState: (puzzleId, solved) => set((state) => {
    if (!state.gameState) return state;
    
    const newGameState = { ...state.gameState };
    if (puzzleId in newGameState.puzzles) {
      newGameState.puzzles = {
        ...newGameState.puzzles,
        [puzzleId]: {
          ...newGameState.puzzles[puzzleId as keyof typeof newGameState.puzzles],
          solved
        }
      };
    }
    
    return { gameState: newGameState };
  }),
  
  setPlayerInfo: (name, avatarColor) => set({ playerName: name, avatarColor }),
  
  updateInventory: (inventory) => set({ inventory }),
  
  setShowJoinModal: (show) => set({ showJoinModal: show }),
  
  setShowGameOverModal: (show) => set({ showGameOverModal: show }),
  
  addNotification: (message, type) => set((state) => ({
    notifications: [
      ...state.notifications,
      { id: Date.now().toString(), message, type }
    ]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  setActiveInteraction: (objectId) => set({ activeInteraction: objectId })
}));