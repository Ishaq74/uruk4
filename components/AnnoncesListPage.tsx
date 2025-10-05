import React, { useState, useMemo, useEffect } from 'react';
import { LISTING_ICONS } from '../constants';
import { Listing, ListingType, Place, Profile } from '../types';
import Icon from './Icon';

interface AnnoncesListPageProps {
  listings: Listing[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  currentUser: Profile | null;
  filter?: 'my-listings' | 'my-groups';
}

const ListingCard: React.FC<{ item: Listing, navigateTo: (page: string, id: string) => void }> = ({ item, navigateTo }) => {
    const iconInfo = LISTING_ICONS[item.type as ListingType];
    return (
        <div onClick={() => navigateTo('annonce-detail', item.id)} className="group flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
            {item.imageUrl && (
                <div className="flex-shrink-0 w-32 md:w-48">
                    <img className="h-full w-full object-cover" src={item.imageUrl} alt={item.title} />
                </div>
            )}
            <div className="p-4 md:p-6 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6"><Icon name={iconInfo.name} className={iconInfo.className} /></div>
                        <p className="text-sm font-semibold text-gray-500">{item.type}</p>
                    </div>
                    <h3 className="block mt-2 text-lg leading-tight font-bold text-black group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    {item.metadata && (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            {Object.entries(item.metadata).map(([key, value]) => (
                                <span key={key}><strong>{key}:</strong> {value}</span>
                            ))}
                        </div>
                    )}
                </div>
                 <div className="mt-4 flex justify-between items-end">
                    <p className="text-lg font-bold text-emerald-600">{item.price}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                </div>
            </div>
        </div>
    )
};

const FilterPanel: React.FC<{ selectedCategories: ListingType[], onCategoryChange: (category: ListingType) => void, filterActive: boolean, onClearFilter: () => void }> = ({ selectedCategories, onCategoryChange, filterActive, onClearFilter }) => {
    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8 p-6 bg-white rounded-xl shadow-sm">
                {filterActive && (
                     <div className="pb-4 border-b">
                        <h3 className="font-bold text-gray-800">Filtre actif</h3>
                        <p className="text-sm text-gray-500">Vous consultez vos annonces.</p>
                        <button onClick={onClearFilter} className="mt-2 text-xs text-sky-600 hover:underline">Voir toutes les annonces</button>
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Catégories</h3>
                    <div className="space-y-3">
                        {Object.values(ListingType).map(category => (
                            <div key={category} className="flex items-center">
                                <input 
                                    id={category} 
                                    name="listing-category"
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => onCategoryChange(category)}
                                    className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" 
                                />
                                <label htmlFor={category} className="ml-3 text-sm text-gray-600 flex justify-between w-full">
                                    <span>{category}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};


const AnnoncesListPage: React.FC<AnnoncesListPageProps> = ({ listings, navigateTo, currentUser, filter }) => {
    const [selectedCategories, setSelectedCategories] = useState<ListingType[]>([]);
    
    const isMyListingsFiltered = filter === 'my-listings' && currentUser;

    const handleCategoryChange = (category: ListingType) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };
    
    const clearFilter = () => {
        navigateTo('annonces');
    };

    const filteredListings = useMemo(() => {
        let currentListings = listings;
        
        if(isMyListingsFiltered) {
            currentListings = currentListings.filter(l => l.userId === currentUser.id);
        }

        if (selectedCategories.length === 0) {
            return currentListings.filter(l => l.status === 'published');
        }
        return currentListings.filter(listing => listing.status === 'published' && selectedCategories.includes(listing.type));

    }, [selectedCategories, isMyListingsFiltered, currentUser, listings]);

    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        {isMyListingsFiltered ? "Mes Annonces" : "Petites Annonces"}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                        {isMyListingsFiltered 
                            ? "Retrouvez ici toutes les annonces que vous avez publiées."
                            : "Trouvez les meilleures opportunités locales : emploi, immobilier, bonnes affaires et services entre particuliers."
                        }
                    </p>
                </div>
                
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    <FilterPanel 
                        selectedCategories={selectedCategories} 
                        onCategoryChange={handleCategoryChange} 
                        filterActive={!!isMyListingsFiltered}
                        onClearFilter={clearFilter}
                    />

                    <div className="lg:col-span-3 mt-8 lg:mt-0">
                        <div className="flex justify-between items-center mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm sticky top-24 z-10">
                            <div className="text-sm text-gray-600 font-semibold">{filteredListings.length} résultat(s)</div>
                        </div>

                        <div className="space-y-6">
                            {filteredListings.length > 0 ? (
                                filteredListings.map(item => <ListingCard key={item.id} item={item} navigateTo={navigateTo} />)
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                    <p className="text-gray-500">
                                        {isMyListingsFiltered ? "Vous n'avez publié aucune annonce." : "Aucune annonce ne correspond à vos filtres."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AnnoncesListPage;