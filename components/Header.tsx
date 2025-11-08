import React from 'react';

const PokeballIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#FFF" stroke="#000" strokeWidth="4"/>
        <path d="M50 50 L98 50 A48 48 0 0 0 50 2 Z" fill="#E3350D"/>
        <path d="M50 50 H2 A48 48 0 0 1 50 2 Z" fill="#E3350D"/>
        <line x1="2" y1="50" x2="98" y2="50" stroke="#000" strokeWidth="4"/>
        <circle cx="50" cy="50" r="15" fill="#FFF" stroke="#000" strokeWidth="4"/>
        <circle cx="50" cy="50" r="8" fill="#FFF" stroke="#000" strokeWidth="2"/>
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-zinc-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center gap-4">
          <PokeballIcon className="w-8 h-8"/>
          <h1 className="text-zinc-100 text-2xl sm:text-3xl font-bold tracking-tight">
            PBR Workshop
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;