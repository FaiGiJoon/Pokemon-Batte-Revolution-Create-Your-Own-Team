import React, { useState, useRef, useCallback } from 'react';
import type { Notification } from '../types';

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const FileIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const SyncIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a7.5 7.5 0 0 1 0 1.052A7.5 7.5 0 0 1 12 18.75a7.5 7.5 0 0 1-8.36-5.408V12a7.5 7.5 0 0 1 12.023-5.652m-3.023 5.652v-2.004a3.375 3.375 0 0 0-3.375-3.375H8.25m9 1.5-3-3m0 0-3 3m3-3v12" />
    </svg>
);


interface SaveFileManagerProps {
  saveFile: File | null;
  onFileUpload: (file: File) => void;
  onClearFile: () => void;
  onUpdateSaveFile: () => void;
  isBoxPopulated: boolean;
  notification: Notification | null;
  isParsing?: boolean;
}

const SaveFileManager: React.FC<SaveFileManagerProps> = ({ saveFile, onFileUpload, onClearFile, onUpdateSaveFile, isBoxPopulated, notification, isParsing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const notificationStyles = {
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-4 shadow-lg border border-zinc-700">
      <h3 className="text-lg font-semibold text-zinc-200 mb-4">Save File Manager</h3>
      
      {notification && (
        <div className={`p-3 mb-4 rounded-md border text-sm ${notificationStyles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      
      {!saveFile ? (
        <>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden"
            />
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-accent-red bg-zinc-700/50' : 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/30'}`}
            >
              {isParsing ? (
                  <>
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-red mb-2"></div>
                      <p className="text-zinc-400 text-sm text-center">
                          <span className="font-semibold text-accent-red">Parsing file...</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">Please wait a moment.</p>
                  </>
              ) : (
                  <>
                      <UploadIcon className="w-10 h-10 text-zinc-500 mb-2"/>
                      <p className="text-zinc-400 text-sm text-center">
                          <span className="font-semibold text-accent-red">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">PBR save file or a plain text file with one set per line.</p>
                  </>
              )}
            </div>
        </>
      ) : (
        <div className="bg-zinc-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="w-8 h-8 text-zinc-400 flex-shrink-0"/>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-zinc-200 truncate" title={saveFile.name}>{saveFile.name}</p>
                    <p className="text-xs text-zinc-400">{formatFileSize(saveFile.size)}</p>
                </div>
            </div>
            <button onClick={onClearFile} className="text-zinc-500 hover:text-accent-red transition-colors flex-shrink-0 ml-2" aria-label="Clear save file">
                <XCircleIcon className="w-6 h-6"/>
            </button>
          </div>
          <div className="mt-4">
             <button 
                onClick={onUpdateSaveFile} 
                disabled={!isBoxPopulated}
                className="w-full flex items-center justify-center gap-2 bg-accent-red text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-red-700 disabled:bg-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-400"
            >
                <SyncIcon className="w-5 h-5" />
                Sync Box to File
            </button>
            {!isBoxPopulated && <p className="text-xs text-center text-zinc-500 mt-2">Add Pokémon to your box to enable sync.</p>}
        </div>
        </div>
      )}
    </div>
  );
};

export default SaveFileManager;