import React from 'react';
import { FaMicrophone, FaTrash } from 'react-icons/fa';

export default function Controls({ startListening, stopListening, clearAll, listening }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
            onClick={clearAll}
            className="w-14 h-14 rounded-full flex items-center justify-center
                       bg-white/10 backdrop-blur-lg text-white/70 
                       hover:bg-white/20 hover:text-white transition-all duration-300"
            title="Clear List"
        >
            <FaTrash size={20} />
        </button>

        <button
            onClick={listening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white
                        transition-all duration-300 shadow-2xl ring-4 ring-white/20
                        ${listening 
                            ? 'bg-red-500 animate-pulse' 
                            : 'bg-blue-500 hover:bg-blue-400'
                        }`}
        >
            <FaMicrophone size={32} />
        </button>

        <div className="w-14 h-14"></div>
    </div>
  );
}