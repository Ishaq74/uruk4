import React from 'react';
import { Event, Place, Profile } from '../types';
import Icon from './Icon';

interface EventDetailPageProps {
  id: string;
  events: Event[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
  currentUser: Profile | null;
}

const InfoCard: React.FC<{ icon: string, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex items-start space-x-4">
        <Icon name={icon} className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
        <div>
            <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
            <div className="text-base text-gray-800 font-medium">{children}</div>
        </div>
    </div>
);

const EventDetailPage: React.FC<EventDetailPageProps> = ({ id, events, navigateTo, currentUser }) => {
  const event = events.find(e => e.id === id);

  if (!event) {
    return <div className="text-center py-20">Événement non trouvé.</div>;
  }

  return (
    <div className="bg-white">
      {/* Header Image */}
      <div className="relative h-96">
        <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="inline-block mb-2 px-3 py-1 text-sm font-bold bg-rose-600 text-white rounded-full">
               {event.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">{event.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>{event.description}</p>
            </div>
          </div>
          {/* Sidebar */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              {/* Info Panel */}
              <div className="bg-white rounded-xl shadow-sm p-6 border space-y-6">
                <InfoCard icon="calendar" label="Date">
                  {event.date}
                </InfoCard>
                <InfoCard icon="map-pin" label="Lieu">
                  {event.location}
                </InfoCard>
                 <InfoCard icon="tag" label="Prix">
                  {event.price}
                </InfoCard>
                <button className="w-full mt-2 py-3 text-base font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors shadow-sm">
                    Ajouter à mes favoris
                </button>
              </div>

              {/* Map */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <h3 className="text-lg font-bold text-gray-800 p-4 border-b">Localisation</h3>
                 <img 
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f74444(${event.coordinates.lng},${event.coordinates.lat})/${event.coordinates.lng},${event.coordinates.lat},13,0/400x300?access_token=pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTd2ZzUwMDk1bHNrdDR2d3p3bmVoIn0.p-b4-dlBS_G87-O3T5M0gQ`}
                    alt={`Carte pour ${event.title}`}
                    className="w-full h-56 object-cover" 
                />
                 <div className="p-4 bg-slate-50">
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${event.coordinates.lat},${event.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="mt-1 block text-center w-full bg-slate-200 text-slate-800 font-semibold py-2 rounded-lg hover:bg-slate-300 transition-colors">
                        S'y rendre
                    </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;