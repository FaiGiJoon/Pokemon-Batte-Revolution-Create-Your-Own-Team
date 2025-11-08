import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-zinc-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center">
          <h1 className="text-zinc-100 text-2xl sm:text-3xl font-bold tracking-tight">
            Pokémon Battle Revolution
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
