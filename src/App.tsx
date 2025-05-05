import React, { useEffect } from 'react';
import Game from './components/Game';
import { socketService } from './services/socketService';

function App() {
  // Clean up socket connection on unmount
  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Game />
    </div>
  );
}

export default App;