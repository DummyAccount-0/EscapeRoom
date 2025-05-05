import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { socketService } from '../services/socketService';
import { Trophy, AlertTriangle } from 'lucide-react';

const GameOverModal: React.FC = () => {
  const gameState = useGameStore(state => state.gameState);
  const escaped = gameState?.escaped || false;
  const timeRemaining = gameState?.timeRemaining || 0;
  
  // Calculate time taken (assuming 10 minutes total)
  const totalTimeInSeconds = 10 * 60;
  const timeTaken = totalTimeInSeconds - timeRemaining;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  
  const handlePlayAgain = () => {
    // Clear the game state and reconnect
    socketService.disconnect();
    useGameStore.getState().setShowGameOverModal(false);
    useGameStore.getState().setShowJoinModal(true);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-full text-white">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 ${escaped ? 'bg-green-600' : 'bg-red-600'} rounded-full flex items-center justify-center`}>
            {escaped ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-4">
          {escaped ? 'Congratulations!' : 'Time\'s Up!'}
        </h2>
        
        <p className="text-center mb-6">
          {escaped 
            ? `You escaped in ${minutes}:${seconds.toString().padStart(2, '0')}!` 
            : 'You failed to escape in time.'}
        </p>
        
        {escaped && (
          <div className="bg-gray-700 p-4 rounded-md mb-6">
            <h3 className="font-bold text-lg mb-2">Team Performance</h3>
            <p className="text-sm mb-1">• Time taken: {minutes}m {seconds}s</p>
            <p className="text-sm mb-1">• Time remaining: {Math.floor(timeRemaining / 60)}m {(timeRemaining % 60).toString().padStart(2, '0')}s</p>
            <p className="text-sm">• All puzzles completed successfully</p>
          </div>
        )}
        
        <button
          onClick={handlePlayAgain}
          className="w-full py-3 bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Play Again
        </button>
        
        <p className="mt-4 text-xs text-gray-400 text-center">
          {escaped 
            ? 'Share your achievement with friends!' 
            : 'Better luck next time. Try different strategies!'}
        </p>
      </div>
    </div>
  );
};

export default GameOverModal;