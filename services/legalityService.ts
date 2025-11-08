// A simplified version of a legality checker. In a full app, this would be a much larger database.
// This data represents a subset of legal moves for each Pokémon in Gen 4 (HeartGold/SoulSilver).

const LEGAL_MOVES_DATA: Record<string, Set<string>> = {
  'Charizard': new Set(['Air Slash', 'Blast Burn', 'Dragon Claw', 'Dragon Dance', 'Dragon Pulse', 'Earthquake', 'Fire Blast', 'Fire Fang', 'Fire Punch', 'Flamethrower', 'Flare Blitz', 'Focus Blast', 'Heat Wave', 'Overheat', 'Roost', 'Shadow Claw', 'Solar Beam', 'Swords Dance', 'Tailwind', 'Thunder Punch', 'Will-O-Wisp']),
  'Blastoise': new Set(['Aqua Jet', 'Aqua Tail', 'Avalanche', 'Blizzard', 'Brick Break', 'Counter', 'Dive', 'Earthquake', 'Fake Out', 'Flash Cannon', 'Focus Blast', 'Hydro Cannon', 'Hydro Pump', 'Ice Beam', 'Ice Punch', 'Iron Defense', 'Mirror Coat', 'Rapid Spin', 'Roar', 'Skull Bash', 'Surf', 'Waterfall', 'Zen Headbutt']),
  'Dragonite': new Set(['Aerial Ace', 'Aqua Tail', 'Blizzard', 'Brick Break', 'Dragon Claw', 'Dragon Dance', 'Dragon Pulse', 'Dragon Rush', 'Draco Meteor', 'Earthquake', 'Extreme Speed', 'Fire Blast', 'Fire Punch', 'Flamethrower', 'Fly', 'Focus Punch', 'Giga Impact', 'Hyper Beam', 'Ice Beam', 'Ice Punch', 'Iron Head', 'Outrage', 'Roost', 'Stone Edge', 'Superpower', 'Surf', 'Thunder', 'Thunderbolt', 'Thunder Wave', 'Waterfall']),
  'Gengar': new Set(['Brick Break', 'Confuse Ray', 'Counter', 'Dark Pulse', 'Destiny Bond', 'Disable', 'Dream Eater', 'Energy Ball', 'Explosion', 'Fake Out', 'Focus Blast', 'Focus Punch', 'Giga Drain', 'Hypnosis', 'Ice Punch', 'Icy Wind', 'Mean Look', 'Metronome', 'Nasty Plot', 'Night Shade', 'Pain Split', 'Perish Song', 'Psychic', 'Rain Dance', 'Shadow Ball', 'Shadow Claw', 'Skill Swap', 'Sludge Bomb', 'Spite', 'Substitute', 'Sunny Day', 'Taunt', 'Thunder', 'Thunderbolt', 'Thunder Punch', 'Torment', 'Toxic', 'Trick', 'Trick Room', 'Will-O-Wisp']),
  'Salamence': new Set(['Aerial Ace', 'Aqua Tail', 'Brick Break', 'Crunch', 'Double-Edge', 'Draco Meteor', 'Dragon Claw', 'Dragon Dance', 'Dragon Pulse', 'Dragon Rush', 'Earthquake', 'Fire Blast', 'Fire Fang', 'Flamethrower', 'Fly', 'Giga Impact', 'Heat Wave', 'Hydro Pump', 'Hyper Beam', 'Iron Tail', 'Outrage', 'Protect', 'Rain Dance', 'Roar', 'Rock Slide', 'Roost', 'Shadow Claw', 'Stone Edge', 'Sunny Day', 'Thunder Fang', 'Toxic', 'Twister', 'Wish', 'Zen Headbutt']),
  'Darkrai': new Set(['Aerial Ace', 'Blizzard', 'Brick Break', 'Calm Mind', 'Charge Beam', 'Dark Pulse', 'Dark Void', 'Dream Eater', 'Embargo', 'Focus Blast', 'Giga Impact', 'Haze', 'Hyper Beam', 'Hypnosis', 'Ice Beam', 'Nasty Plot', 'Nightmare', 'Ominous Wind', 'Poison Jab', 'Psychic', 'Rain Dance', 'Rock Slide', 'Shadow Ball', 'Shadow Claw', 'Shock Wave', 'Sludge Bomb', 'Snatch', 'Spite', 'Sunny Day', 'Swords Dance', 'Taunt', 'Thunder', 'Thunderbolt', 'Thunder Wave', 'Torment', 'Toxic', 'Trick', 'Will-O-Wisp', 'X-Scissor']),
  'Manaphy': new Set(['Acid Armor', 'Aqua Ring', 'Blizzard', 'Brine', 'Bubble', 'Bubble Beam', 'Calm Mind', 'Charm', 'Dive', 'Energy Ball', 'Flash', 'Grass Knot', 'Hail', 'Heart Swap', 'Ice Beam', 'Icy Wind', 'Light Screen', 'Protect', 'Psychic', 'Rain Dance', 'Reflect', 'Rest', 'Safeguard', 'Shadow Ball', 'Signal Beam', 'Skill Swap', 'Surf', 'Supersonic', 'Swagger', 'Tail Glow', 'Toxic', 'U-turn', 'Water Pulse', 'Waterfall', 'Whirlpool']),
};

/**
 * Checks if a move is legal for a given Pokémon.
 * @param pokemonName The name of the Pokémon.
 * @param moveName The name of the move.
 * @returns True if the move is legal, false otherwise.
 *          Returns true if the move name is empty or the Pokémon is not in the database.
 */
export const isMoveLegal = (pokemonName: string, moveName: string): boolean => {
    // An empty move slot is always legal.
    if (!moveName || moveName.trim() === '') {
        return true;
    }

    const moveset = LEGAL_MOVES_DATA[pokemonName];

    // If we don't have data for this Pokémon, assume the move is legal to avoid false negatives.
    if (!moveset) {
        return true;
    }

    // Perform a case-insensitive search for the move.
    for (const legalMove of moveset) {
        if (legalMove.toLowerCase() === moveName.toLowerCase()) {
            return true;
        }
    }

    return false;
};
