import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

// Create a new HTTP server
const httpServer = createServer();

// Create a new Socket.IO server instance
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store active game rooms
const gameRooms = new Map();

// Initialize a new game room
function createGameRoom(roomId) {
  if (!gameRooms.has(roomId)) {
    gameRooms.set(roomId, {
      id: roomId,
      players: new Map(),
      gameState: {
        timeRemaining: 60 * 10, // 10 minutes in seconds
        puzzles: {
          keypad: { solved: false, code: '1234' },
          lockbox: { solved: false, requires: 'key' },
          bookshelf: { solved: false, combination: [3, 1, 4, 2] },
          finalDoor: { solved: false, requires: ['keypad', 'lockbox', 'bookshelf'] }
        },
        inventory: {},
        gameStarted: false,
        gameOver: false,
        escaped: false
      },
      timer: null
    });
  }
  return gameRooms.get(roomId);
}

// Update the game state timer
function updateGameTimer(roomId) {
  const room = gameRooms.get(roomId);
  if (!room || !room.gameState.gameStarted || room.gameState.gameOver) return;

  room.gameState.timeRemaining -= 1;
  
  if (room.gameState.timeRemaining <= 0) {
    room.gameState.timeRemaining = 0;
    room.gameState.gameOver = true;
    clearInterval(room.timer);
    
    // Notify all players that time's up
    io.to(roomId).emit('gameOver', { escaped: false });
  }
  
  io.to(roomId).emit('updateTimer', { timeRemaining: room.gameState.timeRemaining });
}

// Check if all puzzles are solved
function checkGameCompletion(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return false;
  
  const { puzzles } = room.gameState;
  const allSolved = puzzles.keypad.solved && 
                    puzzles.lockbox.solved && 
                    puzzles.bookshelf.solved;
                    
  if (allSolved && !puzzles.finalDoor.solved) {
    puzzles.finalDoor.solved = true;
    room.gameState.escaped = true;
    room.gameState.gameOver = true;
    
    clearInterval(room.timer);
    io.to(roomId).emit('gameOver', { escaped: true });
    return true;
  }
  
  return puzzles.finalDoor.solved;
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join or create game room
  socket.on('joinRoom', ({ roomId, playerName, avatarColor }) => {
    // Generate room ID if not provided
    if (!roomId) {
      roomId = uuidv4().substring(0, 6);
    }
    
    const room = createGameRoom(roomId);
    socket.join(roomId);
    
    // Add player to the room
    const playerId = socket.id;
    room.players.set(playerId, {
      id: playerId,
      name: playerName || `Player ${room.players.size + 1}`,
      avatarColor: avatarColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      position: { x: 400, y: 300 },
      inventory: []
    });
    
    // Send room info to the player
    socket.emit('roomJoined', {
      roomId,
      playerId,
      players: Array.from(room.players.values()),
      gameState: room.gameState
    });
    
    // Notify other players about the new player
    socket.to(roomId).emit('playerJoined', {
      player: room.players.get(playerId)
    });
    
    console.log(`Player ${playerId} joined room ${roomId}`);
  });
  
  // Handle player movement
  socket.on('playerMove', ({ roomId, position }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    const player = room.players.get(socket.id);
    if (!player) return;
    
    player.position = position;
    
    // Broadcast player movement to other players
    socket.to(roomId).emit('playerMoved', {
      playerId: socket.id,
      position
    });
  });
  
  // Handle interaction with game objects
  socket.on('interact', ({ roomId, objectId, action, data }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    let result = { success: false, message: 'Invalid interaction' };
    
    // Process different interactions based on object and action
    if (objectId === 'keypad' && action === 'enterCode') {
      const { code } = data;
      const keypad = room.gameState.puzzles.keypad;
      
      if (keypad.solved) {
        result = { success: false, message: 'Keypad already solved' };
      } else if (code === keypad.code) {
        keypad.solved = true;
        result = { 
          success: true, 
          message: 'Keypad unlocked!',
          puzzleId: 'keypad',
          solved: true
        };
        checkGameCompletion(roomId);
      } else {
        result = { success: false, message: 'Incorrect code' };
      }
    } else if (objectId === 'lockbox' && action === 'useKey') {
      const lockbox = room.gameState.puzzles.lockbox;
      
      if (lockbox.solved) {
        result = { success: false, message: 'Lockbox already opened' };
      } else if (data.itemId === 'key') {
        lockbox.solved = true;
        result = { 
          success: true, 
          message: 'Lockbox opened!',
          puzzleId: 'lockbox',
          solved: true
        };
        checkGameCompletion(roomId);
      } else {
        result = { success: false, message: 'Wrong item' };
      }
    } else if (objectId === 'bookshelf' && action === 'arrangeBooks') {
      const { combination } = data;
      const bookshelf = room.gameState.puzzles.bookshelf;
      
      if (bookshelf.solved) {
        result = { success: false, message: 'Bookshelf puzzle already solved' };
      } else if (JSON.stringify(combination) === JSON.stringify(bookshelf.combination)) {
        bookshelf.solved = true;
        result = { 
          success: true, 
          message: 'Bookshelf mechanism activated!',
          puzzleId: 'bookshelf',
          solved: true
        };
        checkGameCompletion(roomId);
      } else {
        result = { success: false, message: 'Wrong combination' };
      }
    } else if (objectId === 'item' && action === 'pickup') {
      const { itemId } = data;
      const player = room.players.get(socket.id);
      
      if (!player.inventory.includes(itemId)) {
        player.inventory.push(itemId);
        result = { 
          success: true, 
          message: `Picked up ${itemId}`,
          inventory: player.inventory
        };
      } else {
        result = { success: false, message: 'Item already in inventory' };
      }
    }
    
    // Broadcast interaction result to all players in the room
    io.to(roomId).emit('interactionResult', {
      playerId: socket.id,
      objectId,
      action,
      result
    });
  });
  
  // Start the game
  socket.on('startGame', ({ roomId }) => {
    const room = gameRooms.get(roomId);
    if (!room || room.gameState.gameStarted) return;
    
    room.gameState.gameStarted = true;
    room.timer = setInterval(() => updateGameTimer(roomId), 1000);
    
    io.to(roomId).emit('gameStarted', { timeRemaining: room.gameState.timeRemaining });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove player from their room
    for (const [roomId, room] of gameRooms.entries()) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        
        // Notify other players about the disconnection
        socket.to(roomId).emit('playerLeft', {
          playerId: socket.id
        });
        
        console.log(`Player ${socket.id} left room ${roomId}`);
        
        // Clean up empty rooms
        if (room.players.size === 0) {
          if (room.timer) {
            clearInterval(room.timer);
          }
          gameRooms.delete(roomId);
          console.log(`Room ${roomId} deleted`);
        }
        
        break;
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});