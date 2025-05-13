import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { Home, Award, Clock, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const CompletionPage: React.FC = () => {
  const { currentTeam, secretCode, resetGame } = useGame();
  const { exitFullScreen } = useAntiCheat(() => {});
  const [copied, setCopied] = useState(false);

  // Calculate completion time
  const getCompletionTime = () => {
    if (!currentTeam?.startTime || !currentTeam?.endTime) return 'N/A';
    
    const startTime = new Date(currentTeam.startTime).getTime();
    const endTime = new Date(currentTeam.endTime).getTime();
    const timeDiff = endTime - startTime;
    
    // Format time
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
  };

  const copyToClipboard = () => {
    if (secretCode) {
      navigator.clipboard.writeText(secretCode.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Exit full screen when component mounts
  useEffect(() => {
    exitFullScreen();
  }, []);

  if (!currentTeam || !secretCode) {
    resetGame();
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 px-4 py-12">
      <div className="max-w-3xl w-full bg-gray-800/80 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="bg-purple-900/60 p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Escape Successful!</h1>
          <p className="text-xl text-purple-200">Congratulations, Team {currentTeam.name}!</p>
        </div>
        
        <div className="p-8">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-gray-700/60 p-4 rounded-lg flex items-center min-w-[180px]">
              <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                <Award size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Difficulty</p>
                <p className="text-white font-semibold">All 10 Levels</p>
              </div>
            </div>
            
            <div className="bg-gray-700/60 p-4 rounded-lg flex items-center min-w-[180px]">
              <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                <Clock size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completion Time</p>
                <p className="text-white font-semibold">{getCompletionTime()}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-xl text-gray-300 mb-6">
              You've successfully completed all 10 levels of the Tech Escape Room challenge! Your team has demonstrated exceptional technical prowess and problem-solving abilities.
            </p>
            
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/30 mb-6 max-w-xl mx-auto">
              <p className="text-gray-400 mb-3">Your Secret Escape Code:</p>
              <div className="flex items-center justify-center">
                <div className="bg-purple-900/30 px-4 py-3 rounded border border-purple-500/50 text-2xl font-mono text-purple-300 tracking-wider mr-2">
                  {secretCode.code}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
            
            <p className="text-gray-300">
              Use this code to verify your completion. This code is unique to your team's successful escape.
            </p>
          </div>
          
          <div className="text-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg flex items-center mx-auto hover:shadow-xl transition-all duration-300"
            >
              <Home size={18} className="mr-2" /> Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;