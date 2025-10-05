import React from 'react';
import { LISTING_ICONS } from '../constants';
import { Listing, Place, Profile, ListingType } from '../types';
import Icon from './Icon';

interface AnnonceDetailPageProps {
  id: string;
  listings: Listing[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
  currentUser: Profile | null;
  onStartConversation: (recipientId: string) => void;
}

const AnnonceDetailPage: React.FC<AnnonceDetailPageProps> = ({ id, listings, profiles, navigateTo, currentUser, onStartConversation }) => {
  const annonce = listings.find(a => a.id === id);

  if (!annonce) {
    return <div className="text-center py-20">Annonce non trouvée.</div>;
  }
  
  const seller = profiles.find(p => p.id === annonce.userId);
  const iconInfo = LISTING_ICONS[annonce.type as ListingType];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('annonces'); }} className="text-sm text-sky-600 hover:underline">&larr; Retour aux annonces</a>
                <div className="mt-4 flex items-center space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center"><Icon name={iconInfo.name} className={iconInfo.className} /></div>
                    <span className="font-semibold text-gray-500">{annonce.type}</span>
                </div>
                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{annonce.title}</h1>
                <p className="mt-2 text-sm text-gray-400">Publié le {annonce.date}</p>
            </div>
            
            {annonce.imageUrl && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img src={annonce.imageUrl} alt={annonce.title} className="w-full h-96 object-cover" />
                </div>
            )}
            
            <div className="prose prose-lg max-w-none text-gray-700">
                <p>{annonce.description}</p>
            </div>
          </div>
          {/* Sidebar */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="text-4xl font-extrabold text-emerald-600">{annonce.price}</p>
                </div>

                 {seller && (
                     <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Vendeur</h3>
                        <div className="flex items-center space-x-4">
                            <img src={seller.avatarUrl} alt={seller.fullName} className="w-16 h-16 rounded-full"/>
                            <div>
                                <p className="font-bold text-gray-800">{seller.fullName}</p>
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); navigateTo('profile', seller.id); }} 
                                    className="text-sm text-sky-600 hover:underline"
                                >
                                    Voir le profil
                                </a>
                            </div>
                        </div>
                        {currentUser && currentUser.id !== seller.id && (
                            <button 
                                onClick={() => onStartConversation(seller.id)}
                                className="w-full mt-6 py-3 text-base font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors shadow-sm"
                            >
                                Contacter le vendeur
                            </button>
                        )}
                        {!currentUser && (
                            <p className="text-xs text-center mt-4 text-gray-500">Connectez-vous pour contacter le vendeur.</p>
                        )}
                     </div>
                 )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AnnonceDetailPage;