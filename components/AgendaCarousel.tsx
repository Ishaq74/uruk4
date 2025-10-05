import React from 'react';
import { Event, Place } from '../types';

interface AgendaCarouselProps {
    events: Event[];
    navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const EventCard: React.FC<{ event: Event, navigateTo: AgendaCarouselProps['navigateTo'] }> = ({ event, navigateTo }) => (
  <div className="flex-shrink-0 w-64 snap-start">
    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('event-detail', event.id); }} className="group block">
      <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
        <div className="p-4 bg-white">
          <p className="text-sm font-bold text-rose-600">{event.date}</p>
          <h4 className="mt-1 font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">{event.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{event.location}</p>
        </div>
      </div>
    </a>
  </div>
);

const AgendaCarousel: React.FC<AgendaCarouselProps> = ({ events, navigateTo }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">L'Agenda du Moment</h2>
            <p className="mt-4 text-lg text-gray-600">Ne manquez rien de ce qu'il se passe à Annecy.</p>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('events'); }} className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-all duration-300 shadow-sm whitespace-nowrap">
            Voir tout l'agenda
        </a>
      </div>
      <div className="flex space-x-6 overflow-x-auto pb-4 custom-scroll-bar snap-x snap-mandatory">
        {events.slice(0, 5).map((event) => (
          <EventCard key={event.id} event={event} navigateTo={navigateTo} />
        ))}
        {/* Add an empty div for better snapping at the end */}
        <div className="flex-shrink-0 w-1 snap-end"></div>
      </div>
    </section>
  );
};

export default AgendaCarousel;