export interface TeamMember {
  name: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  currentLevel: number;
  completedLevels: number[];
  startTime?: Date;
  endTime?: Date;
}

export interface Puzzle {
  id: number;
  level: number;
  type: 'text' | 'image' | 'code';
  question: string;
  imageUrl?: string;
  answer: string[];
  hint: string;
}

export interface SecretCode {
  id: number;
  code: string;
}