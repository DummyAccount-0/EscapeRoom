import React from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import WelcomePage from './pages/WelcomePage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import CompletionPage from './pages/CompletionPage';

const GameRouter: React.FC = () => {
  const { gameState } = useGame();

  // Render the appropriate page based on game state
  switch (gameState) {
    case 'welcome':
      return <WelcomePage />;
    case 'registration':
      return <RegistrationPage />;
    case 'home':
      return <HomePage />;
    case 'room':
      return <RoomPage />;
    case 'complete':
      return <CompletionPage />;
    default:
      return <WelcomePage />;
  }
};

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <GameRouter />
      </div>
    </GameProvider>
  );
}

export default App;