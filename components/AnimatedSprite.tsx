import React, { useState, useEffect } from 'react';
import type { Pokemon } from '../types';

interface AnimatedSpriteProps {
    pokemon: Pokemon;
    className?: string;
    onClick?: () => void;
    isShiny?: boolean;
}

const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({ pokemon, className, onClick, isShiny }) => {
    const [useStatic, setUseStatic] = useState(false);

    const spriteSet = isShiny ? pokemon.shinySprite : pokemon.sprite;

    useEffect(() => {
        setUseStatic(false);
    }, [pokemon, isShiny]);

    const handleError = () => {
        setUseStatic(true);
    };

    return (
        <img 
            src={useStatic ? spriteSet.static : spriteSet.animated}
            alt={pokemon.name}
            className={className}
            onError={handleError}
            onClick={onClick}
            loading="lazy"
        />
    );
};

export default AnimatedSprite;