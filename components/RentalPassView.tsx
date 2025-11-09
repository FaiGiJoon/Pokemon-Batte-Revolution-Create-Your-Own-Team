import React from 'react';
import type { HydratedStoredPokemon } from '../types';
import AnimatedSprite from './AnimatedSprite';

interface RentalPassViewProps {
  box: HydratedStoredPokemon[];
  passName: string;
  onPassNameChange: (name: string) => void;
  displayMode: 'user' | 'default';
  defaultPass: HydratedStoredPokemon[];
}

const PokeballPLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM0 12C0 5.37 5.37 0 12 0s12 5.37 12 12-5.37 12-12 12S0 18.63 0 12zm12 8c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c0 2.21 1.79 4 4 4h1v-4h4v-2h-4V6h-1c-2.21 0-4 1.79-4 4z" />
    </svg>
);


const RentalPassView: React.FC<RentalPassViewProps> = ({ box, passName, onPassNameChange, displayMode, defaultPass }) => {
    const slots = Array.from({ length: 6 });

    const isDefaultView = displayMode === 'default';
    const currentBox = isDefaultView ? defaultPass : box;
    const currentPassName = isDefaultView ? 'Novice Nate' : passName;


    return (
        <div className="bg-zinc-800 rounded-lg p-4 shadow-lg border border-zinc-700">
             <h3 className="text-lg font-semibold text-zinc-200 mb-4">Rental Pass Preview</h3>
            <div className="bg-zinc-900 p-1 rounded-xl shadow-lg">
                <div className="bg-white p-1 rounded-lg">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-600 rounded-md p-3 relative overflow-hidden">
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 -ml-1">
                                    <input
                                        type="text"
                                        value={currentPassName}
                                        onChange={(e) => onPassNameChange(e.target.value)}
                                        className={`bg-transparent text-white font-bold text-xl sm:text-2xl w-full focus:outline-none rounded px-1 placeholder-zinc-200/70 ${isDefaultView ? 'cursor-default' : 'focus:bg-black/20'}`}
                                        placeholder="Enter Pass Name"
                                        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}
                                        readOnly={isDefaultView}
                                    />
                                </div>
                                <span className="text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap pt-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Battle Pass</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {slots.map((_, index) => {
                                    const item = currentBox[index];
                                    return (
                                        <div key={index} className="aspect-square bg-black/20 rounded-full border-4 border-slate-300 shadow-inner flex items-center justify-center overflow-hidden">
                                            {item ? (
                                                <AnimatedSprite
                                                    pokemon={item.pokemon}
                                                    className="w-full h-full object-contain scale-125"
                                                    isShiny={item.set.isShiny}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-black/10 rounded-full"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-2 flex justify-between items-center">
                               <div className="text-gray-700 opacity-60 flex items-center gap-1">
                                 <PokeballPLogo className="w-6 h-6" />
                                 <div className="h-4 w-px bg-gray-600"></div>
                                 <PokeballPLogo className="w-6 h-6" />
                               </div>
                               <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-4 text-sm rounded-md shadow-md border-b-2 border-green-700 transition-all active:border-b-0 active:mt-0.5" disabled>
                                   Get This Pass
                               </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalPassView;