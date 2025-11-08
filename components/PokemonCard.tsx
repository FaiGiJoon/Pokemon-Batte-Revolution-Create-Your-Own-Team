import React from 'react';
import type { Pokemon } from '../types';
import AnimatedSprite from './AnimatedSprite';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect }) => {
  return (
    <div 
      className="bg-zinc-700 rounded-lg p-3 text-center cursor-pointer transition-all duration-200 hover:bg-zinc-600 hover:scale-105 hover:shadow-red-500/10 shadow-md border border-zinc-600 hover:border-zinc-500"
      onClick={onSelect}
    >
      <AnimatedSprite 
        pokemon={pokemon}
        className="mx-auto h-20 w-20"
      />
      <p className="mt-2 text-sm font-semibold text-zinc-200 capitalize truncate">{pokemon.name}</p>
    </div>
  );
};

export default PokemonCard;
