import type { Pokemon, StoredPokemon, BattleSet, HydratedStoredPokemon, ParsedSaveFile, UserProfile } from '../types';
import { EmptyFileError, CorruptedDataError, FileProcessingError } from './errors';

const getSetMap = (pokemonDatabase: Pokemon[]): Map<string, { pokemonId: number, set: BattleSet }> => {
  const setMap = new Map<string, { pokemonId: number, set: BattleSet }>();
  pokemonDatabase.forEach(pokemon => {
    pokemon.sets.forEach(set => {
      const normalizedKey = set.sourceName.trim().replace(/\s+/g, ' ');
      if (!setMap.has(normalizedKey)) {
        setMap.set(normalizedKey, { pokemonId: pokemon.id, set: set });
      }
    });
  });
  return setMap;
}

const isPokemonLine = (line: string, setMap: Map<string, any>): boolean => {
  const trimmedLine = line.trim().replace(/\s+/g, ' ');
  return setMap.has(trimmedLine);
};

export const parseSaveFile = (fileContent: string, pokemonDatabase: Pokemon[]): ParsedSaveFile => {
  if (!fileContent || fileContent.trim() === '') {
    throw new EmptyFileError();
  }
  
  const setMap = getSetMap(pokemonDatabase);
  const lines = fileContent.split('\n');
  const profiles: UserProfile[] = [];
  let profileCount = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isPokemonLine(line, setMap)) {
      // Found the start of a potential team block
      const team: StoredPokemon[] = [];
      const startLine = i;
      let currentLine = i;

      // Keep reading consecutive pokemon lines (up to 6)
      while (currentLine < lines.length && team.length < 6 && isPokemonLine(lines[currentLine], setMap)) {
        const trimmedLine = lines[currentLine].trim().replace(/\s+/g, ' ');
        const { pokemonId, set } = setMap.get(trimmedLine)!;
        team.push({
          pokemonId: pokemonId,
          set: set,
          instanceId: Date.now() + profiles.length + team.length,
        });
        currentLine++;
      }

      profileCount++;
      profiles.push({
        id: profileCount,
        name: `Trainer ${profileCount}`, // Simple naming scheme
        team: team,
        lineRange: { start: startLine, end: currentLine - 1 },
      });
      
      i = currentLine; // Continue searching from after this block
    } else {
      i++; // Not a pokemon, move to next line
    }
  }
  
  return { profiles, rawLines: lines };
};

const generateSetString = (pokemon: Pokemon, set: BattleSet): string => {
  const moves = [...set.moves];
  while (moves.length < 4) {
    moves.push('(None)');
  }
  
  const statsInOrder = [
    set.stats.hp,
    set.stats.attack,
    set.stats.defense,
    set.stats.spAtk,
    set.stats.spDef,
    set.stats.speed,
  ];

  const parts = [
    pokemon.name,
    set.box,
    set.gender,
    set.level,
    set.ability,
    ...moves,
    set.heldItem || '',
    ...statsInOrder
  ];
  
  // This mimics the multi-space/tab format from the original file
  return `${parts[0]}\t${parts[1]}\t${parts[2]}\t${parts[3]}\t${parts[4]}\t\t${parts[5]}\t\t${parts[6]}\t\t${parts[7]}\t\t${parts[8]}\t\t${parts[9]}\t${parts[10]}\t${parts[11]}\t${parts[12]}\t${parts[13]}\t${parts[14]}\t${parts[15]}`;
}


export const updateSaveFileContent = (rawLines: string[], box: HydratedStoredPokemon[], activeProfile: UserProfile): string => {
  
  const newTeamLines = box.map(item => {
    // If it's a non-custom set, prefer the original source string for 100% accuracy.
    if (!item.set.isCustom && item.set.sourceName) {
      return item.set.sourceName;
    }
    // Otherwise, reconstruct the string from the potentially edited set data.
    return generateSetString(item.pokemon, item.set);
  });

  const { start, end } = activeProfile.lineRange;

  // Handle profiles that were initially empty (start will be > end)
  // For simplicity, we assume an empty profile means we replace the line where it *would* have started.
  // The current parser does not find empty profiles, so this is for future-proofing. A more robust implementation
  // would need markers for empty profiles. For now, we only replace existing pokemon blocks.
  if (start > end) { // This profile was empty
    // To insert, we'd need a specific line number. Since we can't know that,
    // we'll replace the lines of the first detected profile. This is a limitation
    // but better than appending at the end which can break file structure.
    // The current UI flow prevents editing an empty profile, so this is a fallback.
    // For now, let's just log a warning and return original content if this unlikely case happens.
     console.warn("Attempted to update a profile that was not found correctly in the original file. Aborting sync.");
     return rawLines.join('\n');
  }


  const linesBefore = rawLines.slice(0, start);
  const linesAfter = rawLines.slice(end + 1);

  const finalContent = [...linesBefore, ...newTeamLines, ...linesAfter];

  // If new team is empty, we might have consecutive newlines.
  if (newTeamLines.length === 0 && linesBefore[linesBefore.length - 1] === '' && linesAfter[0] === '') {
    linesAfter.shift();
  }
  
  return [...linesBefore, ...newTeamLines, ...linesAfter].join('\n');
};