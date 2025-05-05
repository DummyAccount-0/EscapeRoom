import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { socketService } from '../services/socketService';

interface GameUIProps {
  hoveredObject: string | null;
}

const GameUI: React.FC<GameUIProps> = ({ hoveredObject }) => {
  const gameState = useGameStore(state => state.gameState);
  const roomId = useGameStore(state => state.roomId);
  const players = useGameStore(state => state.players);
  const inventory = useGameStore(state => state.inventory);
  
  // Start the game
  const handleStartGame = () => {
    socketService.startGame();
  };
  
  // Share room link
  const handleShareRoom = () => {
    if (roomId) {
      navigator.clipboard.writeText(`Join my escape room! Room code: ${roomId}`);
      useGameStore.getState().addNotification('Room link copied to clipboard', 'success');
    }
  };
  
  // Render loading state if game state is not available
  if (!gameState) {
    return (
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-md">
        <p>Loading game...</p>
      </div>
    );
  }
  
  return (
    <>
      {/* Room Info Bar */}
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-md">
        <div className="flex items-center space-x-2">
          <span className="font-bold">Room: {roomId}</span>
          <button 
            onClick={handleShareRoom}
            className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            Share
          </button>
        </div>
        <p className="text-sm">Players: {players.size}</p>
      </div>
      
      {/* Object Tooltip */}
      {hoveredObject && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-md">
          <p>{getObjectName(hoveredObject)}</p>
        </div>
      )}
      
      {/* Start Game Button (only if game hasn't started) */}
      {!gameState.gameStarted && (
        <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-md">
          <button 
            onClick={handleStartGame}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Start Game
          </button>
        </div>
      )}
      
      {/* Inventory Panel */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 text-white p-2 rounded-md">
        <h3 className="text-sm font-bold mb-1">Inventory</h3>
        <div className="flex items-center space-x-2">
          {inventory.length === 0 ? (
            <p className="text-xs text-gray-400">Empty</p>
          ) : (
            inventory.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-700 p-2 rounded"
                title={getItemName(item)}
              >
                {getItemIcon(item)}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Puzzle Status Panel */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-80 text-white p-2 rounded-md">
        <h3 className="text-sm font-bold mb-1">Puzzle Status</h3>
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(gameState.puzzles)
            .filter(([id]) => id !== 'finalDoor')
            .map(([id, puzzle]) => (
              <div 
                key={id} 
                className={`text-xs px-2 py-1 rounded ${
                  puzzle.solved 
                    ? 'bg-green-600' 
                    : 'bg-gray-700'
                }`}
              >
                {getPuzzleName(id)}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

// Helper functions to get display names and icons for game objects
const getObjectName = (objectId: string): string => {
  switch (objectId) {
    case 'keypad': return 'Keypad';
    case 'lockbox': return 'Locked Box';
    case 'bookshelf': return 'Bookshelf';
    case 'door': return 'Exit Door';
    case 'key': return 'Key';
    default: return objectId;
  }
};

const getPuzzleName = (puzzleId: string): string => {
  switch (puzzleId) {
    case 'keypad': return 'Keypad';
    case 'lockbox': return 'Lockbox';
    case 'bookshelf': return 'Bookshelf';
    default: return puzzleId;
  }
};

const getItemName = (itemId: string): string => {
  switch (itemId) {
    case 'key': return 'Key';
    default: return itemId;
  }
};

const getItemIcon = (itemId: string): string => {
  switch (itemId) {
    case 'key': return '🔑';
    default: return '?';
  }
};

export default GameUI;