import React, { useState, useMemo } from 'react';
import { EVENT_CATEGORIES } from '../constants';
import { Event, FilterOption, Place, EventCategory } from '../types';
import Icon from './Icon';
import InteractiveMap from './InteractiveMap';

interface EventListPageProps {
  events: Event[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
}

const EventCard: React.FC<{ item: Event; navigateTo: (page: string, id: string) => void }> = ({ item, navigateTo }) => {
    return (
        <div 
            onClick={() => navigateTo('event-detail', item.id)}
            className="group flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
            <div className="flex-shrink-0 w-full sm:w-48">
                <img className="h-48 w-full object-cover sm:h-full" src={item.imageUrl} alt={item.title} />
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    <div className="tracking-wide text-sm text-rose-600 font-bold">{item.date} &middot; {item.category}</div>
                    <h3 className="block mt-2 text-xl leading-tight font-bold text-black group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
                        <Icon name="map-pin" className="w-4 h-4 text-gray-400" />
                        <span>{item.location}</span>
                    </p>
                    <p className="mt-3 text-gray-600 text-sm">{item.description.substring(0, 120)}...</p>
                </div>
                 <div className="mt-4 flex justify-between items-end">
                    <p className="text-lg font-bold text-emerald-600">{item.price}</p>
                    <button className="px-3 py-1 text-xs font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors">
                        Voir les détails
                    </button>
                </div>
            </div>
        </div>
    )
};

const FilterCheckbox: React.FC<{ option: FilterOption; isChecked: boolean; onChange: () => void; }> = ({ option, isChecked, onChange }) => (
    <div className="flex items-center">
        <input 
            id={`event-${option.id}`} 
            name={option.label} 
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" 
        />
        <label htmlFor={`event-${option.id}`} className="ml-3 text-sm text-gray-600 flex justify-between w-full cursor-pointer">
            <span>{option.label}</span>
        </label>
    </div>
);

const FilterPanel: React.FC<{ selectedCategories: EventCategory[], onCategoryChange: (category: EventCategory) => void }> = ({ selectedCategories, onCategoryChange }) => {
    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8 p-6 bg-white rounded-xl shadow-sm">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Catégories</h3>
                    <div className="space-y-3">
                        {EVENT_CATEGORIES.map(cat => (
                            <FilterCheckbox 
                                key={cat.id} 
                                option={cat} 
                                isChecked={selectedCategories.includes(cat.label as EventCategory)}
                                onChange={() => onCategoryChange(cat.label as EventCategory)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};


const EventListPage: React.FC<EventListPageProps> = ({ events, navigateTo }) => {
    const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const handleCategoryChange = (category: EventCategory) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            if (event.status !== 'published') return false;
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(event.category);
            return categoryMatch;
        });
    }, [events, selectedCategories]);

    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Agenda des Événements</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">Festivals, concerts, marchés, sports... Découvrez tout ce qui anime Annecy et ses environs.</p>
                </div>
                
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    <FilterPanel 
                        selectedCategories={selectedCategories} 
                        onCategoryChange={handleCategoryChange}
                    />

                    <div className="lg:col-span-3 mt-8 lg:mt-0">
                        <div className="flex justify-between items-center mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm sticky top-24 z-10">
                            <div className="text-sm text-gray-600 font-semibold">{filteredEvents.length} résultat(s)</div>
                             <div className="flex items-center">
                                <button onClick={() => setViewMode('list')} aria-label="Affichage en liste" className={`p-2 rounded-l-md transition-colors ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                </button>
                                <button onClick={() => setViewMode('map')} aria-label="Affichage sur carte" className={`p-2 rounded-r-md transition-colors ${viewMode === 'map' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    <Icon name="map" className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>

                        {filteredEvents.length > 0 ? (
                             <>
                                {viewMode === 'map' ? (
                                    <div className="h-[600px]"><InteractiveMap items={filteredEvents} navigateTo={navigateTo} itemPage="event-detail"/></div>
                                ) : (
                                    <div className="space-y-6">
                                        {filteredEvents.map(item => <EventCard key={item.id} item={item} navigateTo={navigateTo} />)}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">Aucun événement ne correspond à vos filtres.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventListPage;