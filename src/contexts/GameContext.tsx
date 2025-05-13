import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, Puzzle, TeamMember, SecretCode } from '../types';
import { getRandomPuzzle } from '../data/puzzles';
import { getRandomSecretCode } from '../data/secretCodes';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, query, orderBy, doc } from 'firebase/firestore';

type GameState = 'welcome' | 'registration' | 'home' | 'room' | 'complete';

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  currentTeam: Team | null;
  registerTeam: (name: string, members: TeamMember[]) => void;
  currentLevel: number;
  currentPuzzle: Puzzle | null;
  teams: Team[];
  checkAnswer: (answer: string) => boolean;
  hint: string;
  showHint: boolean;
  toggleHint: () => void;
  advanceLevel: () => void;
  secretCode: SecretCode | null;
  resetLevel: () => void;
  createMockTeams: () => void;
  resetGame: () => void;
  submitAnswer: (answer: string) => void;
  answerResult: 'correct' | 'incorrect' | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [secretCode, setSecretCode] = useState<SecretCode | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);

  // Subscribe to teams collection
  useEffect(() => {
    const q = query(collection(db, 'teams'), orderBy('currentLevel', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData: Team[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        teamsData.push({
          ...data,
          id: doc.id,
          startTime: data.startTime?.toDate(),
          endTime: data.endTime?.toDate()
        } as Team);
      });
      setTeams(teamsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentLevel > 0 && currentLevel <= 10) {
      setCurrentPuzzle(getRandomPuzzle(currentLevel));
    } else if (currentLevel > 10) {
      setGameState('complete');
      setSecretCode(getRandomSecretCode());
      
      if (currentTeam) {
        const updatedTeam = {
          ...currentTeam,
          endTime: new Date(),
          currentLevel: 11,
        };
        setCurrentTeam(updatedTeam);
        
        // Update Firebase
        const teamRef = doc(db, 'teams', updatedTeam.id);
        updateDoc(teamRef, {
          endTime: updatedTeam.endTime,
          currentLevel: updatedTeam.currentLevel
        });
      }
    }
  }, [currentLevel]);

  const registerTeam = async (name: string, members: TeamMember[]) => {
    const newTeam: Team = {
      id: uuidv4(),
      name,
      members,
      currentLevel: 1,
      completedLevels: [],
      startTime: new Date()
    };
    
    // Add to Firebase
    const docRef = await addDoc(collection(db, 'teams'), newTeam);
    newTeam.id = docRef.id;
    
    setCurrentTeam(newTeam);
    setCurrentLevel(1);
    setGameState('home');
  };

  const checkAnswer = (answer: string): boolean => {
    if (!currentPuzzle) return false;
    const normalizedAnswer = answer.trim().toLowerCase();
    return currentPuzzle.answer.some(a => a.toLowerCase() === normalizedAnswer);
  };

  const submitAnswer = (answer: string) => {
    const isCorrect = checkAnswer(answer);
    setAnswerResult(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setTimeout(() => {
        advanceLevel();
        setAnswerResult(null);
      }, 1500);
    } else {
      setTimeout(() => {
        setAnswerResult(null);
      }, 2000);
    }
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  const advanceLevel = async () => {
    if (currentTeam) {
      const updatedTeam = {
        ...currentTeam,
        currentLevel: currentLevel + 1,
        completedLevels: [...currentTeam.completedLevels, currentLevel]
      };
      
      setCurrentTeam(updatedTeam);
      setCurrentLevel(prev => prev + 1);
      
      // Update Firebase
      const teamRef = doc(db, 'teams', updatedTeam.id);
      await updateDoc(teamRef, {
        currentLevel: updatedTeam.currentLevel,
        completedLevels: updatedTeam.completedLevels
      });
    }
  };

  const resetLevel = () => {
    if (currentLevel > 0 && currentLevel <= 10) {
      setCurrentPuzzle(getRandomPuzzle(currentLevel));
      setShowHint(false);
      setAnswerResult(null);
    }
  };

  const resetGame = () => {
    setGameState('welcome');
    setCurrentTeam(null);
    setCurrentLevel(1);
    setCurrentPuzzle(null);
    setSecretCode(null);
    setAnswerResult(null);
    setShowHint(false);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      setGameState,
      currentTeam,
      registerTeam,
      currentLevel,
      currentPuzzle,
      teams,
      checkAnswer,
      hint: currentPuzzle?.hint || '',
      showHint,
      toggleHint,
      advanceLevel,
      secretCode,
      resetLevel,
      createMockTeams: () => {}, // Disabled as we're using real Firebase data
      resetGame,
      submitAnswer,
      answerResult
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};