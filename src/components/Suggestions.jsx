import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

export default function Suggestions({ suggestions }) {
  if (!suggestions.seasonal.length && !suggestions.history.length && !suggestions.substitute) {
    return null;
  }

  return (
    <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl shadow-lg animate-fade-in">
      <h3 className="text-xl font-bold flex items-center mb-4 text-yellow-300">
        <FaLightbulb className="mr-2" /> Smart Suggestions
      </h3>
      
      <div className="space-y-3 text-white/80">
        {suggestions.substitute && (
          <p>
            For <strong className="text-white">{suggestions.substitute.for}</strong>, you could try:{" "}
            <span className="font-semibold text-yellow-200">
              {suggestions.substitute.options.join(", ")}
            </span>.
          </p>
        )}
        {suggestions.seasonal.length > 0 && (
          <p>
            In season now:{" "}
            <span className="font-semibold text-yellow-200">
              {suggestions.seasonal.join(", ")}
            </span>.
          </p>
        )}
        {suggestions.history.length > 0 && (
          <p>
            You previously bought:{" "}
            <span className="font-semibold text-yellow-200">
              {suggestions.history.map(i => i.name).join(", ")}
            </span>.
          </p>
        )}
      </div>
    </div>
  );
}
