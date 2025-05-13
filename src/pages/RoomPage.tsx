import React, { useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAntiCheat } from '../hooks/useAntiCheat';
import PuzzleCard from '../components/PuzzleCard';
import LevelIndicator from '../components/LevelIndicator';
import Leaderboard from '../components/Leaderboard';
import { DoorOpen as Door, AlertTriangle } from 'lucide-react';

const RoomPage: React.FC = () => {
  const {
    currentTeam,
    currentPuzzle,
    currentLevel,
    teams,
    resetLevel,
    submitAnswer,
    showHint,
    toggleHint,
    answerResult,
    setGameState
  } = useGame();

  const { requestFullScreen } = useAntiCheat(() => {
    alert("You left full screen or switched tabs! Why did you do that?, You are being monitored.");
    resetLevel();
  });

  const roomPageRef = useRef<HTMLDivElement>(null);
  const isFullscreen = useRef(false);

  useEffect(() => {
    const attemptFullscreen = () => {
      if (!document.fullscreenElement) {
        requestFullScreen();
        isFullscreen.current = true;
      }
    };

    attemptFullscreen();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        isFullscreen.current = false;
        setTimeout(attemptFullscreen, 2000); // Attempt re-fullscreen after 2 seconds
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        if (roomPageRef.current) {
          const firstInput = roomPageRef.current.querySelector('input[type="text"], button');
          if (firstInput) {
            firstInput.focus();
          }
        }
      }
      if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v')) {
        event.preventDefault();
        alert('Copying and pasting are not allowed.');
      }
    };

    const handleFullscreenChange = () => {
      isFullscreen.current = !!document.fullscreenElement;
      if (!isFullscreen.current) {
        setTimeout(attemptFullscreen, 4000); // Attempt re-fullscreen after 4 seconds
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      alert('Right-click menu is disabled.');
    };
    document.addEventListener('contextmenu', handleContextMenu);

    document.body.classList.add('no-copy');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.body.classList.remove('no-copy');
    };
  }, [requestFullScreen]);

  if (!currentTeam) {
    setGameState('registration');
    return null;
  }

  if (currentLevel > 10) {
    setGameState('complete');
    return null;
  }

  const getRoomName = (level: number): string => {
    switch (level) {
      case 1:
        return 'Sub-Level Zero';
      case 2:
        return 'Biohazard Containment';
      case 3:
        return 'Experimental Lab';
      case 4:
        return 'Research Archives';
      case 5:
        return 'Security Control Room';
      case 6:
        return 'Ventilation System';
      case 7:
        return 'Maintenance Corridor';
      case 8:
        return 'Outer Perimeter';
      case 9:
        return 'Emergency Exit Hallway';
      case 10:
        return 'Freedom!';
      default:
        return `Sector ${level}`;
    }
  };

  const currentRoomName = getRoomName(currentLevel);

  return (
    <div ref={roomPageRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-y-auto py-8">
      <style>
        {`
          .no-copy {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}
      </style>
      <div className="container px-4 mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Level {currentLevel}: <span className="text-purple-400">{currentRoomName}</span>
          </h1>
          <p className="text-gray-300">Solve the puzzle to unlock the door to the next level</p>
          <p className="text-gray-300">If you are stuck and need help, you can approach the co-ordinators</p>
          <p className="text-gray-300">Remember the sayings. Who knows what you learned in the previous Room</p>
        </div>

        <div className="fixed top-4 right-4 flex items-center bg-red-900/80 text-red-300 px-3 py-2 rounded-lg text-sm">
          <AlertTriangle size={16} className="mr-1" />
          <span>Don't exit full screen or switch tabs!</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentPuzzle ? (
              <>
                <PuzzleCard
                  puzzle={currentPuzzle}
                  onAnswerSubmit={submitAnswer}
                  showHint={showHint}
                  onToggleHint={toggleHint}
                  answerResult={answerResult}
                />

                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <Door size={24} className="text-purple-400 mr-2" />
                    <h3 className="text-xl font-bold text-white">Current Challenge</h3>
                  </div>
                  <p className="text-gray-300">
                    You are currently in Level {currentLevel} of the Tech Escape Room. Solve this
                    puzzle to unlock the door to Level {currentLevel + 1}. Type your answer in the
                    input field above and submit it to check if it's correct.
                  </p>
                  {currentLevel === 10 && (
                    <p className="mt-3 text-yellow-400">
                      This is the final level! Complete this challenge to escape the room.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center h-64">
                <p className="text-gray-300">Loading puzzle...</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <LevelIndicator
              currentLevel={currentLevel}
              completedLevels={currentTeam.completedLevels}
              totalLevels={10}
            />

            <Leaderboard teams={teams} currentTeamId={currentTeam.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;