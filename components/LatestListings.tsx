import React from 'react';
import { LISTING_ICONS } from '../constants';
import { Listing, ListingType, Place } from '../types';
import Icon from './Icon';

interface LatestListingsProps {
    listings: Listing[];
    navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const ListingItem: React.FC<{ listing: Listing, navigateTo: LatestListingsProps['navigateTo'] }> = ({ listing, navigateTo }) => {
    const iconInfo = LISTING_ICONS[listing.type as ListingType];
    return (
        <li>
            <a href={listing.slug ? `/annonce/${listing.slug}` : `/annonce/${listing.id}`} onClick={(e) => { e.preventDefault(); navigateTo('annonce-detail', listing.id, undefined, undefined, listing.slug); }} className="flex items-center p-4 -m-4 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Icon name={iconInfo.name} className={iconInfo.className} />
                </div>
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-gray-800">{listing.title}</p>
                    <p className="text-sm text-gray-500">{listing.price}</p>
                </div>
                <div className="ml-4 text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-800">{listing.type}</p>
                    <p className="text-xs text-gray-500">{listing.date}</p>
                </div>
            </a>
        </li>
    );
};


const LatestListings: React.FC<LatestListingsProps> = ({ listings, navigateTo }) => {
  return (
    <section>
       <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Dernières Annonces</h2>
            <p className="mt-4 text-lg text-gray-600">Le pouls de la vie locale: emploi, immobilier, bonnes affaires et services.</p>
        </div>
    <a href="/annonces" onClick={(e) => { e.preventDefault(); navigateTo('annonces')}} className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-all duration-300 shadow-sm whitespace-nowrap">
            Voir toutes les annonces
        </a>
      </div>
       <div className="bg-white/50 p-6 rounded-2xl shadow-sm">
        <ul className="space-y-4">
            {listings.slice(0,3).map((listing) => (
                <ListingItem key={listing.id} listing={listing} navigateTo={navigateTo} />
            ))}
        </ul>
      </div>
    </section>
  );
};

export default LatestListings;