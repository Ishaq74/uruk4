import React from 'react';
import { Place, Profile, AnalyticsEvent } from '../types';
import { PLACES, ANALYTICS_EVENTS } from '../constants';
import Icon from './Icon';

interface PlaceAnalyticsPageProps {
  id: string;
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
}

const StatCard: React.FC<{ icon: string, value: string, label: string, color: string }> = ({ icon, value, label, color }) => (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <div className="flex items-center space-x-4">
            <Icon name={icon} className="w-8 h-8 opacity-70"/>
            <div>
                <p className="text-4xl font-extrabold">{value}</p>
                <p className="text-sm font-medium uppercase tracking-wider">{label}</p>
            </div>
        </div>
    </div>
);

const PlaceAnalyticsPage: React.FC<PlaceAnalyticsPageProps> = ({ id, currentUser, navigateTo }) => {
  const place = PLACES.find(p => p.id === id);

  if (!currentUser) {
    return <div className="text-center py-20">Accès non autorisé.</div>;
  }
  
  if (!place) {
    return <div className="text-center py-20">Établissement non trouvé.</div>;
  }
  
  const views = ANALYTICS_EVENTS.find(e => e.target_entity_id === id && e.event_name === 'view_place')?.count || 0;
  const phoneClicks = ANALYTICS_EVENTS.find(e => e.target_entity_id === id && e.event_name === 'click_phone')?.count || 0;
  const websiteClicks = ANALYTICS_EVENTS.find(e => e.target_entity_id === id && e.event_name === 'click_website')?.count || 0;

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="mb-8">
            <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('espace-pro');}} className="text-sm text-sky-600 hover:underline">&larr; Retour à l'Espace Pro</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Statistiques pour {place.name}</h1>
            <p className="mt-2 text-lg text-gray-600">Suivez la performance de votre page sur les 30 derniers jours.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon="users" value={views.toLocaleString('fr-FR')} label="Vues de la page" color="from-sky-500 to-sky-600"/>
            <StatCard icon="phone" value={phoneClicks.toLocaleString('fr-FR')} label="Clics sur le téléphone" color="from-emerald-500 to-emerald-600"/>
            <StatCard icon="globe-alt" value={websiteClicks.toLocaleString('fr-FR')} label="Clics sur le site web" color="from-amber-500 to-amber-600"/>
        </div>
        
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Évolution des vues</h2>
            <div className="text-center text-gray-500 py-20 bg-slate-50 rounded-lg">
                <p>Un graphique interactif sera bientôt disponible ici.</p>
                <p className="text-sm">(Intégration d'une librairie de graphiques comme Chart.js ou Recharts)</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceAnalyticsPage;