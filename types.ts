export enum AppStage {
  DISGUISE = 'DISGUISE',
  TRANSITION = 'TRANSITION',
  RELATIONSHIP_QUIZ = 'RELATIONSHIP_QUIZ',
  DOTA_GAME = 'DOTA_GAME',
  LOTUS_GAME = 'LOTUS_GAME',
  TRAP_QUESTION = 'TRAP_QUESTION',
  FINALE = 'FINALE',
}

export interface Question {
  id: string;
  text: string;
  image?: string; // URL for the memory photo
  memoryTitle?: string; // Title for the memory (e.g. "Memory Unlocked: Sleeping Mode")
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    response?: string; // Witty response if chosen
  }[];
  timeoutSeconds?: number; // Time before threat
  threatMessage?: string;
}

export interface GameState {
  stage: AppStage;
  score: number;
  wrongAnswers: number;
  currentQuestionIndex: number;
  isThreatActive: boolean;
}