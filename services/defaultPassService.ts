import { HydratedStoredPokemon, PokemonType, BattleSet, Pokemon } from '../types';

// These are mock Pokémon objects as they do not exist in the main database.
// They are created for display purposes only in the default Rental Pass.
const DEFAULT_PASS_POKEMON: Omit<Pokemon, 'sets' | 'rentalPasses'>[] = [
    { id: 444, name: 'Gabite', types: [PokemonType.Dragon, PokemonType.Ground], sprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/444.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/444.png` }, shinySprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/444.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/444.png` } },
    { id: 391, name: 'Monferno', types: [PokemonType.Fire, PokemonType.Fighting], sprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/391.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/391.png` }, shinySprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/391.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/391.png` } },
    { id: 394, name: 'Prinplup', types: [PokemonType.Water], sprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/394.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/394.png` }, shinySprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/394.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/394.png` } },
    { id: 397, name: 'Staravia', types: [PokemonType.Normal, PokemonType.Flying], sprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/397.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/397.png` }, shinySprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/397.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/397.png` } },
    { id: 404, name: 'Luxio', types: [PokemonType.Electric], sprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/404.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/404.png` }, shinySprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/404.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/404.png` } },
    { id: 388, name: 'Grotle', types: [PokemonType.Grass], sprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/388.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/388.png` }, shinySprite: { animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/388.gif`, static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/388.png` } },
];

const mockBattleSet: BattleSet = {
    sourceName: 'default-pass-set',
    isShiny: false,
    box: '',
    gender: 'M',
    level: 50,
    ability: 'Default',
    moves: [],
    heldItem: '',
    stats: { hp: 100, attack: 100, defense: 100, spAtk: 100, spDef: 100, speed: 100 },
};

export const getDefaultPassData = (): HydratedStoredPokemon[] => {
    return DEFAULT_PASS_POKEMON.map((p, index) => ({
        pokemonId: p.id,
        instanceId: -(index + 1), // Use negative IDs to distinguish from user pokemon
        set: mockBattleSet,
        pokemon: { ...p, sets: [mockBattleSet] },
    }));
};
