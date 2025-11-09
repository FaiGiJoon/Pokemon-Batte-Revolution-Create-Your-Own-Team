import React, { useState, useMemo } from 'react';
import type { Trainer, StoredPokemon } from '../../types';
import { getPokemonDatabase } from '../../services/pokemonService';
import AnimatedSprite from '../AnimatedSprite';

interface TrainerCardProps {
    trainer: Trainer;
    onLoadTeam: (team: StoredPokemon[], trainerName: string) => void;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const PokeballIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#fff" stroke="#4b5563" strokeWidth="4"/>
        <path d="M50 50 L98 50 A48 48 0 0 0 50 2 Z" fill="#f87171"/>
        <path d="M50 50 H2 A48 48 0 0 1 50 2 Z" fill="#f87171"/>
        <line x1="2" y1="50" x2="98" y2="50" stroke="#4b5563" strokeWidth="4"/>
        <circle cx="50" cy="50" r="15" fill="#fff" stroke="#4b5563" strokeWidth="4"/>
        <circle cx="50" cy="50" r="8" fill="#fff" stroke="#4b5563" strokeWidth="2"/>
    </svg>
);


const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onLoadTeam }) => {
    const [pokemonDb] = useState(() => getPokemonDatabase());
    
    const hydratedTeam = useMemo(() => {
        return trainer.team.map((trainerMon, i) => {
            const pokemon = pokemonDb.find(p => p.name === trainerMon.pokemonName);
            if (!pokemon) return null;
            
            const set = pokemon.sets.find(s => s.sourceName === trainerMon.setSourceName);
            if (!set) return null;

            const storedPokemon: StoredPokemon = {
                pokemonId: pokemon.id,
                set: set,
                instanceId: Date.now() + i,
            };
            
            return { ...storedPokemon, pokemon };
        }).filter(Boolean);
    }, [trainer.team, pokemonDb]);

    const handleLoadClick = () => {
        if (hydratedTeam.length > 0) {
            onLoadTeam(hydratedTeam as StoredPokemon[], trainer.name);
        }
    };

    const gradient = `bg-gradient-to-br ${trainer.passColor.from} ${trainer.passColor.to}`;

    return (
        <div className={`p-3 rounded-lg shadow-md border border-zinc-900/50 ${gradient}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-black/20 border-2 border-white/50 flex items-center justify-center p-1">
                        <UserIcon className="w-full h-full text-white/80" />
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>{trainer.title}</p>
                        <h4 className="text-white text-xl font-bold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{trainer.name}</h4>
                    </div>
                </div>
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap pt-1">Battle Pass</span>
            </div>
            
            <div className="grid grid-cols-6 gap-2 mt-3">
                {hydratedTeam.map((item) => (
                    item && (
                        <div key={item.instanceId} className="aspect-square bg-black/20 rounded-full border-2 border-white/40 shadow-inner flex items-center justify-center" title={item.pokemon.name}>
                            <AnimatedSprite
                                pokemon={item.pokemon}
                                className="w-full h-full object-contain scale-110"
                                isShiny={item.set.isShiny}
                            />
                        </div>
                    )
                ))}
            </div>

            <div className="mt-3 flex justify-end">
                 <button 
                    onClick={handleLoadClick}
                    className="bg-zinc-100 text-zinc-800 font-bold py-1.5 px-3 text-sm rounded-md shadow-md border-b-2 border-zinc-400 transition-all hover:bg-white active:border-b-0 active:mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={hydratedTeam.length === 0}
                >
                    Load Team
                </button>
            </div>
        </div>
    );
};

export default TrainerCard;
