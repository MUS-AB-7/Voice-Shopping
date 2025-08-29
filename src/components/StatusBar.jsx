import React from 'react';

export default function StatusBar({ listening, loading, error, transcript, command }) {
  let message = transcript || "Click the mic to begin...";
  let styles = "text-white/60 italic";

  if (listening) {
    message = transcript || "Listening intently...";
    styles = "text-green-300 font-medium";
  }
  if (loading) {
    message = "Thinking...";
    styles = "text-blue-300 animate-pulse";
  }
  if (command) {
    message = `Understood: "${command}"`;
    styles = "text-white font-semibold";
  }
  if (error) {
    message = `Sorry, an error occurred: ${error}`;
    styles = "text-red-400 font-semibold";
  }

  return (
    <div className="text-center h-6">
      <p className={`transition-all duration-300 ${styles}`}>{message}</p>
    </div>
  );
}