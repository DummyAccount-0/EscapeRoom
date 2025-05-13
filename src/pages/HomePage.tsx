import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Play, User, Users, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  const { setGameState, currentTeam } = useGame();

  if (!currentTeam) {
    setGameState('registration');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg backdrop-blur-sm mb-8">
            <h1 className="text-4xl font-bold text-white mb-6">Welcome, Team {currentTeam.name}!</h1>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-700/60 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                  <Users size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Team Size</p>
                  <p className="text-white font-semibold">{currentTeam.members.length} Members</p>
                </div>
              </div>
              
              <div className="bg-gray-700/60 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                  <User size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Team Lead</p>
                  <p className="text-white font-semibold">{currentTeam.members[0]?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="bg-gray-700/60 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                  <Clock size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Challenge</p>
                  <p className="text-white font-semibold">10 Levels</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Mission Briefing</h2>
              <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-700 text-gray-300 space-y-4">
                <p>
                  Welcome to the Tech Escape Room, an elite challenge designed to test the brightest minds in technology.
                </p>
                <p>
                  Your team has been locked in a virtual server complex with 10 levels of security. Each level is protected by a technical puzzle that you must solve to advance.
                </p>
                <p>
                  The puzzles will test your knowledge of programming, algorithms, databases, networks, security, and system architecture. Work together to analyze each challenge and find the correct solution.
                </p>
                <p>
                  Beware: The security system is watching. If you try to cheat by leaving the full-screen mode or switching tabs, the current level will reset.
                </p>
                <p>
                  Complete all 10 levels to escape and receive your unique secret code proving your team's technical prowess.
                </p>
                <p className="font-semibold text-purple-300">
                  Are you ready to begin the challenge?
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setGameState('room')}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg shadow-lg flex items-center hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                <Play size={20} className="mr-2" /> Start the Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;