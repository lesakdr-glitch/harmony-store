'use client';

import { useState } from 'react';

interface PriceFilterProps {
  onFilter: (minPrice: number, maxPrice: number) => void;
}

export default function PriceFilter({ onFilter }: PriceFilterProps) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleApply = () => {
    onFilter(
      minPrice ? parseInt(minPrice) : 0,
      maxPrice ? parseInt(maxPrice) : Infinity
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Цена</h3>
      <div className="flex space-x-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="От"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="До"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
        />
      </div>
      <button
        onClick={handleApply}
        className="w-full bg-accent-olive text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
      >
        Применить
      </button>
    </div>
  );
}
