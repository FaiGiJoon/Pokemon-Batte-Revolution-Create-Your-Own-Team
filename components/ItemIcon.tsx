import React, { useState, useEffect } from 'react';

const formatItemNameForSprite = (name: string): string => {
  if (!name) return '';
  return name.toLowerCase().replace(/ /g, '-');
};

interface ItemIconProps {
  itemName: string;
  className?: string;
}

const ItemIcon: React.FC<ItemIconProps> = ({ itemName, className }) => {
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setError(false);
  }, [itemName]);

  if (!itemName) {
     return null;
  }
  
  const spriteName = formatItemNameForSprite(itemName);
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${spriteName}.png`;

  if (error) {
     return (
        <div className={`bg-zinc-700 border border-zinc-600 rounded-full flex items-center justify-center ${className || 'w-6 h-6'}`} title={`Unknown item: ${itemName}`}>
            <span className="text-zinc-400 text-xs font-mono">?</span>
        </div>
    );
  }

  return (
    <img
      src={spriteUrl}
      alt={itemName}
      title={itemName}
      className={`${className || 'w-6 h-6'}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ItemIcon;
