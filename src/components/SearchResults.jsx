import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchResults({ results }) {
  if (results.length === 0) return null;

  return (
    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-lg animate-fade-in">
      <h3 className="text-xl font-bold flex items-center mb-4 text-blue-300">
        <FaSearch className="mr-2" /> Search Results
      </h3>
      
      <ul className="divide-y divide-white/10">
        {results.map(item => (
          <li key={item.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-white/60">{item.brand}</p>
            </div>
            <p className="font-bold text-blue-200 text-lg">
              ${item.price.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
