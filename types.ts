export enum PokemonType {
  Normal = 'Normal',
  Fire = 'Fire',
  Water = 'Water',
  Grass = 'Grass',
  Electric = 'Electric',
  Ice = 'Ice',
  Fighting = 'Fighting',
  Poison = 'Poison',
  Ground = 'Ground',
  Flying = 'Flying',
  Psychic = 'Psychic',
  Bug = 'Bug',
  Rock = 'Rock',
  Ghost = 'Ghost',
  Dragon = 'Dragon',
  Dark = 'Dark',
  Steel = 'Steel',
}

export interface BattleSet {
  sourceName: string; // Unique identifier. For DB sets, it's the raw string from the file.
  setName?: string; // User-defined name for the set.
  isCustom?: boolean;
  isShiny?: boolean;
  box: string;
  gender: string;
  level: number;
  ability: string;
  moves: string[];
  heldItem: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAtk: number;
    spDef: number;
    speed: number;
  };
}

export interface Pokemon {
  id: number;
  name:string;
  types: PokemonType[];
  sprite: {
    animated: string;
    static: string;
  };
  shinySprite: {
    animated: string;
    static: string;
  };
  sets: BattleSet[];
  rentalPasses?: string[];
}

export interface StoredPokemon {
  pokemonId: number;
  set: BattleSet;
  instanceId: number;
}

export interface HydratedStoredPokemon extends StoredPokemon {
  pokemon: Pokemon;
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export interface UserProfile {
  id: number;
  name: string;
  team: StoredPokemon[];
  lineRange: { start: number; end: number };
}

export interface ParsedSaveFile {
  profiles: UserProfile[];
  rawLines: string[];
}

export interface TrainerPokemon {
  pokemonName: string;
  setSourceName: string;
}

export interface Trainer {
  name: string;
  title: string;
  team: TrainerPokemon[];
  sprite?: string; // URL to trainer sprite if available
  passColor: { from: string, to: string };
}

export interface BattlePass {
  id: string;
  title: string;
  trainers: Trainer[];
}

export interface PassCategory {
  title: string;
  passes: BattlePass[];
}