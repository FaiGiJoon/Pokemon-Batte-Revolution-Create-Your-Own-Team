import React, { useState, useEffect, useMemo } from 'react';
import type { Pokemon, StoredPokemon, BattleSet, Notification, HydratedStoredPokemon, UserProfile, ParsedSaveFile } from './types';
import { getPokemonDatabase } from './services/pokemonService';
import { parseSaveFile, updateSaveFileContent } from './services/saveFileService';
import { getDefaultPassData } from './services/defaultPassService';
import { FileProcessingError } from './services/errors';
import Header from './components/Header';
import PokemonGrid from './components/PokemonGrid';
import PokemonDetailView from './components/PokemonDetailView';
import StorageBox from './components/StorageBox';
import SaveFileManager from './components/SaveFileManager';
import Modal from './components/Modal';
import Dashboard from './components/Dashboard';
import RentalPassView from './components/RentalPassView';
import UserProfileSelector from './components/UserProfileSelector';
import BattlePassesView from './components/passes/BattlePassesView';

const App: React.FC = () => {
  const [pokemonDatabase, setPokemonDatabase] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedSet, setSelectedSet] = useState<BattleSet | null>(null);
  const [storageBox, setStorageBox] = useState<StoredPokemon[]>([]);
  const [saveFile, setSaveFile] = useState<File | null>(null);
  const [saveFileContent, setSaveFileContent] = useState<string | null>(null);
  const [parsedSaveData, setParsedSaveData] = useState<ParsedSaveFile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<number | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [view, setView] = useState<'dashboard' | 'grid' | 'passes'>('dashboard');
  const [isParsing, setIsParsing] = useState(false);
  const [passName, setPassName] = useState('My Battle Pass');
  const [displayMode, setDisplayMode] = useState<'user' | 'default'>('user');
  const [defaultPass, setDefaultPass] = useState<HydratedStoredPokemon[]>([]);

  useEffect(() => {
    setPokemonDatabase(getPokemonDatabase());
    setDefaultPass(getDefaultPassData());
     try {
      const storedBox = localStorage.getItem('pbr-storage-box');
      if (storedBox) {
        setStorageBox(JSON.parse(storedBox));
      }
      const storedName = localStorage.getItem('pbr-pass-name');
      if (storedName) {
        setPassName(JSON.parse(storedName));
      }
    } catch (error) {
      console.error("Could not load data from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    // Only update display mode if a save file is loaded.
    if(saveFile) {
        setDisplayMode(storageBox.length > 0 ? 'user' : 'default');
    }
  }, [storageBox, saveFile]);

  useEffect(() => {
    localStorage.setItem('pbr-pass-name', JSON.stringify(passName));
  }, [passName]);

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
    handleClearSaveFile(false); // Soft clear without notification
    setIsParsing(true);
    
    try {
      const fileContent = await file.text();
      setSaveFileContent(fileContent);

      const parsedData = parseSaveFile(fileContent, pokemonDatabase);
      setParsedSaveData(parsedData);
      
      if (parsedData.profiles.length > 0) {
        setProfiles(parsedData.profiles);
        const firstProfile = parsedData.profiles[0];
        setActiveProfileId(firstProfile.id);
        setStorageBox(firstProfile.team);
        showNotification(`Successfully loaded ${parsedData.profiles.length} user profile(s).`, 'success');
      } else {
        showNotification('No Pokémon teams found in this save file.', 'warning');
        setStorageBox([]);
        setProfiles([]);
        setActiveProfileId(null);
      }

    } catch (error) {
      const err = error as Error;
      console.error('Failed to parse save file:', err);
      if (err instanceof FileProcessingError) {
        showNotification(`Error: ${err.message}`, 'error');
      } else {
        showNotification(`An unexpected error occurred. Please ensure it's a valid save data file.`, 'error');
      }
      handleClearSaveFile(false);
    } finally {
        setIsParsing(false);
    }
  };
  
  const handleSelectProfile = (profileId: number) => {
    const profile = profiles.find(p => p.id === profileId);
    if(profile) {
      setActiveProfileId(profileId);
      setStorageBox(profile.team);
    }
  };

  const handleClearSaveFile = (showNotif: boolean = true) => {
    setSaveFile(null);
    setSaveFileContent(null);
    setStorageBox([]);
    setParsedSaveData(null);
    setProfiles([]);
    setActiveProfileId(null);
    setDisplayMode('user');
    if (showNotif) {
        setNotification(null);
    }
  };
  
  const hydratedBox: HydratedStoredPokemon[] = useMemo(() => {
    return storageBox.map(stored => {
      const pokemon = pokemonDatabase.find(p => p.id === stored.pokemonId);
      if (!pokemon) return null;
      return { ...stored, pokemon };
    }).filter((item): item is HydratedStoredPokemon => item !== null);
  }, [storageBox, pokemonDatabase]);

  const handleUpdateSaveFile = () => {
    if (!saveFile || !parsedSaveData || activeProfileId === null) {
        showNotification('No active user profile to update.', 'warning');
        return;
    }
    
    const activeProfile = profiles.find(p => p.id === activeProfileId);
    if (!activeProfile) {
        showNotification('Could not find active profile data. Please reload the file.', 'error');
        return;
    }

    const fileContent = updateSaveFileContent(parsedSaveData.rawLines, hydratedBox, activeProfile);
    const blob = new Blob([fileContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = saveFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`'${saveFile.name}' has been updated for ${activeProfile.name}.`, 'success');
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setSelectedSet(null);
  };
  
  const handleCloseDetailView = () => {
    setSelectedPokemon(null);
    setSelectedSet(null);
  };

  const handleAddToBox = (pokemon: Pokemon, set: BattleSet) => {
    if (storageBox.length < 6) {
      const newStoredPokemon: StoredPokemon = {
        pokemonId: pokemon.id,
        set: set,
        instanceId: Date.now(),
      };
      setStorageBox([...storageBox, newStoredPokemon]);
      showNotification(`${pokemon.name} was added to your storage box.`, 'success', 3000);
    } else {
      showNotification('Your storage box is full!', 'warning', 3000);
    }
  };

  const handleRemoveFromBox = (instanceId: number) => {
    setStorageBox(storageBox.filter(p => p.instanceId !== instanceId));
  };
  
  const handleSelectFromBox = (item: HydratedStoredPokemon) => {
    setSelectedPokemon(item.pokemon);
    setSelectedSet(item.set);
  };

  const handleLoadTeamToBox = (team: StoredPokemon[], trainerName: string) => {
    if (window.confirm(`This will replace your current storage box with ${trainerName}'s team. Are you sure?`)) {
        setStorageBox(team);
        showNotification(`${trainerName}'s team has been loaded into your storage box.`, 'success');
        setView('dashboard');
    }
  };

  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return <Dashboard 
                  pokemonList={pokemonDatabase}
                  onPokemonSelect={handleSelectPokemon}
                  onSetView={setView}
                />;
      case 'grid':
        return <PokemonGrid 
                pokemonList={pokemonDatabase} 
                onPokemonSelect={handleSelectPokemon}
                onSetView={setView}
              />;
      case 'passes':
        return <BattlePassesView
                onSetView={setView}
                onLoadTeam={handleLoadTeamToBox}
              />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 xl:col-span-8">
            {renderView()}
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
            <SaveFileManager
              saveFile={saveFile}
              onFileUpload={handleSaveFileUpload}
              onClearFile={() => handleClearSaveFile(true)}
              onUpdateSaveFile={handleUpdateSaveFile}
              isBoxPopulated={storageBox.length > 0}
              notification={notification}
              isParsing={isParsing}
            />
             {saveFile && (
              <UserProfileSelector
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSelectProfile={handleSelectProfile}
              />
            )}
            <RentalPassView 
              box={hydratedBox}
              passName={passName}
              onPassNameChange={setPassName}
              displayMode={displayMode}
              defaultPass={defaultPass}
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
            initialSet={selectedSet || undefined}
            onAddToBox={handleAddToBox}
            storageBox={storageBox}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;