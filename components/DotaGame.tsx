import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../constants';

interface DotaGameProps {
  onComplete: () => void;
}

export const DotaGame: React.FC<DotaGameProps> = ({ onComplete }) => {
  const [level, setLevel] = useState(1); // 1 = Creeps, 2 = Pudge
  const [creepsKilled, setCreepsKilled] = useState(0);
  const [creepPos, setCreepPos] = useState({ top: '50%', left: '50%' });
  const [showReward, setShowReward] = useState(false);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  
  // Pudge Level State
  const [hooksDodged, setHooksDodged] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 }); // Percent
  const [hookState, setHookState] = useState<'IDLE' | 'WINDUP' | 'FIRED' | 'RETRACT'>('IDLE');
  const [targetX, setTargetX] = useState<number | null>(null);
  
  // Logic Refs (to avoid dependency cycles resetting timers)
  const playerPosRef = useRef(playerPos);

  const totalCreeps = 5;
  const hooksToWin = 3;

  // Sync ref with state
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  // --- LEVEL 1 LOGIC (Creeps) ---
  const moveCreep = () => {
    const top = Math.floor(Math.random() * 60) + 20 + '%';
    const left = Math.floor(Math.random() * 80) + 10 + '%';
    setCreepPos({ top, left });
  };

  const handleKill = () => {
    const newCount = creepsKilled + 1;
    setCreepsKilled(newCount);
    if (newCount >= totalCreeps) {
      setShowLevelTransition(true);
      setTimeout(() => {
        setShowLevelTransition(false);
        setLevel(2);
      }, 3000);
    } else {
      moveCreep();
    }
  };

  useEffect(() => {
    if (level === 1) moveCreep();
  }, [level]);

  // --- LEVEL 2 LOGIC (Pudge) ---
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const handleTapToBlink = (e: React.MouseEvent | React.TouchEvent) => {
    if (level !== 2) return;
    
    // Get click coordinates relative to game area
    const area = gameAreaRef.current;
    if (!area) return;
    
    const rect = area.getBoundingClientRect();
    let clientX = 0;
    
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
    } else {
        clientX = (e as React.MouseEvent).clientX;
    }

    const relativeX = clientX - rect.left;
    const percentX = (relativeX / rect.width) * 100;
    
    // Update player position (Blink)
    // Limits: 10% to 90%
    const newX = Math.min(90, Math.max(10, percentX));
    setPlayerPos(prev => ({ ...prev, x: newX }));
  };

  // Game Loop - Independent of playerPos to prevent timer resets
  useEffect(() => {
    if (level !== 2) return;
    if (showReward) return;

    let timer: ReturnType<typeof setTimeout>;

    if (hookState === 'IDLE') {
       // Wait a random time between 1s and 2s before starting windup
       const delay = 1000 + Math.random() * 1000;
       timer = setTimeout(() => {
           setHookState('WINDUP');
           // Lock onto CURRENT player pos using REF
           setTargetX(playerPosRef.current.x); 
       }, delay);
    } else if (hookState === 'WINDUP') {
       // 1 second warning before fire
       timer = setTimeout(() => {
           setHookState('FIRED');
       }, 1000);
    } else if (hookState === 'FIRED') {
       // Animate Hook Down
       const animationDuration = 500;
       timer = setTimeout(() => {
         // CHECK COLLISION using REF for player position
         // Tolerance is 15%
         const hit = Math.abs(playerPosRef.current.x - (targetX ?? 50)) < 15;
         
         if (hit) {
            // Reset Progress
            setHooksDodged(0);
            setHookState('RETRACT');
            // Allow state update to propagate before alert (optional, but better UX to not block immediately)
            setTimeout(() => alert("FRESH MEAT! You got hooked! Try dodging faster."), 100);
         } else {
            // Dodge Success
            const newDodged = hooksDodged + 1;
            setHooksDodged(newDodged);
            setHookState('RETRACT');
            
            if (newDodged >= hooksToWin) {
                setTimeout(() => setShowReward(true), 1000);
            }
         }
       }, animationDuration);
    } else if (hookState === 'RETRACT') {
       timer = setTimeout(() => {
          if (!showReward) setHookState('IDLE');
       }, 500);
    }

    return () => clearTimeout(timer);
    // Crucial: playerPos is NOT in dependency array
  }, [level, hookState, hooksDodged, showReward, targetX]);


  // --- RENDERING ---

  if (showReward) {
      return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-2 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="aspect-video w-full bg-slate-200 rounded-2xl overflow-hidden mb-6 relative">
                     <img src={IMAGES.GAMING} alt="Gaming" className="object-cover w-full h-full" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">GG WP!</h3>
                <p className="text-slate-600 mb-6">You farm like a pro and dodge like a god. Just like how you dodge doing the dishes... wait.</p>
                <button 
                  onClick={onComplete}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Continue
                </button>
            </div>
        </div>
      );
  }

  if (showLevelTransition) {
      return (
          <div className="fixed inset-0 bg-red-900 z-50 flex items-center justify-center flex-col animate-pulse">
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">WARNING</h1>
              <p className="text-2xl text-red-200 font-mono">PUDGE DETECTED</p>
              <p className="text-xl text-white mt-8">Prepare to DODGE!</p>
          </div>
      );
  }

  // LEVEL 1 RENDER
  if (level === 1) {
    return (
        <div className="relative w-full h-screen overflow-hidden cursor-crosshair select-none touch-none">
          {/* QoP Background */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.QOP_BG})` }}>
              <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="absolute top-4 left-0 w-full text-center z-10 pointer-events-none">
            <h2 className="text-2xl font-bold text-yellow-400 drop-shadow-md">LEVEL 1: LAST HIT</h2>
            <p className="text-white">Creeps Killed: {creepsKilled} / {totalCreeps}</p>
          </div>
    
          <button
            onMouseDown={handleKill}
            onTouchStart={(e) => { e.preventDefault(); handleKill(); }}
            style={{ top: creepPos.top, left: creepPos.left }}
            className="absolute w-24 h-24 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 active:scale-90 group outline-none"
          >
            <div className="w-full h-full bg-red-600 rounded-full border-4 border-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.6)] animate-bounce">
               <span className="text-white font-bold text-xs pointer-events-none">CLICK ME</span>
            </div>
            <div className="absolute -top-4 left-0 w-full bg-black h-2 border border-gray-600 pointer-events-none">
               <div className="bg-green-500 h-full w-[20%] animate-pulse"></div>
            </div>
          </button>
        </div>
      );
  }

  // LEVEL 2 RENDER
  return (
    <div 
        ref={gameAreaRef}
        className="relative w-full h-screen overflow-hidden select-none bg-slate-900"
        onMouseDown={handleTapToBlink}
        onTouchStart={handleTapToBlink}
    >
        {/* Pudge Background */}
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${IMAGES.PUDGE_BG})` }}></div>

        {/* UI HUD */}
        <div className="absolute top-4 left-0 w-full text-center z-20 pointer-events-none">
            <h2 className="text-2xl font-bold text-red-500 drop-shadow-md animate-pulse">LEVEL 2: SURVIVE</h2>
            <p className="text-white font-mono">Hooks Dodged: {hooksDodged} / {hooksToWin}</p>
            <p className="text-yellow-300 text-sm mt-2 blink">Tap anywhere to BLINK/MOVE!</p>
        </div>

        {/* Pudge (Enemy) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 z-10">
             <div className="w-full h-full bg-red-900 rounded-full border-4 border-black flex items-center justify-center relative overflow-hidden">
                 <img src="https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c0/Pudge_icon.png" className="w-full h-full object-cover" alt="Pudge" />
             </div>
             {hookState === 'WINDUP' && (
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-black text-xl whitespace-nowrap drop-shadow-lg text-shadow-red animate-pulse">
                     FRESH MEAT!
                 </div>
             )}
        </div>

        {/* The Hook */}
        <div 
            className="absolute top-32 w-10 bg-gray-400 border-2 border-black z-10 transition-all duration-500 ease-in"
            style={{ 
                left: `${targetX !== null ? targetX : 50}%`,
                height: hookState === 'FIRED' ? '100vh' : '0vh',
                opacity: hookState === 'IDLE' ? 0 : 1,
                transform: 'translateX(-50%)'
            }}
        >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-300 rounded-full border-4 border-gray-600"></div>
        </div>

        {/* Warning Indicator */}
        {hookState === 'WINDUP' && targetX !== null && (
            <div 
                className="absolute top-0 bottom-0 bg-red-500/30 border-x-2 border-red-500 animate-pulse z-0"
                style={{ 
                    left: `${targetX}%`, 
                    width: '30%', // 15% tolerance either side
                    transform: 'translateX(-50%)'
                }}
            ></div>
        )}

        {/* Player (QoP/User) */}
        <div 
            className="absolute bottom-20 w-20 h-20 transition-all duration-200 z-30"
            style={{ 
                left: `${playerPos.x}%`, 
                transform: 'translateX(-50%)' 
            }}
        >
             <div className="w-full h-full relative">
                 <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-50 animate-ping"></div>
                 <img 
                    src="https://static.wikia.nocookie.net/dota2_gamepedia/images/a/a1/Queen_of_Pain_icon.png" 
                    className="w-full h-full rounded-full border-2 border-blue-300 shadow-[0_0_20px_blue] relative z-10" 
                    alt="You"
                />
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-blue-300 text-xs font-bold whitespace-nowrap">
                     R KAR
                 </div>
             </div>
        </div>

    </div>
  );
};