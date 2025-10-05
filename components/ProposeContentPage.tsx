import React from 'react';
import { Place, Profile } from '../types';
import Icon from './Icon';

interface ProposeContentPageProps {
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
}

const ChoiceCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <div 
        onClick={onClick}
        className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-500 border-2 border-transparent transition-all duration-300 cursor-pointer flex items-start space-x-4"
    >
        <div className="bg-sky-100 p-3 rounded-full flex-shrink-0 mt-1">
            <Icon name={icon} className="w-8 h-8 text-sky-600"/>
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-sky-600">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    </div>
);


const ProposeContentPage: React.FC<ProposeContentPageProps> = ({ currentUser, navigateTo }) => {

    if (!currentUser) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-gray-800">Accès non autorisé</h1>
                <p className="text-gray-600 mt-2">Vous devez être connecté pour proposer du contenu.</p>
                <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-full">
                    Retour à l'accueil
                </button>
            </div>
        );
    }
    
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Proposer un nouveau contenu</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Merci de contribuer à la richesse de Salut Annecy ! Que souhaitez-vous partager avec la communauté ?
            </p>
          </div>

          <div className="space-y-6">
             <ChoiceCard 
                icon="map-pin"
                title="Proposer un Lieu"
                description="Partagez un restaurant, un hôtel, un commerce ou une activité que vous aimez."
                onClick={() => navigateTo('propose-place')}
             />
             <ChoiceCard 
                icon="calendar"
                title="Proposer un Événement"
                description="Annoncez un concert, un marché, une exposition ou tout autre événement local."
                onClick={() => navigateTo('propose-event')}
             />
             <ChoiceCard 
                icon="hiking"
                title="Proposer un Sentier"
                description="Décrivez une randonnée que vous connaissez, de la balade familiale au trek pour experts."
                onClick={() => navigateTo('propose-trail')}
             />
             <ChoiceCard 
                icon="briefcase"
                title="Déposer une Petite Annonce"
                description="Publiez une offre d'emploi, un bien immobilier, un objet à vendre ou une demande de service."
                onClick={() => navigateTo('propose-listing')}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposeContentPage;
