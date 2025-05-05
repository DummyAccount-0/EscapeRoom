import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../stores/gameStore';
import { 
  RoomJoinedEvent, 
  PlayerJoinedEvent, 
  PlayerMovedEvent,
  InteractionData, 
  InteractionResult,
  GameStartedEvent,
  UpdateTimerEvent,
  GameOverEvent
} from '../types';

// This would be the URL of your deployed WebSocket server
const SOCKET_SERVER_URL = 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    
    this.socket = io(SOCKET_SERVER_URL);
    this.setupEventListeners();
    this.initialized = true;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      useGameStore.getState().setConnected(true);
      useGameStore.getState().setConnectionError(null);
    });

    this.socket.on('connect_error', (error) => {
      useGameStore.getState().setConnected(false);
      useGameStore.getState().setConnectionError('Failed to connect to the game server');
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', () => {
      useGameStore.getState().setConnected(false);
      useGameStore.getState().addNotification('Disconnected from server', 'error');
    });

    // Game events
    this.socket.on('roomJoined', (data: RoomJoinedEvent) => {
      useGameStore.getState().setRoomInfo(data.roomId, data.playerId);
      useGameStore.getState().setPlayers(data.players);
      useGameStore.getState().setGameState(data.gameState);
      useGameStore.getState().setShowJoinModal(false);
      useGameStore.getState().addNotification(`Joined room: ${data.roomId}`, 'success');
    });

    this.socket.on('playerJoined', (data: PlayerJoinedEvent) => {
      useGameStore.getState().addPlayer(data.player);
      useGameStore.getState().addNotification(`${data.player.name} joined the game`, 'info');
    });

    this.socket.on('playerLeft', ({ playerId }: { playerId: string }) => {
      const playerName = useGameStore.getState().players.get(playerId)?.name || 'A player';
      useGameStore.getState().removePlayer(playerId);
      useGameStore.getState().addNotification(`${playerName} left the game`, 'info');
    });

    this.socket.on('playerMoved', (data: PlayerMovedEvent) => {
      useGameStore.getState().updatePlayerPosition(data.playerId, data.position);
    });

    this.socket.on('interactionResult', (data: InteractionResult) => {
      const { result } = data;
      useGameStore.getState().addNotification(result.message, result.success ? 'success' : 'error');
      
      if (result.success && result.puzzleId) {
        useGameStore.getState().updatePuzzleState(result.puzzleId, true);
      }
      
      if (result.inventory) {
        useGameStore.getState().updateInventory(result.inventory);
      }
    });

    this.socket.on('gameStarted', (data: GameStartedEvent) => {
      useGameStore.getState().setGameState({
        ...useGameStore.getState().gameState!,
        gameStarted: true,
        timeRemaining: data.timeRemaining
      });
      useGameStore.getState().addNotification('The game has started!', 'info');
    });

    this.socket.on('updateTimer', (data: UpdateTimerEvent) => {
      useGameStore.getState().setGameState({
        ...useGameStore.getState().gameState!,
        timeRemaining: data.timeRemaining
      });
    });

    this.socket.on('gameOver', (data: GameOverEvent) => {
      useGameStore.getState().setGameState({
        ...useGameStore.getState().gameState!,
        gameOver: true,
        escaped: data.escaped
      });
      useGameStore.getState().setShowGameOverModal(true);
    });
  }

  // Join a game room
  joinRoom(roomId: string | null, playerName: string, avatarColor: string) {
    if (!this.socket) return;
    
    this.socket.emit('joinRoom', {
      roomId,
      playerName,
      avatarColor
    });
  }

  // Send player movement update
  updatePosition(position: { x: number; y: number }) {
    if (!this.socket) return;
    
    const roomId = useGameStore.getState().roomId;
    if (!roomId) return;
    
    this.socket.emit('playerMove', {
      roomId,
      position
    });
  }

  // Interact with game objects
  interact(interactionData: InteractionData) {
    if (!this.socket) return;
    
    this.socket.emit('interact', interactionData);
  }

  // Start the game
  startGame() {
    if (!this.socket) return;
    
    const roomId = useGameStore.getState().roomId;
    if (!roomId) return;
    
    this.socket.emit('startGame', { roomId });
  }

  // Disconnect from the socket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.initialized = false;
    }
  }
}

export const socketService = new SocketService();