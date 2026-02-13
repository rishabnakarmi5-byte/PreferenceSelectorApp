import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

interface DisguiseStageProps {
  question: Question;
  onAnswer: (isCorrect: boolean, response?: string) => void;
  onStartMainMusic: () => void;
}

const INTRO_TEXTS = [
  { text: "Once upon a time, in the magical country of Thailand...", style: "animate-drama-zoom text-yellow-100 font-serif" },
  { text: "Two asian gays who studied in different universities but lived together didn't speak each other's language...", style: "animate-in slide-in-from-left duration-1000 text-blue-200" },
  { text: "But somehow were able to f*ck a million times...", style: "animate-pulse text-red-500 font-bold text-4xl md:text-6xl font-comic tracking-widest" },
  { text: "And cuddle to sleep naked and fall in love very deep <3...", style: "animate-drama-zoom text-pink-300 font-romantic" },
  { text: "Until.............. they saw a muscle bottom in Grindr..........", style: "animate-glitch text-green-400 font-mono" },
  { text: "......................then they f*cked the muscle bottom together as well. Then they banged many more together on and on <3.", style: "animate-stamp text-purple-400 font-black" },
  { text: "Love, love and more love presents", style: "animate-spin-in text-white italic" },
  { text: "The Ultimate Valentine TEST!", style: "animate-heartbeat text-red-600 font-black text-6xl md:text-8xl drop-shadow-[0_0_25px_rgba(255,0,0,1)]" }
];

// 48 Seconds total timing breakdown
const TIMINGS = [
  5000, // Thailand...
  6000, // Language...
  5000, // F*ck million times...
  7000, // Cuddle deep...
  6000, // Until... muscle bottom
  8000, // Then they f*cked him too
  5000, // Love presents
  6000  // TITLE
];

export const DisguiseStage: React.FC<DisguiseStageProps> = ({ question, onAnswer, onStartMainMusic }) => {
  const [modalContent, setModalContent] = useState<{ show: boolean, text: string, isCorrect: boolean } | null>(null);
  const [introStep, setIntroStep] = useState(-1); // -1: normal, 0-7: playing intro
  const [displayedText, setDisplayedText] = useState("");
  const completionTriggered = useRef(false);
  
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio but don't play yet
  useEffect(() => {
    const audio = new Audio('https://audio.jukehost.co.uk/fwYwroiS04dGaE7ETsQoWTh0b4jwkfNH');
    audio.preload = "auto";
    audio.volume = 1.0;
    introAudioRef.current = audio;

    return () => {
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Sequence Timer Logic
    if (introStep >= 0 && introStep < INTRO_TEXTS.length) {
      // 1. Reset text for typing effect
      setDisplayedText("");
      const currentText = INTRO_TEXTS[introStep].text;
      const duration = TIMINGS[introStep];
      
      // 2. Typing animation logic
      let charIndex = 0;
      // Calculate speed to finish typing a bit before the slide ends (leave 500ms buffer)
      // Ensure speed is not too slow (max 80ms per char) or too fast (min 10ms)
      const calculatedSpeed = (duration - 800) / currentText.length;
      const typeSpeed = Math.max(10, Math.min(80, calculatedSpeed));
      
      const typeInterval = setInterval(() => {
        charIndex++;
        setDisplayedText(currentText.substring(0, charIndex));
        if (charIndex >= currentText.length) {
          clearInterval(typeInterval);
        }
      }, typeSpeed);

      // 3. Slide transition timer
      const timer = setTimeout(() => {
        setIntroStep(prev => prev + 1);
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearInterval(typeInterval);
      };

    } else if (introStep >= INTRO_TEXTS.length && !completionTriggered.current) {
       // Sequence finished
       finishIntroSequence();
    }
  }, [introStep]);

  const finishIntroSequence = () => {
       if (completionTriggered.current) return;
       completionTriggered.current = true;
       
       // Fade out intro music
       if (introAudioRef.current) {
         const fadeOut = setInterval(() => {
             if (introAudioRef.current && introAudioRef.current.volume > 0.1) {
                 introAudioRef.current.volume -= 0.1;
             } else {
                 clearInterval(fadeOut);
                 introAudioRef.current?.pause();
             }
         }, 200);
       }

       // Start main music
       onStartMainMusic();
       
       // Small delay to ensure render is clean before unmounting
       setTimeout(() => {
           onAnswer(true, "Welcome to the game");
       }, 500);
  };

  const handleChoice = (option: typeof question.options[0]) => {
    // Check if this is the specific trigger question (Big Pecs option)
    if (question.id === 'd3' && option.isCorrect) {
      triggerCinematicSequence();
    } else {
      // Normal flow
      setModalContent({
        show: true,
        text: option.response || "Interesting choice...",
        isCorrect: option.isCorrect
      });
    }
  };

  const triggerCinematicSequence = () => {
    // START AUDIO IMMEDIATELY ON USER INTERACTION
    if (introAudioRef.current) {
        introAudioRef.current.currentTime = 0;
        introAudioRef.current.play()
            .then(() => console.log("Audio started successfully"))
            .catch(e => console.error("Audio play failed:", e));
    }
    setIntroStep(0);
  };
  
  const skipIntro = () => {
      // Immediately stop audio
      if (introAudioRef.current) {
        introAudioRef.current.pause();
      }
      onStartMainMusic();
      completionTriggered.current = true;
      onAnswer(true, "Welcome to the game");
  };

  const closeModal = () => {
    if (modalContent?.isCorrect) {
      setModalContent(null);
      setTimeout(() => {
        onAnswer(true, modalContent.text);
      }, 300);
    } else {
      setModalContent(null);
    }
  };

  // RENDER MOVIE INTRO MODE
  if (introStep >= 0) {
    // Safety check: if we went past the array, render black to avoid crash before onAnswer triggers
    if (introStep >= INTRO_TEXTS.length) {
        return <div className="fixed inset-0 bg-black z-50"></div>;
    }

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Starfield / Cinematic Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
        
        {/* Skip Button */}
        <button 
            onClick={skipIntro}
            className="absolute top-4 right-4 z-50 text-white/30 hover:text-white text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
        >
            Skip Intro
        </button>
        
        <div key={introStep} className="z-10 w-full max-w-5xl flex items-center justify-center min-h-[60vh] px-4">
           <p className={`leading-snug drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-3xl md:text-5xl whitespace-normal break-words w-full
             ${INTRO_TEXTS[introStep].style}
           `}>
             {displayedText}
             <span className="animate-pulse ml-1">|</span>
           </p>
        </div>
        
        {/* Progress Bar (Optional, adds to movie feel) */}
        <div className="absolute bottom-10 left-10 right-10 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-red-600 transition-all duration-1000 ease-linear"
                style={{ width: `${((introStep + 1) / INTRO_TEXTS.length) * 100}%` }}
            ></div>
        </div>
      </div>
    );
  }

  // RENDER NORMAL DISGUISE UI
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-50 text-slate-900 font-sans p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-lg z-10">
        <div className="flex items-center space-x-3 mb-8 opacity-60">
          <div className="w-3 h-3 bg-slate-800 rounded-full animate-pulse"></div>
          <h1 className="text-xs font-bold uppercase tracking-[0.2em]">System Configuration // User: R KAR</h1>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-tight text-slate-800">
            {question.text}
          </h2>

          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleChoice(option)}
                className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-800 hover:shadow-lg transition-all duration-300 transform active:scale-98 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900">{option.text}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">➜</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <p className="mt-8 text-[10px] text-slate-400 text-center tracking-widest uppercase">
          AI Analysis in progress...
        </p>
      </div>

      {/* Sarcastic Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-float">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modalContent.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {modalContent.isCorrect ? '✓' : '✕'}
            </div>
            <p className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">
              "{modalContent.text}"
            </p>
            <button 
              onClick={closeModal}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold tracking-wide hover:bg-slate-800 transition-colors"
            >
              {modalContent.isCorrect ? 'CONTINUE' : 'TRY AGAIN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};