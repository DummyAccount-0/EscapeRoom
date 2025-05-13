import React from 'react';
import { useGame } from '../contexts/GameContext';
import TeamRegistrationForm from '../components/TeamRegistrationForm';
import { ArrowLeft, BookOpen } from 'lucide-react';

const RegistrationPage: React.FC = () => {
  const { registerTeam, setGameState } = useGame();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container px-4 py-10 mx-auto">
        <button 
          onClick={() => setGameState('welcome')}
          className="flex items-center mb-6 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" /> Back to Welcome
        </button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-800/60 p-6 rounded-lg shadow-md backdrop-blur-sm mb-6">
              <div className="flex items-center mb-4">
                <BookOpen size={24} className="text-purple-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">Rules & Guidelines</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Team Structure</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Teams can have 1-4 members</li>
                    <li>Each team needs a unique team name</li>
                    <li>All members should contribute to puzzle-solving</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Game Format</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The game consists of 10 levels of increasing difficulty</li>
                    <li>Each level has a technical puzzle to solve</li>
                    <li>Teams must solve all 10 puzzles to escape</li>
                    <li>Each puzzle has a hint available if you get stuck</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Anti-Cheating Measures</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The game runs in full-screen mode</li>
                    <li>Switching tabs will reset your current level</li>
                    <li>Each team's progress is tracked and displayed</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Completion</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Upon completing all 10 levels, you'll receive a secret code</li>
                    <li>This code proves you've escaped the Tech Escape Room</li>
                    <li>Completion times are recorded for the leaderboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <TeamRegistrationForm onRegister={registerTeam} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;