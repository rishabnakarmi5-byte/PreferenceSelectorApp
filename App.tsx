import React, { useState } from 'react';
import { AppStage, GameState } from './types';
import { DISGUISE_QUESTIONS, RELATIONSHIP_QUESTIONS } from './constants';
import { DisguiseStage } from './components/DisguiseStage';
import { QuizStage } from './components/QuizStage';
import { DotaGame } from './components/DotaGame';
import { LotusGame } from './components/LotusGame';
import { TrapQuestion } from './components/TrapQuestion';
import { Finale } from './components/Finale';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    stage: AppStage.DISGUISE,
    score: 0,
    wrongAnswers: 0,
    currentQuestionIndex: 0,
    isThreatActive: false,
  });

  const handleDisguiseAnswer = (isCorrect: boolean, response?: string) => {
    if (gameState.currentQuestionIndex < DISGUISE_QUESTIONS.length - 1) {
       setGameState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
        setGameState({
            stage: AppStage.RELATIONSHIP_QUIZ,
            score: 0,
            wrongAnswers: 0,
            currentQuestionIndex: 0,
            isThreatActive: false
        });
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
      const currentIndex = gameState.currentQuestionIndex;

      // Logic to interject Games between specific questions
      // Question 1 (Living/Bed) is Index 1. After Q1 -> DOTA GAME
      if (currentIndex === 1) {
          setGameState(prev => ({
              ...prev,
              stage: AppStage.DOTA_GAME
          }));
          return;
      }

      // Question 2 (Food/Suko Teenoi) is Index 2. After Q2 -> LOTUS GAME
      if (currentIndex === 2) {
          setGameState(prev => ({
             ...prev,
             stage: AppStage.LOTUS_GAME
          }));
          return;
      }

      // Proceed normal quiz flow
      if (currentIndex < RELATIONSHIP_QUESTIONS.length - 1) {
          setGameState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
      } else {
          setGameState(prev => ({ ...prev, stage: AppStage.TRAP_QUESTION }));
      }
  };

  const handleDotaComplete = () => {
      setGameState(prev => ({
          ...prev,
          stage: AppStage.RELATIONSHIP_QUIZ,
          currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
  };

  const handleLotusComplete = () => {
      setGameState(prev => ({
          ...prev,
          stage: AppStage.RELATIONSHIP_QUIZ,
          currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
  };

  const handleTrapComplete = () => {
      setGameState(prev => ({ ...prev, stage: AppStage.FINALE }));
  };

  const renderStage = () => {
    switch (gameState.stage) {
      case AppStage.DISGUISE:
        const disguiseQ = DISGUISE_QUESTIONS[gameState.currentQuestionIndex];
        if (!disguiseQ) return <div className="p-10 text-center">Loading Disguise Protocol...</div>;
        return <DisguiseStage 
            question={disguiseQ} 
            onAnswer={handleDisguiseAnswer} 
        />;
      
      case AppStage.RELATIONSHIP_QUIZ:
        const quizQ = RELATIONSHIP_QUESTIONS[gameState.currentQuestionIndex];
        if (!quizQ) {
            if (gameState.currentQuestionIndex >= RELATIONSHIP_QUESTIONS.length) {
               return <TrapQuestion onComplete={handleTrapComplete} />;
            }
            return <div className="p-10 text-center text-pink-500">Loading Question...</div>;
        }
        return <QuizStage 
            question={quizQ} 
            onAnswer={handleQuizAnswer} 
        />;

      case AppStage.DOTA_GAME:
          return <DotaGame onComplete={handleDotaComplete} />;

      case AppStage.LOTUS_GAME:
          return <LotusGame onComplete={handleLotusComplete} />;

      case AppStage.TRAP_QUESTION:
          return <TrapQuestion onComplete={handleTrapComplete} />;
        
      case AppStage.FINALE:
          return <Finale />;
          
      default:
        return <div>Unknown Stage</div>;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-white min-h-[100dvh]">
      {renderStage()}
    </div>
  );
};

export default App;