import React, { useState, useMemo } from 'react';
import { Place, Profile, PlaceClaim, Organization } from '../types';
import { PLACES, ORGANIZATIONS } from '../constants';

interface ClaimPlacePageProps {
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  onClaim: (claim: Omit<PlaceClaim, 'id' | 'status'>) => void;
}

const ClaimPlacePage: React.FC<ClaimPlacePageProps> = ({ currentUser, navigateTo, onClaim }) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [proof, setProof] = useState('');
  
  const userOrganization = useMemo(() => ORGANIZATIONS.find(org => org.primary_owner_id === currentUser?.id), [currentUser]);

  if (!currentUser || !userOrganization) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-800">Accès non autorisé</h1>
        <p className="text-gray-600 mt-2">Vous devez avoir une organisation enregistrée pour revendiquer un lieu.</p>
        <button onClick={() => navigateTo('espace-pro')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-full">
            Retour à l'Espace Pro
        </button>
      </div>
    );
  }

  const alreadyOwnedPlaceIds = ORGANIZATIONS.flatMap(org => org.place_ids);
  const unclaimedPlaces = PLACES.filter(p => !alreadyOwnedPlaceIds.includes(p.id));
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPlaceId || !proof.trim()) {
          alert('Veuillez sélectionner un lieu et fournir une preuve.');
          return;
      }
      
      onClaim({
          placeId: selectedPlaceId,
          organizationId: userOrganization.id,
          userId: currentUser.id
      });
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-left mb-12">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('espace-pro'); }} className="text-sm text-sky-600 hover:underline">&larr; Retour à l'Espace Pro</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Revendiquer un Établissement</h1>
            <p className="mt-4 text-xl text-gray-600">
              Votre établissement est déjà sur Salut Annecy ? Revendiquez sa propriété pour en prendre le contrôle.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <div>
              <label htmlFor="placeId" className="block text-sm font-medium text-gray-700">Établissement à revendiquer</label>
              <select
                id="placeId"
                value={selectedPlaceId}
                onChange={(e) => setSelectedPlaceId(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
              >
                <option value="">-- Sélectionnez un lieu --</option>
                {unclaimedPlaces.map(place => (
                  <option key={place.id} value={place.id}>{place.name} - {place.address}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="proof" className="block text-sm font-medium text-gray-700">Preuve de propriété</label>
              <input
                type="text"
                id="proof"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="Ex: N° SIRET, lien vers un document officiel..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Cette information sera vérifiée par notre équipe et ne sera pas rendue publique.
              </p>
            </div>
            
            <div className="pt-5 text-right">
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Envoyer la demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimPlacePage;