import React from 'react';
import type { Pokemon, BattleSet, StoredPokemon } from '../types';
import AnimatedSprite from './AnimatedSprite';

interface HydratedStoredPokemon extends StoredPokemon {
  pokemon: Pokemon;
  set: BattleSet;
}

interface StorageBoxProps {
  box: HydratedStoredPokemon[];
  onRemoveFromBox: (instanceId: number) => void;
  onSelectFromBox: (pokemon: Pokemon) => void;
}

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


const StorageBox: React.FC<StorageBoxProps> = ({ box, onRemoveFromBox, onSelectFromBox }) => {
  const slots = Array.from({ length: 6 });

  return (
    <div className="bg-zinc-800 rounded-lg p-4 shadow-lg border border-zinc-700">
      <h3 className="text-lg font-semibold text-zinc-200 mb-4">Storage Box ({box.length}/6)</h3>
      <div className="grid grid-cols-6 gap-2">
        {slots.map((_, index) => {
          const item = box[index];
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
                    onClick={() => onSelectFromBox(item.pokemon)}
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
    </div>
  );
};

export default StorageBox;
