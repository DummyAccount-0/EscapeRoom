import React, { useState, useEffect } from 'react';
import { Puzzle } from '../types';
import { Lightbulb, AlertCircle } from 'lucide-react';

interface PuzzleCardProps {
  puzzle: Puzzle;
  onAnswerSubmit: (answer: string) => void;
  showHint: boolean;
  onToggleHint: () => void;
  answerResult: 'correct' | 'incorrect' | null;
}

const PuzzleCard: React.FC<PuzzleCardProps> = ({ 
  puzzle, 
  onAnswerSubmit, 
  showHint, 
  onToggleHint,
  answerResult
}) => {
  const [answer, setAnswer] = useState('');
  
  useEffect(() => {
    setAnswer('');
  }, [puzzle.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswerSubmit(answer);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl max-w-3xl w-full mx-auto">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 p-2 bg-purple-600 text-white text-sm font-bold rounded-br-lg z-10">
          Level {puzzle.level}
        </div>
        {puzzle.code ? (
          <pre className="p-4 pt-10 overflow-x-auto bg-gray-900 text-green-300 text-sm font-mono">
            <code>{puzzle.code}</code>
          </pre>
        ) : puzzle.imageUrl && (
          <img 
            src={puzzle.imageUrl} 
            alt="Puzzle" 
            className="w-full h-64 object-cover object-center pt-8"
          />
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-4">{puzzle.question}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className={`w-full p-3 bg-gray-700 border ${
              answerResult === 'correct' ? 'border-green-500' :
              answerResult === 'incorrect' ? 'border-red-500' :
              'border-gray-600'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onToggleHint}
              className="flex items-center text-yellow-400 hover:text-yellow-300"
            >
              <Lightbulb size={18} className="mr-1" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Submit Answer
            </button>
          </div>
        </form>
        
        {showHint && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
            <div className="flex items-start">
              <Lightbulb size={20} className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
              <p className="text-yellow-300">{puzzle.hint}</p>
            </div>
          </div>
        )}
        
        {answerResult === 'correct' && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-600/30 rounded-lg">
            <p className="text-green-400 font-medium">Correct! Moving to the next level...</p>
          </div>
        )}
        
        {answerResult === 'incorrect' && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-600/30 rounded-lg flex items-start">
            <AlertCircle size={20} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-red-400">Incorrect answer. Try again!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleCard;
