import React from 'react';
import Hero from './Hero';
import FeaturedContent from './FeaturedContent';
import AgendaCarousel from './AgendaCarousel';
import CategoryGrid from './CategoryGrid';
import LatestListings from './LatestListings';
import MagazineSection from './MagazineSection';
import { Place, Event, Trail, Article, Listing } from '../types';

interface HomePageProps {
  places: Place[];
  events: Event[];
  trails: Trail[];
  articles: Article[];
  listings: Listing[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ places, events, trails, articles, listings, navigateTo, onSearch }) => {
  return (
    <>
      <Hero onSearch={onSearch} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <FeaturedContent places={places} events={events} trails={trails} navigateTo={navigateTo} />
        <AgendaCarousel events={events} navigateTo={navigateTo} />
        <CategoryGrid navigateTo={navigateTo} />
        <LatestListings listings={listings} navigateTo={navigateTo} />
        <MagazineSection articles={articles} navigateTo={navigateTo} />
      </div>
    </>
  );
};

export default HomePage;