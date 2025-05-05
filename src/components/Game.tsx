import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { usePixiApp } from '../hooks/usePixiApp';
import GameUI from './GameUI';
import JoinModal from './JoinModal';
import GameOverModal from './GameOverModal';
import Notifications from './Notifications';

const Game: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const { hoveredObject } = usePixiApp(pixiContainerRef);
  
  const showJoinModal = useGameStore(state => state.showJoinModal);
  const showGameOverModal = useGameStore(state => state.showGameOverModal);
  const gameState = useGameStore(state => state.gameState);
  const activeInteraction = useGameStore(state => state.activeInteraction);
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Pixi container - game canvas goes here */}
      <div 
        ref={pixiContainerRef} 
        className="w-full h-full"
      />
      
      {/* Game UI overlay */}
      <GameUI hoveredObject={hoveredObject} />
      
      {/* Modals */}
      {showJoinModal && <JoinModal />}
      {showGameOverModal && <GameOverModal />}
      
      {/* Interaction panels */}
      {activeInteraction && <InteractionPanel objectId={activeInteraction} />}
      
      {/* Notifications */}
      <Notifications />
      
      {/* Timer display */}
      {gameState?.gameStarted && !gameState?.gameOver && (
        <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-md">
          <p className="text-xl font-bold">
            {formatTime(gameState.timeRemaining)}
          </p>
        </div>
      )}
    </div>
  );
};

// Format time from seconds to MM:SS
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Interaction Panel Component
const InteractionPanel: React.FC<{ objectId: string }> = ({ objectId }) => {
  const gameState = useGameStore(state => state.gameState);
  const roomId = useGameStore(state => state.roomId);
  const inventory = useGameStore(state => state.inventory);
  const setActiveInteraction = useGameStore(state => state.setActiveInteraction);
  
  // Function to handle interaction form submissions
  const handleInteraction = (action: string, data: any) => {
    if (!roomId || !gameState) return;
    
    import('../services/socketService').then(({ socketService }) => {
      socketService.interact({
        roomId,
        objectId,
        action,
        data
      });
      
      // Close the interaction panel
      setActiveInteraction(null);
    });
  };
  
  let panelContent;
  
  switch (objectId) {
    case 'keypad':
      panelContent = <KeypadPanel onSubmit={handleInteraction} />;
      break;
    case 'lockbox':
      panelContent = <LockboxPanel onSubmit={handleInteraction} hasKey={inventory.includes('key')} />;
      break;
    case 'bookshelf':
      panelContent = <BookshelfPanel onSubmit={handleInteraction} />;
      break;
    case 'door':
      panelContent = (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Exit Door</h3>
          <p className="mb-4">This door leads to freedom. Solve all puzzles to unlock it.</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            onClick={() => setActiveInteraction(null)}
          >
            Close
          </button>
        </div>
      );
      break;
    default:
      panelContent = (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Unknown Object</h3>
          <p className="mb-4">This object doesn't seem to do anything.</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            onClick={() => setActiveInteraction(null)}
          >
            Close
          </button>
        </div>
      );
  }
  
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-lg w-80">
      {panelContent}
    </div>
  );
};

// Keypad Interaction Panel
const KeypadPanel: React.FC<{ onSubmit: (action: string, data: any) => void }> = ({ onSubmit }) => {
  const [code, setCode] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit('enterCode', { code });
  };
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Keypad</h3>
      <p className="mb-4">Enter the correct code to unlock:</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code..."
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={4}
        />
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              type="button"
              className="p-2 bg-gray-600 rounded hover:bg-gray-500"
              onClick={() => setCode(prev => prev.length < 4 ? prev + num : prev)}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            className="p-2 bg-red-600 rounded hover:bg-red-500"
            onClick={() => setCode('')}
          >
            Clear
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => useGameStore.getState().setActiveInteraction(null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// Lockbox Interaction Panel
const LockboxPanel: React.FC<{ 
  onSubmit: (action: string, data: any) => void,
  hasKey: boolean
}> = ({ onSubmit, hasKey }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Lockbox</h3>
      <p className="mb-4">
        {hasKey 
          ? "You have a key that might fit this lockbox." 
          : "This lockbox is locked. You need to find a key."}
      </p>
      
      <div className="flex space-x-2">
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => useGameStore.getState().setActiveInteraction(null)}
        >
          Cancel
        </button>
        
        {hasKey && (
          <button
            type="button"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onSubmit('useKey', { itemId: 'key' })}
          >
            Use Key
          </button>
        )}
      </div>
    </div>
  );
};

// Bookshelf Interaction Panel
const BookshelfPanel: React.FC<{ onSubmit: (action: string, data: any) => void }> = ({ onSubmit }) => {
  const [combination, setCombination] = React.useState<number[]>([1, 1, 1, 1]);
  
  const updateCombination = (index: number, value: number) => {
    const newCombination = [...combination];
    newCombination[index] = value;
    setCombination(newCombination);
  };
  
  const handleSubmit = () => {
    onSubmit('arrangeBooks', { combination });
  };
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Bookshelf</h3>
      <p className="mb-4">Arrange the books in the correct order:</p>
      
      <div className="flex space-x-2 mb-4">
        {combination.map((value, index) => (
          <div key={index} className="flex-1">
            <select
              value={value}
              onChange={(e) => updateCombination(index, parseInt(e.target.value))}
              className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => useGameStore.getState().setActiveInteraction(null)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Arrange
        </button>
      </div>
    </div>
  );
};

export default Game;