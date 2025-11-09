import React from 'react';
import { PokemonType } from '../types';
import { TYPE_COLORS, TYPE_ABBREVIATIONS } from '../constants';

interface MoveTypeIconProps {
  type: PokemonType;
  className?: string;
}

const MoveTypeIcon: React.FC<MoveTypeIconProps> = ({ type, className }) => {
  const colorClass = TYPE_COLORS[type] || 'bg-gray-500';
  const abbreviation = TYPE_ABBREVIATIONS[type] || '???';

  return (
    <span className={`inline-block ${colorClass} ${className} text-white text-[10px] font-bold w-9 h-4 text-center rounded-sm leading-4 shadow-sm`}>
      {abbreviation}
    </span>
  );
};

export default MoveTypeIcon;
