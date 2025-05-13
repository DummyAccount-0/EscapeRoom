import React from 'react';
import { Team } from '../types';

interface LeaderboardProps {
  teams: Team[];
  currentTeamId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ teams, currentTeamId }) => {
  // Sort teams by level (highest first) and then by startTime (earliest first for tiebreakers)
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.currentLevel !== a.currentLevel) {
      return b.currentLevel - a.currentLevel;
    }
    return a.startTime && b.startTime 
      ? a.startTime.getTime() - b.startTime.getTime() 
      : 0;
  });

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-md">
      <h3 className="text-xl font-bold text-purple-400 mb-4">Team Progress</h3>
      <div className="overflow-y-auto max-h-80">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-gray-400">
            <tr>
              <th scope="col" className="px-3 py-2">Rank</th>
              <th scope="col" className="px-3 py-2">Team</th>
              <th scope="col" className="px-3 py-2">Level</th>
              <th scope="col" className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr 
                key={team.id} 
                className={`border-t border-gray-700 ${team.id === currentTeamId ? 'bg-purple-900/30' : ''}`}
              >
                <td className="px-3 py-2 text-gray-300">{index + 1}</td>
                <td className="px-3 py-2 font-medium text-white">
                  {team.id === currentTeamId ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {team.name}
                    </span>
                  ) : team.name}
                </td>
                <td className="px-3 py-2 text-gray-300">
                  {team.currentLevel > 10 ? 'Complete' : team.currentLevel}
                </td>
                <td className="px-3 py-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${team.currentLevel > 10 ? 'bg-green-500' : 'bg-purple-500'}`}
                      style={{ width: `${Math.min(100, (team.currentLevel / 10) * 100)}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;