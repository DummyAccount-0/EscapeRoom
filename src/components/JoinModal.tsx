import React, { useState } from 'react';
import { socketService } from '../services/socketService';
import { useGameStore } from '../stores/gameStore';
import { Key } from 'lucide-react';

const JoinModal: React.FC = () => {
  const [playerName, setPlayerName] = useState(useGameStore(state => state.playerName));
  const [roomId, setRoomId] = useState('');
  const [avatarColor, setAvatarColor] = useState(useGameStore(state => state.avatarColor));
  const [isCreating, setIsCreating] = useState(true);
  
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update player info in the store
    useGameStore.getState().setPlayerInfo(playerName, avatarColor);
    
    // Initialize and connect to the socket server
    socketService.initialize();
    
    // Join the room (null roomId creates a new room)
    socketService.joinRoom(isCreating ? null : roomId, playerName, avatarColor);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-full text-white">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Escape Room Challenge
        </h2>
        
        <div className="mb-4 flex border border-gray-600 rounded-md overflow-hidden">
          <button
            className={`flex-1 py-2 ${isCreating ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setIsCreating(true)}
          >
            Create Room
          </button>
          <button
            className={`flex-1 py-2 ${!isCreating ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setIsCreating(false)}
          >
            Join Room
          </button>
        </div>
        
        <form onSubmit={handleJoin}>
          <div className="mb-4">
            <label htmlFor="playerName" className="block text-sm font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={15}
            />
          </div>
          
          {!isCreating && (
            <div className="mb-4">
              <label htmlFor="roomId" className="block text-sm font-medium mb-1">
                Room Code
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isCreating}
                maxLength={6}
              />
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="avatarColor" className="block text-sm font-medium mb-1">
              Avatar Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="avatarColor"
                value={avatarColor}
                onChange={(e) => setAvatarColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <div 
                className="w-10 h-10 rounded-full border-2 border-white"
                style={{ backgroundColor: avatarColor }}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            {isCreating ? 'Create New Game' : 'Join Game'}
          </button>
        </form>
        
        <p className="mt-4 text-xs text-gray-400 text-center">
          Join your friends to solve puzzles and escape together!
        </p>
      </div>
    </div>
  );
};

export default JoinModal;