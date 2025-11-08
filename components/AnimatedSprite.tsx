import React, { useState, useEffect } from 'react';
import type { Pokemon } from '../types';

interface AnimatedSpriteProps {
    pokemon: Pokemon;
    className?: string;
    onClick?: () => void;
}

const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({ pokemon, className, onClick }) => {
    const [useStatic, setUseStatic] = useState(false);

    useEffect(() => {
        setUseStatic(false);
    }, [pokemon]);

    const handleError = () => {
        setUseStatic(true);
    };

    return (
        <img 
            src={useStatic ? pokemon.sprite.static : pokemon.sprite.animated}
            alt={pokemon.name}
            className={className}
            onError={handleError}
            onClick={onClick}
            loading="lazy"
        />
    );
};

export default AnimatedSprite;
