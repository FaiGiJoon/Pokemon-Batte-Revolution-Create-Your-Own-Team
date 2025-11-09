import React, { useState, useMemo } from 'react';
import type { HydratedStoredPokemon } from '../types';
import AnimatedSprite from './AnimatedSprite';

interface StorageBoxProps {
  box: HydratedStoredPokemon[];
  onRemoveFromBox: (instanceId: number) => void;
  onSelectFromBox: (item: HydratedStoredPokemon) => void;
}

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


const StorageBox: React.FC<StorageBoxProps> = ({ box, onRemoveFromBox, onSelectFromBox }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const slots = Array.from({ length: 6 });

  const filteredBox = useMemo(() => {
    if (!searchTerm) {
      return box;
    }
    return box.filter(item =>
      item.pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, box]);

  return (
    <div className="bg-zinc-800 rounded-lg p-4 shadow-lg border border-zinc-700">
      <h3 className="text-lg font-semibold text-zinc-200 mb-4">Storage Box ({box.length}/6)</h3>

      <div className="relative mb-4">
          <input
              type="text"
              placeholder="Search in box..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 pl-10 pr-4 text-zinc-300 focus:ring-2 focus:ring-accent-red focus:outline-none disabled:bg-zinc-800 disabled:cursor-not-allowed"
              disabled={box.length === 0 && !searchTerm}
              aria-label="Search Pokémon in storage box"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-zinc-500" />
          </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {slots.map((_, index) => {
          const item = filteredBox[index];
          return (
            <div 
              key={index} 
              className={`aspect-square rounded-md flex items-center justify-center transition-colors ${item ? 'bg-zinc-600' : 'bg-zinc-700/50'}`}
            >
              {item && (
                <div className="relative group">
                  <AnimatedSprite 
                    pokemon={item.pokemon}
                    className="h-12 w-12 cursor-pointer"
                    onClick={() => onSelectFromBox(item)}
                    isShiny={item.set.isShiny}
                  />
                  <button 
                    onClick={() => onRemoveFromBox(item.instanceId)}
                    className="absolute -top-2 -right-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${item.pokemon.name}`}
                  >
                    <XCircleIcon className="h-5 w-5"/>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
       {searchTerm && filteredBox.length === 0 && (
        <p className="text-center text-sm text-zinc-500 mt-3">No Pokémon matching "{searchTerm}" in your box.</p>
      )}
    </div>
  );
};

export default StorageBox;