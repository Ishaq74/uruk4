import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ATTRIBUTE_ICONS } from '../constants';
import { Place, Review, Profile, Order, Booking, Organization, Product, Service } from '../types';
import Icon from './Icon';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

interface PlaceDetailPageProps {
  id: string;
  places: Place[];
  profiles: Profile[];
  organizations: Organization[];
  products: Product[];
  services: Service[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string) => void;
  currentUser: Profile | null;
  toggleFavorite: (placeId: string) => void;
  addReview: (placeId: string, review: Omit<Review, 'id' | 'date' | 'placeId'>) => void;
  onLogin: () => void;
  onAddOrder: (order: Omit<Order, 'id'>) => void;
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
  onOpenReportModal: (targetId: string, targetType: string) => void;
}

const ReviewItem: React.FC<{ review: Review; profiles: Profile[]; navigateTo: (page: string, id?: string) => void; onOpenReportModal: (targetId: string, targetType: string) => void; }> = ({ review, profiles, navigateTo, onOpenReportModal }) => {
    const author = profiles.find(p => p.id === review.profileId);
    if (!author) return null;

    return (
        <div className="flex space-x-4 py-6 border-b border-gray-200 last:border-b-0">
            <img 
                className="h-12 w-12 rounded-full cursor-pointer" 
                src={author.avatarUrl} 
                alt={author.fullName} 
                onClick={() => navigateTo('profile', author.id)}
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 
                            className="text-sm font-bold text-gray-900 cursor-pointer hover:underline"
                            onClick={() => navigateTo('profile', author.id)}
                        >
                            {author.fullName}
                        </h4>
                        <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                    <StarRating rating={review.rating} />
                </div>
                <p className="mt-4 text-gray-600 text-sm">{review.comment}</p>
                 <div className="mt-2 text-right">
                    <button onClick={() => onOpenReportModal(review.id!, 'Review')} className="text-xs text-gray-400 hover:text-red-600">
                        Signaler
                    </button>
                </div>
            </div>
        </div>
    );
};

const OpeningHoursDisplay: React.FC<{ hours: Place['openingHours'] }> = ({ hours }) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const today = new Date().getDay();

    return (
        <ul className="text-sm text-gray-600 space-y-2">
            {days.map((day, index) => {
                const hourInfo = hours[index];
                const isToday = index === today;
                return (
                    <li key={day} className={`flex justify-between ${isToday ? 'font-bold text-sky-700' : ''}`}>
                        <span>{day}</span>
                        <span>{hourInfo ? `${hourInfo.open} - ${hourInfo.close}` : 'Fermé'}</span>
                    </li>
                );
            })}
        </ul>
    );
};

const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({ id, places, profiles, organizations, products, services, navigateTo, currentUser, toggleFavorite, addReview, onLogin, onAddOrder, onAddBooking, onOpenReportModal }) => {
    const place = places.find(p => p.id === id);
    
    // AI State
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [similarPlacesAI, setSimilarPlacesAI] = useState<Place[]>([]);

    useEffect(() => {
        setSimilarPlacesAI([]);
        setAiError(null);
    }, [id]);
    
    if (!place) {
        return <div className="text-center py-20">Lieu non trouvé. <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home')}} className="text-sky-600">Retour à l'accueil</a></div>;
    }

    const organization = organizations.find(org => org.place_ids.includes(place.id));
    const placeProducts = organization ? products.filter(p => p.organization_id === organization.id) : [];
    const placeServices = organization ? services.filter(s => s.organization_id === organization.id) : [];
    
    const similarPlaces = places.filter(p => p.mainCategory === place.mainCategory && p.id !== place.id).slice(0, 3);
    const isFavorite = currentUser?.favoritePlaceIds?.includes(place.id) ?? false;

    const handleReviewSubmit = (rating: number, comment: string) => {
        if (!currentUser) return;
        addReview(place.id, {
            profileId: currentUser.id,
            rating,
            comment,
        });
    };

    const handleBuyProduct = (product: Product) => {
        if(!currentUser) { alert("Veuillez vous connecter pour acheter ce produit."); onLogin(); return; }
        if(!organization) return;
        const newOrder: Omit<Order, 'id'> = {
            customer_id: currentUser.id, organization_id: organization.id, product_id: product.id,
            product_name: product.name, quantity: 1, total_price: product.price,
            status: 'processing', ordered_at: new Date().toISOString().split('T')[0],
        };
        onAddOrder(newOrder);
    };

    const handleBookService = (service: Service) => {
         if(!currentUser) { alert("Veuillez vous connecter pour réserver ce service."); onLogin(); return; }
        if(!organization) return;
        const newBooking: Omit<Booking, 'id'> = {
            customer_id: currentUser.id, organization_id: organization.id, service_id: service.id,
            service_name: service.name, total_price: service.base_price, status: 'pending',
            booked_at: new Date().toISOString().split('T')[0], booking_date: 'À confirmer'
        };
        onAddBooking(newBooking);
    };

    const findSimilarWithAI = async () => {
        if (!process.env.API_KEY) { setAiError("La clé API n'est pas configurée pour cette démo."); return; }
        setIsLoadingAI(true);
        setAiError(null);
        setSimilarPlacesAI([]);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const otherPlaces = places.filter(p => p.id !== place.id).map(p => ({ id: p.id, name: p.name, category: p.category, attributes: p.attributes.join(', '), description: p.description }));
        
        const prompt = `
            Tu es le moteur de recommandation de la plateforme "Salut Annecy".
            Basé sur le lieu suivant :
            - Nom : ${place.name}
            - Catégorie : ${place.category}
            - Attributs : ${place.attributes.join(', ')}
            - Description : ${place.description}

            Voici une liste d'autres lieux disponibles :
            ${JSON.stringify(otherPlaces, null, 2)}

            Ta tâche est de trouver les 3 lieux les plus similaires dans la liste fournie.
            Retourne UNIQUEMENT un objet JSON valide contenant un tableau de 3 IDs de lieux.
            Le format doit être : { "similar_place_ids": ["id1", "id2", "id3"] }
        `;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-04-17", contents: prompt,
                config: { responseMimeType: "application/json" },
            });
            let jsonStr = response.text.trim().replace(/^```(\w*\s)?/, '').replace(/```$/, '').trim();
            const parsedData = JSON.parse(jsonStr);
            if (parsedData && parsedData.similar_place_ids && Array.isArray(parsedData.similar_place_ids)) {
                const foundPlaces = parsedData.similar_place_ids
                    .map((placeId: string) => places.find(p => p.id === placeId))
                    .filter((p: Place | undefined): p is Place => p !== undefined);
                setSimilarPlacesAI(foundPlaces);
            } else { throw new Error("Format JSON de la réponse invalide."); }
        } catch (e) {
            console.error("Erreur Gemini API:", e);
            setAiError("Désolé, une erreur est survenue lors de la recherche IA.");
        } finally {
            setIsLoadingAI(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg mb-8">
                <img src={place.imageUrl} alt={place.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={() => currentUser && toggleFavorite(place.id)} disabled={!currentUser} className={`w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors ${!currentUser ? 'cursor-not-allowed' : ''}`}>
                      <Icon name="heart" className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : ''}`}/>
                    </button>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"><Icon name="share" className="w-5 h-5"/></button>
                </div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">{place.name}</h1>
                    <div className="mt-4 flex items-center space-x-4">
                        <StarRating rating={place.rating}/>
                        <span className="text-gray-200">({place.reviewCount} avis)</span>
                        <span className="hidden sm:inline">&middot;</span>
                        <span className="hidden sm:inline font-semibold">{place.category}</span>
                        <span className="hidden sm:inline">&middot;</span>
                        <span className="hidden sm:inline font-semibold">{place.priceRange}</span>
                    </div>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="prose max-w-none text-gray-600">
                        <p>{place.description}</p>
                    </div>

                    <div>
                         <h3 className="text-xl font-bold text-gray-900 mb-4">Spécificités</h3>
                         <div className="flex flex-wrap gap-4">
                            {place.attributes.map(attr => {
                                const iconName = ATTRIBUTE_ICONS[attr] || 'tag';
                                return (
                                    <div key={attr} className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-full text-sm font-medium text-slate-700">
                                        <Icon name={iconName} className="w-5 h-5" />
                                        <span>{attr}</span>
                                    </div>
                                );
                            })}
                         </div>
                    </div>
                    
                    {organization?.subscription_tier === 'pro' && placeProducts.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Produits à la Vente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {placeProducts.map(product => (
                                    <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4"/>
                                        <h4 className="font-bold text-gray-800">{product.name}</h4>
                                        <p className="text-sm text-gray-500 flex-grow">{product.description}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="font-bold text-lg text-emerald-600">{product.price.toFixed(2)}€</span>
                                            <button onClick={() => handleBuyProduct(product)} className="px-4 py-2 text-sm font-semibold bg-sky-500 text-white rounded-full hover:bg-sky-600">Acheter</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {organization?.subscription_tier === 'premium' && placeServices.length > 0 && (
                         <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Services à Réserver</h3>
                            <div className="space-y-4">
                                {placeServices.map(service => (
                                    <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{service.name}</h4>
                                            <p className="text-sm text-gray-500">{service.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">Durée: {service.duration_minutes} min</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-lg text-emerald-600">{service.base_price.toFixed(2)}€</span>
                                            <button onClick={() => handleBookService(service)} className="mt-1 block px-4 py-2 text-sm font-semibold bg-sky-500 text-white rounded-full hover:bg-sky-600">Réserver</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Avis des clients</h3>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            {place.reviews.length > 0 ? (
                                <div>{place.reviews.map((review, index) => <ReviewItem key={review.id || `new-${index}`} review={review} profiles={profiles} navigateTo={navigateTo} onOpenReportModal={onOpenReportModal} />)}</div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Aucun avis pour le moment.</p>
                            )}
                            {currentUser ? (
                                <ReviewForm onSubmit={handleReviewSubmit} currentUser={currentUser} />
                            ) : (
                                <div className="mt-6 text-center border-t pt-6">
                                    <p className="text-gray-600">Vous devez être connecté pour laisser un avis.</p>
                                    <button onClick={onLogin} className="mt-2 text-sm font-semibold text-sky-600 hover:underline">Se connecter</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                             <img 
                                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f74444(${place.coordinates.lng},${place.coordinates.lat})/${place.coordinates.lng},${place.coordinates.lat},14,0/400x300?access_token=pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTd2ZzUwMDk1bHNrdDR2d3p3bmVoIn0.p-b4-dlBS_G87-O3T5M0gQ`}
                                alt={`Carte pour ${place.name}`}
                                className="w-full h-56 object-cover" 
                            />
                            <div className="p-4">
                                <div className="flex items-start space-x-3">
                                    <Icon name="map-pin" className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0"/>
                                    <p className="text-sm text-gray-700">{place.address}</p>
                                </div>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${place.address.replace(/ /g, "+")}`} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center w-full bg-slate-100 text-slate-800 font-semibold py-2 rounded-lg hover:bg-slate-200 transition-colors">
                                    Obtenir l'itinéraire
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                           <div>
                                <h4 className="text-base font-bold text-gray-800 mb-3">Contact</h4>
                                <ul className="text-sm space-y-3">
                                    <li className="flex items-center space-x-3"><Icon name="phone" className="w-5 h-5 text-gray-400"/><a href={`tel:${place.phone}`} className="text-sky-600 hover:underline">{place.phone}</a></li>
                                    <li className="flex items-center space-x-3"><Icon name="globe-alt" className="w-5 h-5 text-gray-400"/><a href={`http://${place.website}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{place.website}</a></li>
                                </ul>
                           </div>
                           <hr />
                           <div>
                                <h4 className="text-base font-bold text-gray-800 mb-3">Horaires</h4>
                                <OpeningHoursDisplay hours={place.openingHours} />
                           </div>
                        </div>
                        
                        {/* AI Recommendations */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Recommandations IA</h3>
                            {!currentUser ? (
                                <p className="text-sm text-gray-500">Connectez-vous pour obtenir des recommandations personnalisées.</p>
                            ) : (
                                <button onClick={findSimilarWithAI} disabled={isLoadingAI} className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300">
                                    {isLoadingAI ? <Icon name="spinner" className="w-5 h-5" /> : <Icon name="sparkles" className="w-5 h-5"/>}
                                    <span>{isLoadingAI ? 'Recherche en cours...' : 'Trouver des lieux similaires (IA)'}</span>
                                </button>
                            )}
                            {aiError && <p className="mt-4 text-sm text-red-600">{aiError}</p>}
                            {similarPlacesAI.length > 0 && (
                                <div className="mt-4 space-y-3 border-t pt-4">
                                    {similarPlacesAI.map(item => (
                                     <div key={item.id} onClick={() => navigateTo('place-detail', item.id)} className="flex items-center space-x-4 bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                                         <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                                         <div>
                                             <h5 className="font-bold text-sm text-gray-800">{item.name}</h5>
                                             <p className="text-xs text-gray-500">{item.category}</p>
                                         </div>
                                     </div>  
                                   ))}
                                </div>
                            )}
                        </div>

                         <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Suggestions manuelles</h3>
                            <div className="space-y-4">
                               {similarPlaces.map(item => (
                                 <div key={item.id} onClick={() => navigateTo('place-detail', item.id)} className="flex items-center space-x-4 bg-white p-3 rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                                     <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                     <div>
                                         <h5 className="font-bold text-gray-800">{item.name}</h5>
                                         <div className="flex items-center text-xs">
                                             <StarRating rating={item.rating} hideCount={true} />
                                             <span className="ml-2 text-gray-500">{item.reviewCount} avis</span>
                                         </div>
                                     </div>
                                 </div>  
                               ))}
                            </div>
                         </div>

                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PlaceDetailPage;