import React from 'react';
import type { StoredPokemon } from '../../types';
import { getPassCategories } from '../../services/passService';
import TrainerCard from './TrainerCard';

interface BattlePassesViewProps {
  onSetView: (view: 'dashboard' | 'grid' | 'passes') => void;
  onLoadTeam: (team: StoredPokemon[], trainerName: string) => void;
}

const BattlePassesView: React.FC<BattlePassesViewProps> = ({ onSetView, onLoadTeam }) => {
  const categories = getPassCategories();

  return (
    <div className="bg-zinc-800 rounded-lg p-4 sm:p-6 shadow-lg border border-zinc-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-200">Battle Pass Browser</h2>
        <button
          onClick={() => onSetView('dashboard')}
          className="text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold py-1 px-3 rounded-md transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category.title}>
            <h3 className="text-xl font-bold text-accent-red mb-4 pb-2 border-b-2 border-zinc-700">{category.title}</h3>
            <div className="space-y-8">
              {category.passes.map((pass) => (
                <div key={pass.id}>
                    <p className="text-zinc-400 font-semibold mb-3">{pass.title}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pass.trainers.map((trainer) => (
                            <TrainerCard 
                                key={trainer.name}
                                trainer={trainer}
                                onLoadTeam={onLoadTeam}
                            />
                        ))}
                    </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattlePassesView;