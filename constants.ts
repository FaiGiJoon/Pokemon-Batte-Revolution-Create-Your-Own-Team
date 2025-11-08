import { PokemonType } from './types';

export const TYPE_COLORS: Record<PokemonType, string> = {
  [PokemonType.Normal]: 'bg-poke-normal',
  [PokemonType.Fire]: 'bg-poke-fire',
  [PokemonType.Water]: 'bg-poke-water',
  [PokemonType.Grass]: 'bg-poke-grass',
  [PokemonType.Electric]: 'bg-poke-electric',
  [PokemonType.Ice]: 'bg-poke-ice',
  [PokemonType.Fighting]: 'bg-poke-fighting',
  [PokemonType.Poison]: 'bg-poke-poison',
  [PokemonType.Ground]: 'bg-poke-ground',
  [PokemonType.Flying]: 'bg-poke-flying',
  [PokemonType.Psychic]: 'bg-poke-psychic',
  [PokemonType.Bug]: 'bg-poke-bug',
  [PokemonType.Rock]: 'bg-poke-rock',
  [PokemonType.Ghost]: 'bg-poke-ghost',
  [PokemonType.Dragon]: 'bg-poke-dragon',
  [PokemonType.Dark]: 'bg-poke-dark',
  [PokemonType.Steel]: 'bg-poke-steel',
  [PokemonType.Fairy]: 'bg-poke-fairy',
};
