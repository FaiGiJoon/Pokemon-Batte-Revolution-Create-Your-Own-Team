import React from 'react';

interface StatBarProps {
  statName: string;
  value: number;
  maxValue: number;
  color: string;
}

const STAT_FULL_NAMES: Record<string, string> = {
  'HP': 'Hit Points',
  'Attack': 'Attack',
  'Defense': 'Defense',
  'Sp. Atk': 'Special Attack',
  'Sp. Def': 'Special Defense',
  'Speed': 'Speed',
};

const StatBar: React.FC<StatBarProps> = ({ statName, value, maxValue, color }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const fullStatName = STAT_FULL_NAMES[statName] || statName;

  return (
    <div className="flex items-center gap-2" title={`${fullStatName}: ${value}`}>
      <span className="text-xs font-semibold text-zinc-400 w-16 text-right">{statName}</span>
      <div className="w-full bg-zinc-700 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
       <span className="text-xs font-bold text-zinc-300 w-8 text-left">{value}</span>
    </div>
  );
};

export default StatBar;