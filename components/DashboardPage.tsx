import React from 'react';
import { Profile, Place } from '../types';
import Icon from './Icon';

interface DashboardPageProps {
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
}

const DashboardCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <div 
        onClick={onClick}
        className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-500 border-2 border-transparent transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
        <div className="flex items-center space-x-4">
            <div className="bg-sky-100 p-3 rounded-full">
                <Icon name={icon} className="w-6 h-6 text-sky-600"/>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-sky-600">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    </div>
);


const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, navigateTo }) => {
  if (!currentUser) {
    // This page should not be accessible if not logged in, but as a fallback:
    return (
      <div className="text-center py-20">
        <p>Veuillez vous connecter pour accéder à votre tableau de bord.</p>
        <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-full">
            Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Bonjour, {currentUser.fullName.split(' ')[0]} !</h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600">
            Bienvenue sur votre tableau de bord. D'ici, vous pouvez gérer toutes vos activités sur la plateforme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard 
                icon="user"
                title="Mon Profil Public"
                description="Voir et modifier mon profil"
                onClick={() => navigateTo('profile', currentUser.id)}
            />
            <DashboardCard 
                icon="heart"
                title="Mes Favoris"
                description="Retrouver mes lieux préférés"
                onClick={() => navigateTo('favorites')}
            />
            <DashboardCard 
                icon="star"
                title="Mes Contributions"
                description="Gérer mes avis et commentaires"
                onClick={() => navigateTo('profile', currentUser.id, undefined, undefined, 'contributions')}
            />
             <DashboardCard 
                icon="users"
                title="Mes Groupes"
                description="Accéder à mes communautés"
                onClick={() => navigateTo('groupes', undefined, undefined, undefined, undefined, 'my-groups')}
            />
             <DashboardCard 
                icon="message-square"
                title="Ma Messagerie"
                description="Voir mes messages privés"
                onClick={() => navigateTo('conversations')}
            />
            <DashboardCard 
                icon="briefcase"
                title="Mes Annonces"
                description="Consulter mes annonces en cours"
                onClick={() => navigateTo('annonces', undefined, undefined, undefined, undefined, 'my-listings')}
            />
             <DashboardCard 
                icon="layout-dashboard"
                title="Espace Professionnel"
                description="Gérer ma page Pro"
                onClick={() => navigateTo('espace-pro')}
            />
             <DashboardCard 
                icon="settings"
                title="Paramètres du Compte"
                description="Gérer mon compte et mes données"
                onClick={() => navigateTo('settings')}
            />

        </div>
      </div>
    </div>
  );
};
export default DashboardPage;