import React from 'react';

export default function ShoppingList({ items }) {
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Miscellaneous';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-white/70 text-lg">Your list is empty.</p>
        <p className="text-white/50 mt-1">Click the mic to add items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-white/50 uppercase tracking-widest pb-2 mb-2 border-b-2 border-white/10">
            {category}
          </h3>
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex text-xl text-white/90 p-2 transition-colors rounded-lg hover:bg-white/10">
                <span className="font-light w-16 text-right mr-4 opacity-70">{item.quantity} x</span>
                <span className="font-medium">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}