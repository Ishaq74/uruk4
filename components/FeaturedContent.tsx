import React from 'react';
import { Place, Event, Trail } from '../types';

interface FeaturedContentProps {
  places: Place[];
  events: Event[];
  trails: Trail[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string) => void;
}

const FeaturedCard: React.FC<{ item: any, navigateTo: FeaturedContentProps['navigateTo'] }> = ({ item, navigateTo }) => {
  // Build appropriate href based on item type
  const getHref = () => {
    if (item.navPage === 'place-detail' && item.navSlug && item.mainCategory) {
      const categoryMap: Record<Place['mainCategory'], string> = {
        'restauration': 'restaurant',
        'hebergement': 'hebergement',
        'activites': 'activite',
        'commerces': 'commerce'
      };
      return `/${categoryMap[item.mainCategory]}/${item.navSlug}`;
    } else if (item.navPage === 'event-detail' && item.navSlug) {
      return `/evenement/${item.navSlug}`;
    } else if (item.navPage === 'trail-detail' && item.navSlug) {
      return `/sentier/${item.navSlug}`;
    }
    return `/${item.navPage}/${item.navId}`;
  };
  
  return (
    <a href={getHref()} onClick={(e) => { e.preventDefault(); navigateTo(item.navPage, item.navId, item.mainCategory, undefined, item.navSlug); }} className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="text-xs font-bold uppercase tracking-wider bg-sky-500 text-white px-2 py-1 rounded">{item.type}</span>
          <h3 className="text-lg font-semibold text-white mt-2 group-hover:text-sky-300 transition-colors">{item.title}</h3>
        </div>
      </div>
    </a>
  );
};

const FeaturedContent: React.FC<FeaturedContentProps> = ({ places, events, trails, navigateTo }) => {
  // Build featured content dynamically from props
  const featuredContent = [
      trails.find(t => t.id === 't1') ? { id: 'feat1', imageUrl: trails.find(t => t.id === 't1')?.imageUrl, title: 'Randonnée au sommet du Semnoz', type: 'Sentier', navPage: 'trail-detail', navId: 't1', navSlug: trails.find(t => t.id === 't1')?.slug} : null,
      places.find(p => p.id === 'r2') ? { id: 'feat2', imageUrl: places.find(p => p.id === 'r2')?.imageUrl, title: 'La meilleure tartiflette ?', type: 'Restaurant', navPage: 'place-detail', navId: 'r2', navSlug: places.find(p => p.id === 'r2')?.slug, mainCategory: places.find(p => p.id === 'r2')?.mainCategory} : null,
      events.find(e => e.id === 'ev2') ? { id: 'feat3', imageUrl: events.find(e => e.id === 'ev2')?.imageUrl, title: 'Fête de la Musique', type: 'Événement', navPage: 'event-detail', navId: 'ev2', navSlug: events.find(e => e.id === 'ev2')?.slug} : null,
      places.find(p => p.id === 'c1') ? { id: 'feat4', imageUrl: places.find(p => p.id === 'c1')?.imageUrl, title: 'Shopping en vieille ville', type: 'Commerce', navPage: 'place-detail', navId: 'c1', navSlug: places.find(p => p.id === 'c1')?.slug, mainCategory: places.find(p => p.id === 'c1')?.mainCategory} : null
  ].filter(Boolean);
    
  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">À la une</h2>
      <p className="mt-4 text-lg text-gray-600">Nos recommandations pour une expérience inoubliable à Annecy.</p>
      <div className="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {featuredContent.map((item) => (
          <FeaturedCard key={item!.id} item={item} navigateTo={navigateTo} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedContent;