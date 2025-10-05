import React, { useState, useMemo } from 'react';
import { TRAIL_DIFFICULTY_OPTIONS } from '../constants';
import { Trail, TrailDifficulty, Place } from '../types';
import Icon from './Icon';
import InteractiveMap from './InteractiveMap';

interface TrailListPageProps {
  trails: Trail[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
}

const getDifficultyClass = (difficulty: TrailDifficulty) => {
    switch(difficulty) {
        case 'Facile': return 'bg-emerald-100 text-emerald-800';
        case 'Moyen': return 'bg-sky-100 text-sky-800';
        case 'Difficile': return 'bg-amber-100 text-amber-800';
        case 'Expert': return 'bg-rose-100 text-rose-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const TrailCard: React.FC<{ item: Trail; navigateTo: (page: string, id: string) => void }> = ({ item, navigateTo }) => {
    return (
        <a 
            href="#"
            onClick={(e) => { e.preventDefault(); navigateTo('trail-detail', item.id); }}
            className="group flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            <div className="h-56 relative">
                <img className="h-full w-full object-cover" src={item.imageUrl} alt={item.name} />
                <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full ${getDifficultyClass(item.difficulty)}`}>
                    {item.difficulty}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div>
                    <h3 className="block mt-1 text-xl leading-tight font-bold text-black group-hover:text-sky-600 transition-colors">{item.name}</h3>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">{item.excerpt}</p>
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-100 flex-grow flex items-end justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1"><Icon name="hiking" className="w-5 h-5 text-gray-400" /><span>{item.distanceKm} km</span></div>
                    <div className="flex items-center space-x-1"><Icon name="clock" className="w-5 h-5 text-gray-400" /><span>{Math.floor(item.durationMin/60)}h{item.durationMin%60}</span></div>
                    <div className="flex items-center space-x-1"><Icon name="trending-up" className="w-5 h-5 text-gray-400" /><span>{item.ascentM} m</span></div>
                </div>
            </div>
        </a>
    )
};

const FilterPanel: React.FC<{ selectedDifficulties: TrailDifficulty[], onDifficultyChange: (difficulty: TrailDifficulty) => void }> = ({ selectedDifficulties, onDifficultyChange }) => {
    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8 p-6 bg-white rounded-xl shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Difficulté</h3>
                    <div className="space-y-3">
                        {TRAIL_DIFFICULTY_OPTIONS.map(opt => (
                            <div key={opt.id} className="flex items-center">
                                <input 
                                    id={opt.id} 
                                    name="trail-difficulty"
                                    type="checkbox"
                                    checked={selectedDifficulties.includes(opt.label)}
                                    onChange={() => onDifficultyChange(opt.label)}
                                    className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" 
                                />
                                <label htmlFor={opt.id} className="ml-3 text-sm text-gray-600 w-full cursor-pointer">{opt.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};


const TrailListPage: React.FC<TrailListPageProps> = ({ trails, navigateTo }) => {
    const [selectedDifficulties, setSelectedDifficulties] = useState<TrailDifficulty[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    const handleDifficultyChange = (difficulty: TrailDifficulty) => {
        setSelectedDifficulties(prev => 
            prev.includes(difficulty) 
                ? prev.filter(d => d !== difficulty)
                : [...prev, difficulty]
        );
    };

    const filteredTrails = useMemo(() => {
        let currentTrails = trails.filter(t => t.status === 'published');
        if (selectedDifficulties.length === 0) {
            return currentTrails;
        }
        return currentTrails.filter(trail => selectedDifficulties.includes(trail.difficulty));
    }, [trails, selectedDifficulties]);


    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Sentiers & Randonnées</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">Des balades familiales aux ascensions sportives, explorez les plus beaux sentiers entre lac et montagnes.</p>
                </div>
                
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    <FilterPanel selectedDifficulties={selectedDifficulties} onDifficultyChange={handleDifficultyChange} />
                    
                    <div className="lg:col-span-3 mt-8 lg:mt-0">
                        <div className="flex justify-between items-center mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm sticky top-24 z-10">
                            <div className="text-sm text-gray-600 font-semibold">{filteredTrails.length} résultat(s)</div>
                             <div className="flex items-center">
                                <button onClick={() => setViewMode('grid')} aria-label="Affichage en grille" className={`p-2 rounded-l-md transition-colors ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                </button>
                                <button onClick={() => setViewMode('map')} aria-label="Affichage sur carte" className={`p-2 rounded-r-md transition-colors ${viewMode === 'map' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    <Icon name="map" className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>

                         {filteredTrails.length > 0 ? (
                            <>
                                {viewMode === 'map' ? (
                                    <div className="h-[600px]"><InteractiveMap items={filteredTrails} navigateTo={navigateTo} itemPage="trail-detail"/></div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {filteredTrails.map(item => (
                                            <TrailCard key={item.id} item={item} navigateTo={navigateTo} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="md:col-span-2 text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">Aucun sentier ne correspond à vos filtres.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TrailListPage;