import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../constants';

interface LotusGameProps {
  onComplete: () => void;
}

interface GameItem {
  id: number;
  type: string;
  lane: number; // 0, 1, 2
  y: number; // Percentage down screen
  collected: boolean;
}

const ITEMS_TO_COLLECT = [
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Garlic', emoji: '🧄' },
  { name: 'Ginger', emoji: '🥔' }, // Using potato emoji as ginger is rare in some font sets
  { name: 'Oil', emoji: '🍾' },
  { name: 'Pan', emoji: '🍳' },
];

export const LotusGame: React.FC<LotusGameProps> = ({ onComplete }) => {
  const [playerLane, setPlayerLane] = useState(1); // 0: Left, 1: Center, 2: Right
  const [items, setItems] = useState<GameItem[]>([]);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  
  const touchStartX = useRef<number | null>(null);
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const gameLoopSpeed = useRef(0.6); // Base speed

  // Controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    
    if (diff > 50) {
        // Swipe Right
        setPlayerLane(prev => Math.min(2, prev + 1));
    } else if (diff < -50) {
        // Swipe Left
        setPlayerLane(prev => Math.max(0, prev - 1));
    }
    touchStartX.current = null;
  };

  const handleLaneClick = (lane: number) => {
      setPlayerLane(lane);
  };

  // Game Loop
  const updateGame = (time: number) => {
      if (!gameActive) return;

      // Spawn items
      if (time - lastSpawnTime.current > 1200) { // Spawn every 1.2s
          const randomItem = ITEMS_TO_COLLECT[Math.floor(Math.random() * ITEMS_TO_COLLECT.length)];
          const newItem: GameItem = {
              id: time,
              type: randomItem.name,
              lane: Math.floor(Math.random() * 3),
              y: -10,
              collected: false
          };
          setItems(prev => [...prev, newItem]);
          lastSpawnTime.current = time;
      }

      setItems(prevItems => {
          const nextItems = prevItems.map(item => ({
              ...item,
              y: item.y + gameLoopSpeed.current
          })).filter(item => item.y < 110 && !item.collected); // Remove off-screen or collected

          // Check Collisions
          const playerY = 80; // Player is at 80% down
          const hitItems: string[] = [];
          
          const finalItems = nextItems.map(item => {
              // Simple box collision
              if (
                  item.lane === playerLane && 
                  Math.abs(item.y - playerY) < 5 && // Vertical overlap
                  !item.collected
              ) {
                  hitItems.push(item.type);
                  return { ...item, collected: true };
              }
              return item;
          });

          // Update collected state
          if (hitItems.length > 0) {
              setCollected(prev => {
                  const newSet = new Set(prev);
                  hitItems.forEach(i => newSet.add(i));
                  return newSet;
              });
          }

          return finalItems;
      });

      requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [playerLane, gameActive]);

  // Check Win Condition
  useEffect(() => {
      if (collected.size >= ITEMS_TO_COLLECT.length) {
          setGameActive(false);
          setTimeout(() => setShowReward(true), 500);
      }
  }, [collected]);


  if (showReward) {
      return (
        <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500 z-50">
            <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl border-4 border-yellow-400">
                <div className="text-6xl mb-4 animate-bounce">🥘</div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase">Shopping Complete!</h3>
                <p className="text-slate-600 mb-6 font-medium">You got all ingredients: Chicken, Onion, Tomato, Garlic, Ginger, Oil & a Pan!</p>
                <div className="bg-green-100 p-4 rounded-xl mb-6">
                    <p className="text-green-800 font-bold">Rishab is happy (for now).</p>
                </div>
                <button 
                  onClick={onComplete}
                  className="w-full py-4 bg-yellow-500 text-white font-black text-xl rounded-xl hover:bg-yellow-600 transition-colors shadow-lg transform active:scale-95"
                >
                  COOK DINNER!
                </button>
            </div>
        </div>
      );
  }

  return (
    <div 
        className="fixed inset-0 bg-slate-100 overflow-hidden touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
        {/* Header / HUD */}
        <div className="absolute top-0 left-0 w-full z-20 bg-white/90 backdrop-blur-sm p-4 shadow-sm border-b border-slate-200">
            <h2 className="text-center font-black text-slate-800 text-lg md:text-xl mb-2 leading-tight uppercase">
                COLLECT GROCERIES (WHETHER YOU LIKE IT OR NOT) FOR RISHAB'S CHICKEN CURRY
            </h2>
            <div className="flex justify-center gap-1 flex-wrap">
                {ITEMS_TO_COLLECT.map(item => (
                    <div 
                        key={item.name} 
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm border-2 transition-all duration-300
                            ${collected.has(item.name) ? 'bg-green-100 border-green-500 opacity-100 scale-110' : 'bg-slate-200 border-slate-300 opacity-50 grayscale'}
                        `}
                    >
                        {item.emoji}
                    </div>
                ))}
            </div>
        </div>

        {/* Game World */}
        <div className="absolute inset-0 top-24 flex">
            {/* Aisles Background */}
            <div className="absolute inset-0 grid grid-cols-3">
                <div className="border-r border-slate-300 bg-slate-50 relative">
                     {/* Shelf decor */}
                     <div className="absolute top-1/4 left-0 w-4 h-full bg-slate-200"></div>
                </div>
                <div className="border-r border-slate-300 bg-slate-100"></div>
                <div className="bg-slate-50 relative">
                    <div className="absolute top-1/4 right-0 w-4 h-full bg-slate-200"></div>
                </div>
            </div>

            {/* Click zones for easy desktop/mobile tapping */}
            <div className="absolute inset-0 grid grid-cols-3 z-0">
                <div onClick={() => handleLaneClick(0)} className="hover:bg-black/5 transition-colors"></div>
                <div onClick={() => handleLaneClick(1)} className="hover:bg-black/5 transition-colors"></div>
                <div onClick={() => handleLaneClick(2)} className="hover:bg-black/5 transition-colors"></div>
            </div>

            {/* Items */}
            {items.map(item => !item.collected && (
                <div
                    key={item.id}
                    className="absolute w-16 h-16 flex items-center justify-center text-4xl transition-transform"
                    style={{
                        left: `${(item.lane * 33.33) + 16.66}%`,
                        top: `${item.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                    }}
                >
                    {ITEMS_TO_COLLECT.find(i => i.name === item.type)?.emoji}
                </div>
            ))}

            {/* Player */}
            <div 
                className="absolute w-20 h-20 transition-all duration-200 ease-out z-20"
                style={{
                    left: `${(playerLane * 33.33) + 16.66}%`,
                    top: '80%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className="relative w-full h-full">
                    <div className="absolute bottom-0 w-full h-4 bg-black/20 rounded-full blur-sm"></div>
                    {/* Simple Character Representation */}
                    <div className="w-full h-full text-6xl flex items-center justify-center animate-bounce">
                        🛒
                    </div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                        R KAR
                    </div>
                </div>
            </div>
        </div>
        
        <div className="absolute bottom-8 left-0 w-full text-center text-slate-400 text-sm animate-pulse">
            Swipe or Tap lanes to collect ingredients!
        </div>
    </div>
  );
};