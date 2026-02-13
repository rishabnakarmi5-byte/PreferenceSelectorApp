import React from 'react';
import { HeartIcon, IMAGES } from '../constants';

export const Finale: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex flex-col items-center p-4 overflow-y-auto font-sans">
      
      <div className="w-full max-w-2xl mt-12 mb-24">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
          <HeartIcon className="w-20 h-20 text-red-500 mx-auto mb-6 relative z-10 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-romantic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 leading-tight drop-shadow-sm">
            My Valentine
          </h1>
        </div>

        {/* Final Letter Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-xl mb-12 transform transition-all hover:scale-[1.01] relative overflow-hidden">
           
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-red-500 to-purple-500"></div>

           <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-white rotate-1">
                <img src={IMAGES.MOVING_OUT} alt="Us" className="w-full h-auto" />
           </div>

           <p className="text-lg md:text-xl text-slate-700 leading-loose mb-6 font-light italic">
             "To R Kar, my calm in the chaos."
           </p>
           
           <p className="text-slate-700 leading-relaxed mb-4">
             We've come a long way from Grindr hookups and fighting over Dota lanes. We\'ve built a home, shared a tiny bed, and supported each other through everything.
           </p>
           
           <p className="text-slate-700 leading-relaxed mb-6">
             Even though I'm in Nepal and you're in Thailand right now, we are always with each other. I love you, I want you to be mine forever. I hope I can be the big chest muscle bear you deserve forever.
           </p>

           <div className="mt-8 pt-8 border-t border-pink-200 text-center">
             <p className="font-romantic text-4xl md:text-5xl text-pink-600">
               I love you.
             </p>
             <p className="text-xs text-slate-400 mt-4 tracking-widest uppercase">
                Happy Valentine's Day 2025
             </p>
           </div>
        </div>

        <div className="text-center pb-10">
            <button 
                onClick={() => window.location.reload()}
                className="text-pink-400 text-sm hover:text-pink-600 underline"
            >
                Replay Our Story
            </button>
        </div>
      </div>
    </div>
  );
};