import React from 'react';
import { Profile } from '../types';

interface AdCampaignsPageProps {
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
}

const AdCampaignsPage: React.FC<AdCampaignsPageProps> = ({ currentUser, navigateTo }) => {
  if (!currentUser) {
    return <div className="text-center py-20">Accès non autorisé.</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('espace-pro');}} className="text-sm text-sky-600 hover:underline">&larr; Retour à l'Espace Pro</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Campagnes Publicitaires</h1>
            <p className="mt-2 text-lg text-gray-600">Gérez vos contenus sponsorisés et vos bannières publicitaires.</p>
        </div>

        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">Bientôt disponible</h2>
            <p className="mt-2 text-gray-500">
                La régie publicitaire est en cours de développement. Revenez bientôt pour promouvoir votre établissement !
            </p>
            <button onClick={() => navigateTo('espace-pro')} className="mt-6 px-5 py-3 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-all duration-300 shadow-sm">
                Retour au tableau de bord
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdCampaignsPage;
