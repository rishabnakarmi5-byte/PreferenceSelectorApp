import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizStageProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({ question, onAnswer }) => {
  const [timeLeft, setTimeLeft] = useState(question?.timeoutSeconds || 15);
  const [showThreat, setShowThreat] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setTimeLeft(question?.timeoutSeconds || 15);
    setShowThreat(false);
    setFeedback(null);
    setIsSuccess(false);
    setTypedText("");
    setShowOptions(false);
    setShowReward(false);
    setShowContinueBtn(false);
  }, [question]);

  // Typing Effect
  useEffect(() => {
    if (!question) return;
    let i = 0;
    const text = question.text;
    const typingSpeed = 30; 
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typeInterval);
        setShowOptions(true);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [question]);

  // Timer logic - only starts after options are shown
  useEffect(() => {
    if (!showOptions || showThreat || isSuccess || !question || showReward) return;

    if (timeLeft <= 0) {
      setShowThreat(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showThreat, isSuccess, question, showOptions, showReward]);

  const handleChoice = (option: typeof question.options[0]) => {
    if (showThreat || isSuccess || feedback) return;

    if (option.isCorrect) {
      setIsSuccess(true);
      setFeedback(option.response || "Correct!");
      
      // Wait 1.5s then show Continue Button so user can read the text
      setTimeout(() => {
        setShowContinueBtn(true);
      }, 1500);

    } else {
      setIsShake(true);
      setFeedback(option.response || "Wrong!");
      setTimeout(() => setIsShake(false), 500);
      setTimeout(() => setFeedback(null), 3000); 
    }
  };

  const handleContinue = () => {
      // Logic after user clicks Continue
      if (question.image) {
        setShowReward(true);
      } else {
        onAnswer(true);
      }
  };

  const handleNext = () => {
    onAnswer(true);
  };

  const resetThreat = () => {
    setShowThreat(false);
    setTimeLeft(10); 
  };

  // Helper to render mixed fonts
  const renderStyledText = (text: string) => {
    return text.split(' ').map((word, i) => {
       const cleanWord = word.replace(/[^a-zA-Z]/g, '');
       // If word is all caps and length > 1 (e.g. REAL, AIT, HOME)
       const isAllCaps = cleanWord.length > 1 && cleanWord === cleanWord.toUpperCase();
       
       if (isAllCaps) {
          return (
              <span key={i} className="font-comic text-pink-600 tracking-wider text-3xl md:text-4xl mx-1 inline-block transform -rotate-2">
                  {word}
              </span>
          );
       }
       return <span key={i}>{word} </span>;
    });
  };

  if (!question) {
    return <div className="flex items-center justify-center min-h-[100dvh] bg-pink-50 text-pink-400">Loading your love...</div>;
  }

  // Calculate progress
  const progress = Math.max(0, (timeLeft / (question.timeoutSeconds || 15)) * 100);

  if (showReward) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 bg-slate-900 animate-in fade-in duration-700">
             <div className="max-w-md w-full bg-white p-4 rounded-3xl shadow-2xl transform scale-100 transition-transform hover:scale-105">
                 {question.memoryTitle && (
                     <div className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                         {question.memoryTitle}
                     </div>
                 )}
                 <div className="aspect-[3/4] md:aspect-square w-full bg-slate-200 rounded-xl overflow-hidden mb-6 border-4 border-white shadow-inner relative">
                     <img 
                        src={question.image} 
                        alt="Memory" 
                        className="object-cover w-full h-full" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <p className="text-white font-romantic text-2xl md:text-3xl drop-shadow-lg">
                            {feedback}
                        </p>
                     </div>
                 </div>
                 
                 <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold tracking-wide hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                 >
                    <span>Next Memory</span>
                    <span>→</span>
                 </button>
             </div>
        </div>
      );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-[100dvh] p-4 relative bg-pink-50 overflow-hidden transition-colors duration-500 ${isShake ? 'animate-shake' : ''}`}>
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200 rounded-full blur-[100px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col h-full justify-center">
        
        {/* Timer UI - Only show if options are visible */}
        <div className={`mb-8 relative transition-opacity duration-500 ${showOptions ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-between text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">
            <span>Time remaining</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="w-full bg-pink-100/50 rounded-full h-3 backdrop-blur-sm overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'bg-red-500' : 'bg-pink-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
          {/* Question Text with Typing Cursor */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug font-romantic break-words">
            {renderStyledText(typedText)}
            {!showOptions && <span className="animate-pulse ml-1 text-pink-500">|</span>}
          </h2>

          {/* Feedback Overlay inside card */}
          {feedback && !showReward && (
             <div className={`absolute inset-0 flex items-center justify-center p-6 z-20 backdrop-blur-md transition-opacity duration-300 ${isSuccess ? 'bg-green-50/90' : 'bg-red-50/90'}`}>
               <div className="text-center animate-float w-full">
                 <div className={`text-6xl mb-4 ${isSuccess ? 'grayscale-0' : 'grayscale'}`}>
                    {isSuccess ? '❤️' : '🤡'}
                 </div>
                 <p className={`text-xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'} mb-6`}>
                   "{feedback}"
                 </p>
                 
                 {isSuccess && !showContinueBtn && (
                    <p className="text-sm text-pink-500 uppercase tracking-widest animate-pulse">
                        Wait for it...
                    </p>
                 )}

                 {isSuccess && showContinueBtn && (
                    <button 
                        onClick={handleContinue}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-green-700 transition-all animate-in zoom-in slide-in-from-bottom-4 duration-300 shadow-lg"
                    >
                        Continue Game
                    </button>
                 )}
               </div>
             </div>
          )}

          {/* Options */}
          <div className={`space-y-4 transition-all duration-700 ${showOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleChoice(option)}
                className="w-full p-6 text-lg font-medium text-slate-700 bg-white/50 border border-white rounded-2xl hover:bg-white hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100 transition-all duration-300 active:scale-95 flex items-center justify-between group"
              >
                <span className="text-left font-sans">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Modal */}
      {showThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-red-900/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white text-slate-900 p-10 rounded-3xl max-w-sm w-full text-center shadow-2xl border-4 border-red-500 transform scale-105">
            <div className="text-6xl mb-6">🤬</div>
            <h3 className="text-2xl font-black mb-4 uppercase text-red-600">You're too slow!</h3>
            <p className="text-lg font-medium mb-8 text-slate-700 leading-relaxed">
              {question.threatMessage || "Rishab is waiting! Do you want him to starve? Answer the question!"}
            </p>
            <button 
              onClick={resetThreat}
              className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg active:transform active:scale-95"
            >
              I promise to be faster!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};