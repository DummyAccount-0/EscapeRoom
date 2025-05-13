import React from 'react';

interface LevelIndicatorProps {
  currentLevel: number;
  completedLevels: number[];
  totalLevels: number;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ 
  currentLevel, 
  completedLevels, 
  totalLevels 
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-xl font-bold text-purple-400 mb-4">Level Progress</h3>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300">Level {currentLevel}</span>
        <span className="text-gray-300">{completedLevels.length}/{totalLevels} Completed</span>
      </div>
      
      <div className="flex space-x-1">
        {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => {
          let status = 'upcoming';
          if (completedLevels.includes(level)) {
            status = 'completed';
          } else if (level === currentLevel) {
            status = 'current';
          }
          
          return (
            <div 
              key={level}
              className={`flex-1 h-2 rounded-full ${
                status === 'completed' ? 'bg-green-500' :
                status === 'current' ? 'bg-purple-500' :
                'bg-gray-600'
              }`}
            />
          );
        })}
      </div>
      
      <div className="grid grid-cols-5 gap-2 mt-4">
        {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => {
          let status = 'upcoming';
          if (completedLevels.includes(level)) {
            status = 'completed';
          } else if (level === currentLevel) {
            status = 'current';
          }
          
          return (
            <div 
              key={level}
              className={`text-center py-1 px-2 rounded ${
                status === 'completed' ? 'bg-green-900/40 text-green-400 border border-green-500/30' :
                status === 'current' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50' :
                'bg-gray-700 text-gray-400'
              }`}
            >
              {level}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelIndicator;