import React, { useState, useEffect } from 'react';
import { IMAGES } from '../constants';

interface LotusGameProps {
  onComplete: () => void;
}

export const LotusGame: React.FC<LotusGameProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("RUN!");
  const [showReward, setShowReward] = useState(false);

  const handleRun = () => {
    if (progress >= 100) return;
    const newProgress = Math.min(100, progress + 8); // 8% per tap
    setProgress(newProgress);
    
    if (newProgress === 100) {
      setStatus("FOOD SECURED!");
      setTimeout(() => setShowReward(true), 500);
    } else if (newProgress > 70) {
        setStatus("ALMOST THERE!");
    } else if (newProgress > 40) {
        setStatus("R KAR IS HUNGRY!");
    }
  };

  useEffect(() => {
    // Decay progress if not tapping
    const decay = setInterval(() => {
      if (!showReward) {
        setProgress(p => Math.max(0, p - 2));
      }
    }, 200);
    return () => clearInterval(decay);
  }, [showReward]);

  if (showReward) {
      return (
        <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="bg-white p-2 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                <div className="aspect-square w-full bg-slate-200 rounded-2xl overflow-hidden mb-6 relative">
                     <img src={IMAGES.NEPALI_FOOD} alt="Food Reward" className="object-cover w-full h-full" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <h2 className="text-4xl font-bold text-white uppercase border-4 border-white p-4 -rotate-12">YUMMY!</h2>
                     </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Delivery Success!</h3>
                <p className="text-slate-600 mb-6">You managed to get the food while Rishab was complaining.</p>
                <button 
                  onClick={onComplete}
                  className="w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg"
                >
                  Let's Eat & Proceed
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-400 to-green-600 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white italic drop-shadow-md tracking-tighter mb-2">LOTUS RUN!</h2>
        <p className="text-green-100 font-medium text-lg">Tap furiously to walk to the gate!</p>
      </div>

      <div className="w-full max-w-xs bg-black/20 rounded-full h-8 mb-12 border-4 border-white/30 relative overflow-hidden">
        <div 
          className="h-full bg-yellow-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <button
        onMouseDown={handleRun}
        onTouchStart={(e) => { e.preventDefault(); handleRun(); }}
        className="w-48 h-48 rounded-full bg-white border-8 border-green-200 shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95 active:shadow-none transition-all flex items-center justify-center group"
      >
        <div className="text-center">
            <span className="text-6xl block mb-2 group-active:scale-110 transition-transform">🏃‍♂️</span>
            <span className="font-bold text-green-600 uppercase tracking-widest">{status}</span>
        </div>
      </button>

      <p className="mt-8 text-white/60 text-sm">Don't let the food get cold...</p>
    </div>
  );
};
