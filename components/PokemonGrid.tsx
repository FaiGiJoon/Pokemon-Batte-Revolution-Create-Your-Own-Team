import React, { useState, useMemo } from 'react';
import type { Pokemon } from '../types';
import PokemonCard from './PokemonCard';

interface PokemonGridProps {
  pokemonList: Pokemon[];
  onPokemonSelect: (pokemon: Pokemon) => void;
  onSetView: (view: 'dashboard' | 'grid' | 'passes') => void;
}

const SearchIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


const PokemonGrid: React.FC<PokemonGridProps> = ({ pokemonList, onPokemonSelect, onSetView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemon = useMemo(() => {
    if (!searchTerm) {
      return pokemonList;
    }
    return pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, pokemonList]);

  return (
    <div className="bg-zinc-800 rounded-lg p-4 sm:p-6 shadow-lg border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-zinc-200">Pokémon Database</h2>
            <button
                onClick={() => onSetView('dashboard')}
                className="text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold py-1 px-3 rounded-md transition-colors"
            >
                &larr; Back to Dashboard
            </button>
        </div>
        <div className="relative mb-6">
            <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 pl-10 pr-4 text-zinc-300 focus:ring-2 focus:ring-accent-red focus:outline-none"
            />
            <SearchIcon className="h-5 w-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        
        {filteredPokemon.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPokemon.map(pokemon => (
                <PokemonCard 
                    key={pokemon.id} 
                    pokemon={pokemon} 
                    onSelect={() => onPokemonSelect(pokemon)} 
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-10 text-zinc-500">
                <p>No Pokémon found for "{searchTerm}".</p>
            </div>
        )}
    </div>
  );
};

export default PokemonGrid;