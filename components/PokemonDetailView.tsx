import React, { useState, useEffect } from 'react';
import type { Pokemon, BattleSet, StoredPokemon } from '../types';
import { isMoveLegal } from '../services/legalityService';
import { getMoveType, getMoveDetails } from '../services/moveService';
import StatBar from './StatBar';
import TypeBadge from './TypeBadge';
import AnimatedSprite from './AnimatedSprite';
import MoveTypeIcon from './MoveTypeIcon';
import ItemIcon from './ItemIcon';

interface PokemonDetailViewProps {
  pokemon: Pokemon;
  initialSet?: BattleSet;
  onAddToBox: (pokemon: Pokemon, set: BattleSet) => void;
  storageBox: StoredPokemon[];
}

const EditIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const WarningIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const PokemonDetailView: React.FC<PokemonDetailViewProps> = ({ pokemon, initialSet, onAddToBox, storageBox }) => {
  const [selectedSetIndex, setSelectedSetIndex] = useState(0);
  const [mode, setMode] = useState<'browse' | 'edit'>('browse');
  const [editableSet, setEditableSet] = useState<BattleSet | null>(null);
  const [moveValidity, setMoveValidity] = useState<boolean[]>([true, true, true, true]);

  const isSingleSetView = !!initialSet;
  const displayedSet = isSingleSetView ? initialSet : pokemon.sets[selectedSetIndex];
  const currentSet = mode === 'edit' ? editableSet : displayedSet;

  useEffect(() => {
    setSelectedSetIndex(0);
    setMode('browse');
    setEditableSet(null);
  }, [pokemon]);
  
  useEffect(() => {
    if (mode === 'edit' && editableSet) {
      const validity = editableSet.moves.map(move => isMoveLegal(pokemon.name, move));
      setMoveValidity(validity);
    }
  }, [editableSet?.moves, mode, pokemon.name]);

  const hasIllegalMoves = moveValidity.includes(false);

  const handleStartEdit = (set: BattleSet) => {
    const newSet = JSON.parse(JSON.stringify(set));
    newSet.isCustom = true;
    newSet.setName = newSet.setName || `Custom ${pokemon.name}`;
    newSet.sourceName = `custom-${pokemon.id}-${Date.now()}`;
    newSet.isShiny = set.isShiny || false;
    setEditableSet(newSet);
    setMode('edit');
  };

  const handleCreateNew = () => {
    const templateSet = pokemon.sets[0] || {
        sourceName: '', box: '', gender: 'M', level: 100, ability: '', moves: ['', '', '', ''], heldItem: '',
        stats: { hp: 1, attack: 1, defense: 1, spAtk: 1, spDef: 1, speed: 1 }
    };
    handleStartEdit(templateSet);
  };

  const handleCancelEdit = () => {
    setMode('browse');
    setEditableSet(null);
  };

  const handleSetChange = (field: string, value: string | number | boolean) => {
    if (!editableSet) return;

    const keys = field.split('.');
    let newSet = { ...editableSet };
    if (keys.length === 2 && keys[0] === 'stats') {
        newSet = { ...newSet, stats: { ...newSet.stats, [keys[1]]: Number(value) || 0 }};
    } else {
        (newSet as any)[keys[0]] = value;
    }
    setEditableSet(newSet);
  };

  const handleMoveChange = (index: number, value: string) => {
      if (!editableSet) return;
      const newMoves = [...editableSet.moves];
      newMoves[index] = value;
      setEditableSet({ ...editableSet, moves: newMoves });
  }

  const handleAddClick = () => {
    if (mode === 'edit' && editableSet) {
      onAddToBox(pokemon, editableSet);
      setMode('browse');
      setEditableSet(null);
    } else if (mode === 'browse' && displayedSet) {
      onAddToBox(pokemon, displayedSet);
    }
  };

  const isBoxFull = storageBox.length >= 6;
  const isInBox = mode === 'browse' && !isSingleSetView && displayedSet ? !!storageBox.find(p => p.set.sourceName === displayedSet.sourceName && !p.set.isCustom) : false;
  
  const buttonDisabled = isBoxFull || isInBox || (mode === 'edit' && hasIllegalMoves);
  let buttonText = "Add to Box";
  if (isInBox) buttonText = "In Box";
  if (isBoxFull && !isInBox) buttonText = "Box Full";
  if (mode === 'edit' && !isBoxFull) buttonText = "Save Custom Set to Box";
  if (mode === 'edit' && hasIllegalMoves) buttonText = "Illegal Moves Detected";

  const getSetTitle = () => {
    if (mode === 'edit' && editableSet?.setName) return editableSet.setName;
    if (isSingleSetView && initialSet.setName) return initialSet.setName;
    if (isSingleSetView) return "Set Details";
    return `Set Details (Lvl ${displayedSet.level})`;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="bg-zinc-700 rounded-full p-2">
          <AnimatedSprite pokemon={pokemon} className="h-28 w-28" isShiny={currentSet?.isShiny} />
        </div>
        <h2 className="text-3xl font-bold capitalize mt-4 text-zinc-100">{pokemon.name}</h2>
        <div className="flex gap-2 mt-2">
          {pokemon.types.map(type => <TypeBadge key={type} type={type} />)}
        </div>
        {pokemon.rentalPasses && pokemon.rentalPasses.length > 0 && (
          <div className="mt-3 text-center bg-zinc-700/50 px-3 py-2 rounded-lg w-full">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Found on Rental Pass</h4>
            <p className="text-zinc-200 text-sm font-medium">{pokemon.rentalPasses.join(', ')}</p>
          </div>
        )}
      </div>
      
      {mode === 'browse' ? (
        <>
            {!isSingleSetView && (
              <>
                <div className="mt-6 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-accent-red">Available Sets</h3>
                    <button onClick={handleCreateNew} className="text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold py-1 px-3 rounded-md transition-colors">Create New Set</button>
                </div>
                <div className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-2">
                {pokemon.sets.map((set, index) => (
                    <div 
                    key={index} 
                    onClick={() => setSelectedSetIndex(index)}
                    className={`p-3 rounded-md cursor-pointer transition-colors border flex justify-between items-center ${selectedSetIndex === index ? 'bg-zinc-600 border-accent-red' : 'bg-zinc-700 border-transparent hover:bg-zinc-600/50'}`}
                    >
                        <div className="text-sm">
                            <span className="font-bold text-zinc-200">Set {index + 1}: {set.ability}</span>
                            <div className="text-zinc-400 block sm:inline-flex items-center gap-2 sm:ml-2 mt-1 sm:mt-0">
                                {set.heldItem && <ItemIcon itemName={set.heldItem} className="w-8 h-8" />}
                                <span className="font-medium text-zinc-200 text-lg">{set.heldItem || 'No Item'}</span>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleStartEdit(set);}} className="text-zinc-400 hover:text-accent-red p-1" title="Customize this set">
                            <EditIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
                </div>
              </>
            )}

            {displayedSet && (
                <>
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-3">
                           <h3 className="text-lg font-semibold text-accent-red">{getSetTitle()}</h3>
                           {isSingleSetView && (
                               <button onClick={() => handleStartEdit(displayedSet)} className="text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold py-1 px-3 rounded-md transition-colors flex items-center gap-2">
                                   <EditIcon className="w-4 h-4" /> Customize
                               </button>
                           )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-base mb-4 bg-zinc-700 p-3 rounded-md">
                            <div className="text-zinc-300"><strong>Ability:</strong> <span className="text-zinc-100">{displayedSet.ability}</span></div>
                            <div className="text-zinc-300 flex items-center gap-2">
                                <strong>Item:</strong> 
                                {displayedSet.heldItem ? (
                                    <>
                                        <ItemIcon itemName={displayedSet.heldItem} className="w-8 h-8"/>
                                        <span className="text-zinc-100 text-lg">{displayedSet.heldItem}</span>
                                    </>
                                ) : (
                                    <span className="text-zinc-100">No Item</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                        <StatBar statName="HP" value={displayedSet.stats.hp} maxValue={714} color="bg-red-500" />
                        <StatBar statName="Attack" value={displayedSet.stats.attack} maxValue={460} color="bg-orange-500" />
                        <StatBar statName="Defense" value={displayedSet.stats.defense} maxValue={614} color="bg-yellow-500" />
                        <StatBar statName="Sp. Atk" value={displayedSet.stats.spAtk} maxValue={450} color="bg-blue-500" />
                        <StatBar statName="Sp. Def" value={displayedSet.stats.spDef} maxValue={610} color="bg-green-500" />
                        <StatBar statName="Speed" value={displayedSet.stats.speed} maxValue={438} color="bg-pink-500" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-accent-red mb-3">Moves</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {displayedSet.moves.map((move, index) => {
                                if (!move) return null;
                                const moveType = getMoveType(move);
                                const moveDetails = getMoveDetails(move);
                                
                                let tooltip = move;
                                let moveStats = null;

                                if (moveDetails) {
                                    const power = moveDetails.power ?? '—';
                                    const accuracy = moveDetails.accuracy ? `${moveDetails.accuracy}%` : '—';
                                    tooltip = `${moveDetails.name}  |  Power: ${power} | Acc: ${accuracy} | PP: ${moveDetails.pp}`;
                                    moveStats = (
                                        <div className="flex justify-between text-xs text-zinc-400 mt-1.5 pt-1.5 border-t border-zinc-600/50">
                                            <span title="Power">P: {power}</span>
                                            <span title="Accuracy">A: {accuracy}</span>
                                            <span title="Power Points">PP: ${moveDetails.pp}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={index} className="p-2 rounded-lg bg-zinc-700 shadow-sm" title={tooltip}>
                                        <div className="flex items-center gap-2">
                                            {moveType ? <MoveTypeIcon type={moveType} /> : <div className="w-9 h-4" />}
                                            <span className="text-zinc-200 text-sm font-semibold truncate">{move}</span>
                                        </div>
                                        {moveStats}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
            <button onClick={handleAddClick} disabled={buttonDisabled} className="mt-6 w-full bg-accent-red text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-red-700 disabled:bg-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-400">
                {buttonText}
            </button>
        </>
      ) : editableSet && (
        <div className="mt-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-accent-red mb-3">{getSetTitle()}</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-zinc-400">Set Name</label>
                        <input type="text" value={editableSet.setName} onChange={e => handleSetChange('setName', e.target.value)} className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 px-3 text-zinc-300 focus:ring-2 focus:ring-accent-red focus:outline-none"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-zinc-400">Ability</label>
                        <input type="text" value={editableSet.ability} onChange={e => handleSetChange('ability', e.target.value)} className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 px-3 text-zinc-300 focus:ring-2 focus:ring-accent-red focus:outline-none"/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-sm font-medium text-zinc-400">Held Item</label>
                        <div className="relative mt-1">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center">
                                {editableSet.heldItem && <ItemIcon itemName={editableSet.heldItem} className="w-8 h-8" />}
                            </div>
                            <input 
                                type="text" 
                                value={editableSet.heldItem} 
                                onChange={e => handleSetChange('heldItem', e.target.value)} 
                                placeholder="No Item"
                                className={`w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 pr-3 text-zinc-200 text-lg focus:ring-2 focus:ring-accent-red focus:outline-none transition-all ${editableSet.heldItem ? 'pl-12' : 'pl-3'}`}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-zinc-400">Level</label>
                            <input type="number" value={editableSet.level} onChange={e => handleSetChange('level', e.target.value)} className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 px-3 text-zinc-300 focus:ring-2 focus:ring-accent-red focus:outline-none"/>
                        </div>
                        <div className="flex items-end pb-1">
                            <div className="flex items-center h-full">
                                <input
                                    id="shiny-checkbox"
                                    type="checkbox"
                                    checked={editableSet.isShiny || false}
                                    onChange={e => handleSetChange('isShiny', e.target.checked)}
                                    className="w-4 h-4 text-accent-red bg-zinc-700 border-zinc-600 rounded focus:ring-accent-red"
                                />
                                <label htmlFor="shiny-checkbox" className="ml-2 text-sm font-medium text-zinc-300">Shiny</label>
                            </div>
                        </div>
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium text-zinc-400">Moves</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        {[0, 1, 2, 3].map(i => {
                             const moveName = editableSet.moves[i] || '';
                             const moveType = getMoveType(moveName);
                             const moveDetails = getMoveDetails(moveName);
                             const isIllegal = !moveValidity[i] && moveName;
                             
                             let tooltip = '';
                             if (moveDetails) {
                                 const power = moveDetails.power ?? '—';
                                 const accuracy = moveDetails.accuracy ? `${moveDetails.accuracy}%` : '—';
                                 tooltip = `${moveDetails.name}  |  Power: ${power} | Acc: ${accuracy} | PP: ${moveDetails.pp}`;
                             } else if (moveName) {
                                 tooltip = `Unknown Move: ${moveName}`;
                             }

                             return (
                             <div key={i} className="relative" title={tooltip}>
                                 {moveType && (
                                     <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                        <MoveTypeIcon type={moveType} />
                                     </div>
                                 )}
                                 <input type="text" value={moveName} onChange={e => handleMoveChange(i, e.target.value)} className={`w-full bg-zinc-900 border rounded-md py-2 text-zinc-300 focus:ring-2 focus:ring-accent-red focus:outline-none ${isIllegal ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-zinc-700'} ${moveType ? 'pl-12' : 'pl-3'} ${isIllegal ? 'pr-8' : 'pr-3'}`}/>
                                 {isIllegal && (
                                     <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400" title="This move is likely illegal for this Pokémon.">
                                         <WarningIcon className="w-5 h-5"/>
                                     </div>
                                 )}
                             </div>
                             );
                        })}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-zinc-400">Stats</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-1 bg-zinc-700 p-3 rounded-md">
                        {Object.entries(editableSet.stats).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-zinc-400 w-16 text-right capitalize">{key.replace('sp', 'Sp. ')}</label>
                                <input type="number" value={value} onChange={e => handleSetChange(`stats.${key}`, e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1 px-2 text-zinc-300 focus:ring-2 focus:ring-accent-red focus:outline-none"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {hasIllegalMoves && (
              <div className="mt-4 p-3 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-md text-sm flex items-center gap-2" role="alert">
                  <WarningIcon className="w-5 h-5 flex-shrink-0" />
                  <span>One or more moves are not in the known legal moveset for this Pokémon and cannot be saved.</span>
              </div>
            )}
            <div className="mt-6 flex gap-4">
                <button onClick={handleCancelEdit} className="w-full bg-zinc-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-zinc-700">
                    Cancel
                </button>
                <button onClick={handleAddClick} disabled={buttonDisabled} className="w-full bg-accent-red text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-red-700 disabled:bg-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-400">
                    {buttonText}
                </button>
            </div>
        </div>
      )}
    </>
  );
};

export default PokemonDetailView;