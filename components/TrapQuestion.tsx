import React, { useState } from 'react';
import { TRAP_CONTENT } from '../constants';

interface TrapQuestionProps {
  onComplete: () => void;
}

export const TrapQuestion: React.FC<TrapQuestionProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [hint, setHint] = useState("");

  const handleSelect = (id: string) => {
    // If we select one, and the other isn't selected, hint to select both
    if (selected.includes(id)) {
        // Deselecting not allowed for this trap really, but let's allow toggling off
        setSelected(prev => prev.filter(i => i !== id));
        return;
    }

    const otherId = id === 'A' ? 'B' : 'A';
    
    // If the other is NOT selected, trigger the trap logic
    if (!selected.includes(otherId)) {
      setShakeId(otherId);
      setTimeout(() => setShakeId(null), 500);
      
      if (id === 'A') {
        setHint("Oh, are you sure? Just a boyfriend? If you really love him, treat him like the bottom bear doll he is! (Choose both!)");
      } else {
        setHint("Rude! He provides for you! He has feelings! (Choose both!)");
      }
    } else {
        // Both will be selected now
        setHint(TRAP_CONTENT.successMessage);
    }

    setSelected(prev => [...prev, id]);
  };

  const bothSelected = selected.includes('A') && selected.includes('B');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
        <h2 className="text-2xl md:text-3xl font-extrabold text-pink-600 text-center mb-8">
          {TRAP_CONTENT.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => handleSelect('A')}
            className={`p-8 rounded-2xl border-4 transition-all duration-300 transform font-bold text-xl h-48 flex items-center justify-center text-center
              ${selected.includes('A') ? 'bg-pink-500 border-pink-600 text-white scale-95' : 'bg-white border-pink-200 text-gray-700 hover:border-pink-400 hover:shadow-lg'}
              ${shakeId === 'A' ? 'animate-shake ring-4 ring-red-400' : ''}
            `}
          >
            {TRAP_CONTENT.optionA}
          </button>

          <button
             onClick={() => handleSelect('B')}
             className={`p-8 rounded-2xl border-4 transition-all duration-300 transform font-bold text-xl h-48 flex items-center justify-center text-center
               ${selected.includes('B') ? 'bg-purple-600 border-purple-700 text-white scale-95' : 'bg-white border-purple-200 text-gray-700 hover:border-purple-400 hover:shadow-lg'}
               ${shakeId === 'B' ? 'animate-shake ring-4 ring-red-400' : ''}
             `}
          >
            {TRAP_CONTENT.optionB}
          </button>
        </div>

        <div className="min-h-[100px] flex flex-col items-center justify-center">
            {hint && (
                <p className="text-center font-bold text-red-500 text-lg animate-pulse mb-4">
                    {hint}
                </p>
            )}

            {bothSelected && (
                <button
                    onClick={onComplete}
                    className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg transform hover:scale-110 transition-transform animate-bounce"
                >
                    Confirm Double Identity
                </button>
            )}
        </div>
      </div>
    </div>
  );
};