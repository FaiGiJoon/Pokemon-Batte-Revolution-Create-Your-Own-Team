
import React from 'react';
import { PokemonType } from '../types';
import { TYPE_COLORS } from '../constants';

interface TypeBadgeProps {
  type: PokemonType;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const colorClass = TYPE_COLORS[type] || 'bg-gray-500';

  return (
    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full uppercase tracking-wider ${colorClass}`}>
      {type}
    </span>
  );
};

export default TypeBadge;
