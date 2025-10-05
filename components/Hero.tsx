import React, { useState } from 'react';
import Icon from './Icon';

interface HeroProps {
    onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <img
        src="https://picsum.photos/seed/lake/1920/1080"
        alt="Vue sur le lac d'Annecy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
          Salut Annecy
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 drop-shadow-sm">
          Votre guide pour vivre le meilleur de la région.
        </p>
        <div className="mt-8 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un restaurant, un sentier, un événement..."
              className="w-full h-14 pl-12 pr-4 rounded-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-sky-400 focus:outline-none shadow-lg"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="w-6 h-6 text-gray-400" />
            </div>
          </form>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
            <span className="font-semibold mr-2">Suggestions:</span>
            <button onClick={() => onSearch('Restaurants')} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">Restaurants</button>
            <button onClick={() => onSearch('Randonnée facile')} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">Randonnée facile</button>
            <button onClick={() => onSearch('Événements ce week-end')} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">Événements ce week-end</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;