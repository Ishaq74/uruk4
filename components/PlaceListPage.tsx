import React, { useState, useMemo } from 'react';
import { 
    RESTAURATION_CATEGORIES, 
    RESTAURATION_ATTRIBUTES,
    HEBERGEMENT_CATEGORIES,
    HEBERGEMENT_ATTRIBUTES,
    COMMERCES_CATEGORIES,
    ACTIVITES_ATTRIBUTES
} from '../constants';
import { Place, FilterOption } from '../types';
import StarRating from './StarRating';
import Icon from './Icon';
import InteractiveMap from './InteractiveMap';

interface PlaceListPageProps {
  places: Place[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  mainCategory: Place['mainCategory'];
}

const PlaceCard: React.FC<{ item: Place, viewMode: 'grid' | 'list' | 'map', navigateTo: (page: string, id: string) => void }> = ({ item, viewMode, navigateTo }) => {
    
    const cardContent = (
        <>
            <img className={viewMode === 'list' ? "h-full w-48 object-cover" : "h-48 w-full object-cover"} src={item.imageUrl} alt={item.name} />
            <div className={viewMode === 'list' ? "p-6 flex flex-col justify-between flex-grow" : "p-6"}>
                <div>
                    <div className="tracking-wide text-sm text-sky-600 font-bold">{item.category} &middot; {item.priceRange}</div>
                    <h3 className="block mt-1 text-lg leading-tight font-bold text-black group-hover:underline">{item.name}</h3>
                    {viewMode === 'list' && <p className="mt-2 text-gray-500 text-sm">{item.description.substring(0, 150)}...</p>}
                </div>
                 <div className="mt-4 flex items-center">
                    <StarRating rating={item.rating} />
                    <span className="text-gray-600 ml-2 text-sm">({item.reviewCount} avis)</span>
                </div>
            </div>
        </>
    );

    return (
        <div 
            onClick={() => navigateTo('place-detail', item.id)}
            className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}
        >
            {cardContent}
        </div>
    )
};

const FilterCheckbox: React.FC<{ option: FilterOption; isChecked: boolean; onChange: () => void }> = ({ option, isChecked, onChange }) => (
    <div className="flex items-center">
        <input 
            id={option.id} 
            name={option.label}
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" 
        />
        <label htmlFor={option.id} className="ml-3 text-sm text-gray-600 flex justify-between w-full cursor-pointer">
            <span>{option.label}</span>
        </label>
    </div>
);


const FilterPanel: React.FC<{ 
    mainCategory: Place['mainCategory'],
    selectedCategories: string[],
    onCategoryChange: (category: string) => void,
    selectedAttributes: string[],
    onAttributeChange: (attribute: string) => void,
    selectedRating: number,
    onRatingChange: (rating: number) => void
}> = ({ mainCategory, selectedCategories, onCategoryChange, selectedAttributes, onAttributeChange, selectedRating, onRatingChange }) => {
    let categories: FilterOption[] = [];
    let attributes: FilterOption[] = [];
    let categoryTitle = 'Catégories';
    let attributeTitle = 'Spécificités';

    switch (mainCategory) {
        case 'restauration':
            categories = RESTAURATION_CATEGORIES;
            attributes = RESTAURATION_ATTRIBUTES;
            break;
        case 'hebergement':
            categories = HEBERGEMENT_CATEGORIES;
            attributes = HEBERGEMENT_ATTRIBUTES;
            categoryTitle = 'Type d\'hébergement';
            attributeTitle = 'Équipements';
            break;
        case 'activites':
            attributes = ACTIVITES_ATTRIBUTES;
            attributeTitle = 'Type d\'activité';
            break;
        case 'commerces':
            categories = COMMERCES_CATEGORIES;
            break;
    }

    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8 p-6 bg-white rounded-xl shadow-sm">
                 {categories.length > 0 && (
                     <div>
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">{categoryTitle}</h3>
                        <div className="space-y-3">
                            {categories.map(cat => <FilterCheckbox key={cat.id} option={cat} isChecked={selectedCategories.includes(cat.label)} onChange={() => onCategoryChange(cat.label)} />)}
                        </div>
                    </div>
                 )}
                 {attributes.length > 0 && (
                     <div>
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">{attributeTitle}</h3>
                        <div className="space-y-3">
                            {attributes.map(attr => <FilterCheckbox key={attr.id} option={attr} isChecked={selectedAttributes.includes(attr.label)} onChange={() => onAttributeChange(attr.label)} />)}
                        </div>
                    </div>
                 )}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Note minimum</h3>
                     <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map(rating => (
                             <button 
                                key={rating} 
                                aria-label={`Noter ${rating} étoiles`} 
                                onClick={() => onRatingChange(rating)}
                                className={`p-2 border rounded-md transition-colors ${selectedRating === rating ? 'bg-amber-100 border-amber-300' : 'hover:bg-gray-100 text-gray-500 hover:text-amber-500'}`}
                             >
                               <StarRating rating={rating} hideCount={true} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};


const PAGE_CONFIG = {
    restauration: {
        title: "Restaurants à Annecy",
        description: "Découvrez les meilleures tables de la Venise des Alpes, du restaurant gastronomique au bistrot de quartier."
    },
    hebergement: {
        title: "Hébergements à Annecy",
        description: "Trouvez le lieu parfait pour votre séjour, de l'hôtel de luxe à la chambre d'hôtes de charme."
    },
    activites: {
        title: "Activités à Annecy",
        description: "Parapente, canyoning, musées... Découvrez toutes les activités pour un séjour inoubliable."
    },
    commerces: {
        title: "Commerces & Services",
        description: "Explorez les boutiques locales, des artisans aux produits du terroir."
    }
}

const PlaceListPage: React.FC<PlaceListPageProps> = ({ places, navigateTo, mainCategory }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState(0);

    const config = PAGE_CONFIG[mainCategory];
    
    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    };
    const handleAttributeChange = (attribute: string) => {
        setSelectedAttributes(prev => prev.includes(attribute) ? prev.filter(a => a !== attribute) : [...prev, attribute]);
    };
     const handleRatingChange = (rating: number) => {
        setSelectedRating(prev => prev === rating ? 0 : rating); // Toggle off if same rating clicked
    };

    const placesToShow = useMemo(() => {
        return places.filter(p => {
            if (p.mainCategory !== mainCategory) return false;
            if (p.status !== 'published') return false;
            if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
            if (selectedAttributes.length > 0 && !selectedAttributes.every(attr => p.attributes.includes(attr))) return false;
            if (selectedRating > 0 && p.rating < selectedRating) return false;
            return true;
        });
    }, [places, mainCategory, selectedCategories, selectedAttributes, selectedRating]);

    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{config.title}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">{config.description}</p>
                </div>
                
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    <FilterPanel 
                        mainCategory={mainCategory} 
                        selectedCategories={selectedCategories} onCategoryChange={handleCategoryChange}
                        selectedAttributes={selectedAttributes} onAttributeChange={handleAttributeChange}
                        selectedRating={selectedRating} onRatingChange={handleRatingChange}
                    />

                    <div className="lg:col-span-3 mt-8 lg:mt-0">
                        <div className="flex justify-between items-center mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm sticky top-24 z-10">
                            <div className="text-sm text-gray-600 font-semibold">{placesToShow.length} résultat(s)</div>
                            <div className="flex items-center space-x-4">
                                <select className="border-gray-300 rounded-md shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50 text-sm">
                                    <option>Trier par : Pertinence</option>
                                    <option>Trier par : Les mieux notés</option>
                                </select>
                                <div className="flex items-center">
                                    <button onClick={() => setViewMode('list')} aria-label="Affichage en liste" className={`p-2 rounded-l-md transition-colors ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button onClick={() => setViewMode('grid')} aria-label="Affichage en grille" className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                    </button>
                                    <button onClick={() => setViewMode('map')} aria-label="Affichage sur carte" className={`p-2 rounded-r-md transition-colors ${viewMode === 'map' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                        <Icon name="map" className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {placesToShow.length > 0 ? (
                             <>
                                {viewMode === 'map' ? (
                                    <div className="h-[600px]"><InteractiveMap items={placesToShow} navigateTo={navigateTo} itemPage="place-detail"/></div>
                                ) : (
                                     <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-8'}>
                                        {placesToShow.map(item => <PlaceCard key={item.id} item={item} viewMode={viewMode} navigateTo={navigateTo} />)}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">Aucun lieu ne correspond à vos filtres.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PlaceListPage;