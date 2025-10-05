import React, { useState, useEffect } from 'react';
import { Profile, Place } from '../types';

interface SettingsPageProps {
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  onUpdateProfile: (data: { fullName: string, bio: string }) => void;
  onRequestDataExport: (userId: string) => void;
  onDeleteAccount: (userId: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, navigateTo, onUpdateProfile, onRequestDataExport, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    bio: currentUser?.bio || '',
  });

  useEffect(() => {
    setFormData({
      fullName: currentUser?.fullName || '',
      bio: currentUser?.bio || '',
    });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <p>Veuillez vous connecter pour accéder à vos paramètres.</p>
        <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-full">
            Retour à l'accueil
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };
  
  const handleDataExport = () => {
    if (currentUser) {
      onRequestDataExport(currentUser.id);
    }
  };
  
  const handleDeleteAccount = () => {
    if (currentUser) {
      onDeleteAccount(currentUser.id);
    }
  };

  const TabButton: React.FC<{ tabId: string, label: string }> = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-full text-left ${
        activeTab === tabId ? 'bg-sky-100 text-sky-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Paramètres du Compte</h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600">
            Gérez vos informations de profil, notifications et préférences.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-1 bg-white p-4 rounded-xl shadow-sm">
              <TabButton tabId="profile" label="Profil" />
              <TabButton tabId="security" label="Sécurité & Connexion" />
              <TabButton tabId="notifications" label="Notifications" />
              <TabButton tabId="data" label="Données & RGPD" />
            </nav>
          </aside>

          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm p-8 min-h-[400px]">
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Profil Public</h2>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"></textarea>
                  </div>
                  <div className="text-right">
                    <button type="submit" className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-sm hover:bg-sky-700">
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              )}
               {(activeTab === 'security' || activeTab === 'notifications') && (
                <div>
                   <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab === 'security' ? 'Sécurité & Connexion' : 'Notifications'}</h2>
                   <div className="text-center py-16 text-gray-500">
                     Cette section sera bientôt disponible.
                   </div>
                 </div>
              )}
              {activeTab === 'data' && (
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-800">Données & RGPD</h2>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Exporter vos données</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Obtenez une copie de toutes les données associées à votre compte au format JSON.
                        </p>
                        <button onClick={handleDataExport} className="mt-3 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Demander un export
                        </button>
                    </div>
                    <div className="border-t pt-6 border-red-200">
                        <h3 className="text-lg font-semibold text-red-700">Zone de danger</h3>
                        <p className="mt-1 text-sm text-red-600">
                            La suppression de votre compte est une action irréversible. Toutes vos données (profil, avis, favoris, etc.) seront définitivement effacées.
                        </p>
                        <button onClick={handleDeleteAccount} className="mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                            Supprimer mon compte
                        </button>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
