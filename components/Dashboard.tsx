import React from 'react';
import type { Pokemon } from '../types';
import AnimatedSprite from './AnimatedSprite';

interface DashboardProps {
    pokemonList: Pokemon[];
    onPokemonSelect: (pokemon: Pokemon) => void;
    onSetView: (view: 'dashboard' | 'grid') => void;
}

const featuredPokemonNames = ['Charizard', 'Blastoise', 'Dragonite', 'Gengar', 'Salamence', 'Darkrai'];

const Dashboard: React.FC<DashboardProps> = ({ pokemonList, onPokemonSelect, onSetView }) => {
    const featuredPokemon = pokemonList.filter(p => featuredPokemonNames.includes(p.name))
        .sort((a, b) => featuredPokemonNames.indexOf(a.name) - featuredPokemonNames.indexOf(b.name));

    return (
        <div className="bg-zinc-800 rounded-lg p-4 sm:p-6 shadow-lg border border-zinc-700">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Welcome to the PBR Workshop</h2>
                <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">
                    Browse the database, customize your favorite Pokémon, and manage your team.
                </p>
            </div>

            <div className="mt-8">
                <button
                    onClick={() => onSetView('grid')}
                    className="w-full text-center bg-accent-red text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-red-700 text-lg"
                >
                    Browse Full Pokédex &raquo;
                </button>
            </div>
            
            <div className="mt-10">
                <h3 className="text-xl font-bold text-zinc-200 mb-4 text-center sm:text-left">Featured Pokémon</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {featuredPokemon.map(pokemon => (
                        <div
                            key={pokemon.id}
                            className="bg-zinc-700 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:bg-zinc-600 hover:scale-105 hover:shadow-red-500/10 shadow-md border border-zinc-600 hover:border-zinc-500 flex flex-col justify-between"
                            onClick={() => onPokemonSelect(pokemon)}
                        >
                            <AnimatedSprite
                                pokemon={pokemon}
                                className="mx-auto h-24 w-24"
                            />
                            <p className="mt-3 text-md font-semibold text-zinc-200 capitalize truncate">{pokemon.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
