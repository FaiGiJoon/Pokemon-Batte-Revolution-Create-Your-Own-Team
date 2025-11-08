import React, { useState, useEffect, useMemo } from 'react';
import type { Pokemon, StoredPokemon, BattleSet, Notification } from './types';
import { getPokemonDatabase } from './services/pokemonService';
import { parseSaveFile } from './services/saveFileService';
import Header from './components/Header';
import PokemonGrid from './components/PokemonGrid';
import PokemonDetailView from './components/PokemonDetailView';
import StorageBox from './components/StorageBox';
import SaveFileManager from './components/SaveFileManager';
import Modal from './components/Modal';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [pokemonDatabase, setPokemonDatabase] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [storageBox, setStorageBox] = useState<StoredPokemon[]>([]);
  const [saveFile, setSaveFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [view, setView] = useState<'dashboard' | 'grid'>('dashboard');

  useEffect(() => {
    setPokemonDatabase(getPokemonDatabase());
  }, []);

  const showNotification = (message: string, type: Notification['type'], duration: number = 5000) => {
    setNotification({ message, type });
    if (duration > 0) {
        setTimeout(() => {
            setNotification(null);
        }, duration);
    }
  };

  const handleSaveFileUpload = async (file: File) => {
    setSaveFile(file);
    setNotification(null);
    try {
      const storedPokemon = await parseSaveFile(file, pokemonDatabase);
      
      if (storedPokemon.length === 0) {
        showNotification('The uploaded file does not contain any recognizable Pokémon sets.', 'warning');
        setSaveFile(null); // Clear invalid file
        setStorageBox([]);
        return;
      }

      if (storedPokemon.length > 6) {
        showNotification(`Save file contains more than 6 Pokémon. Only the first 6 have been loaded.`, 'warning');
        setStorageBox(storedPokemon.slice(0, 6));
      } else {
        setStorageBox(storedPokemon);
        showNotification(`Successfully loaded ${storedPokemon.length} Pokémon from the save file.`, 'success');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Failed to parse save file:', err.message);
      showNotification(`Error: Could not parse the save file. Please ensure it's a valid .txt file.`, 'error');
      setSaveFile(null); // Clear invalid file
    }
  };

  const handleClearSaveFile = () => {
    setSaveFile(null);
    setStorageBox([]);
    setNotification(null);
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };
  
  const handleCloseDetailView = () => {
    setSelectedPokemon(null);
  };

  const handleAddToBox = (pokemon: Pokemon, set: BattleSet) => {
    if (storageBox.length < 6) {
      const newStoredPokemon: StoredPokemon = {
        pokemonId: pokemon.id,
        set: set,
        instanceId: Date.now(),
      };
      setStorageBox([...storageBox, newStoredPokemon]);
    }
  };

  const handleRemoveFromBox = (instanceId: number) => {
    setStorageBox(storageBox.filter(p => p.instanceId !== instanceId));
  };
  
  const handleSelectFromBox = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const hydratedBox = useMemo(() => {
    return storageBox.map(stored => {
      const pokemon = pokemonDatabase.find(p => p.id === stored.pokemonId);
      if (!pokemon) return null;
      // The full set is now stored in `stored.set`, so we just need to attach the base pokemon info.
      return { ...stored, pokemon };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [storageBox, pokemonDatabase]);

  return (
    <div className="min-h-screen bg-zinc-900 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 xl:col-span-8">
            {view === 'dashboard' ? (
              <Dashboard 
                pokemonList={pokemonDatabase}
                onPokemonSelect={handleSelectPokemon}
                onSetView={setView}
              />
            ) : (
              <PokemonGrid 
                pokemonList={pokemonDatabase} 
                onPokemonSelect={handleSelectPokemon}
                onSetView={setView}
              />
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
            <SaveFileManager
              saveFile={saveFile}
              onFileUpload={handleSaveFileUpload}
              onClearFile={handleClearSaveFile}
              notification={notification}
            />
            <StorageBox 
              box={hydratedBox} 
              onRemoveFromBox={handleRemoveFromBox}
              onSelectFromBox={handleSelectFromBox}
            />
          </div>

        </div>
      </main>
      
      <Modal isOpen={!!selectedPokemon} onClose={handleCloseDetailView}>
        {selectedPokemon && (
          <PokemonDetailView 
            pokemon={selectedPokemon} 
            onAddToBox={handleAddToBox}
            storageBox={storageBox}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;
