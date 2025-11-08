import type { Pokemon, StoredPokemon, BattleSet } from '../types';
import { InvalidFileTypeError, EmptyFileError, CorruptedDataError } from './errors';

export const parseSaveFile = (file: File, pokemonDatabase: Pokemon[]): Promise<StoredPokemon[]> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      return reject(new InvalidFileTypeError());
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        if (!fileContent || fileContent.trim() === '') {
          return reject(new EmptyFileError());
        }

        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
          return reject(new EmptyFileError('File contains no valid lines of text.'));
        }
        
        const foundPokemon: StoredPokemon[] = [];

        const setMap = new Map<string, { pokemonId: number, set: BattleSet }>();
        pokemonDatabase.forEach(pokemon => {
          pokemon.sets.forEach(set => {
            const normalizedKey = set.sourceName.trim().replace(/\s+/g, ' ');
            if (!setMap.has(normalizedKey)) {
              setMap.set(normalizedKey, { pokemonId: pokemon.id, set: set });
            }
          });
        });

        lines.forEach((line, index) => {
          if (foundPokemon.length >= 6) return;

          const trimmedLine = line.trim().replace(/\s+/g, ' ');
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
        console.error("Parsing failed:", error);
        reject(new CorruptedDataError());
      }
    };

    reader.onerror = () => {
      reject(new Error('An error occurred while reading the file.'));
    };

    reader.readAsText(file);
  });
};
