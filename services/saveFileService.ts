import type { Pokemon, StoredPokemon, BattleSet } from '../types';

export const parseSaveFile = (file: File, pokemonDatabase: Pokemon[]): Promise<StoredPokemon[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        if (!fileContent) {
          reject(new Error('File is empty or could not be read.'));
          return;
        }

        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        const foundPokemon: StoredPokemon[] = [];

        // Create a map for faster lookups of a set to its parent pokemon's ID and the set itself
        const setMap = new Map<string, { pokemonId: number, set: BattleSet }>();
        pokemonDatabase.forEach(pokemon => {
          pokemon.sets.forEach(set => {
            setMap.set(set.sourceName, { pokemonId: pokemon.id, set: set });
          });
        });

        lines.forEach((line, index) => {
          if (foundPokemon.length >= 6) return; // Storage box limit

          const trimmedLine = line.trim();
          if (setMap.has(trimmedLine)) {
            const { pokemonId, set } = setMap.get(trimmedLine)!;
            foundPokemon.push({
              pokemonId: pokemonId,
              set: set,
              instanceId: Date.now() + index,
            });
          }
        });

        resolve(foundPokemon);
      } catch (error) {
        const err = error as Error;
        reject(new Error(`Failed to parse save file: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('An error occurred while reading the file.'));
    };

    reader.readAsText(file);
  });
};
