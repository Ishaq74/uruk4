import React, { useState, useEffect } from 'react';
import { Place, Profile } from '../types';
import { PLACES } from '../constants';

interface ManagePlacePageProps {
  id: string;
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  onUpdatePlace: (placeId: string, data: Partial<Pick<Place, 'name' | 'description' | 'category'>>) => void;
}

const ManagePlacePage: React.FC<ManagePlacePageProps> = ({ id, currentUser, navigateTo, onUpdatePlace }) => {
  const [place, setPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
      name: '',
      category: '',
      description: ''
  });

  useEffect(() => {
    const foundPlace = PLACES.find(p => p.id === id);
    if (foundPlace) {
      setPlace(foundPlace);
      setFormData({
          name: foundPlace.name,
          category: foundPlace.category,
          description: foundPlace.description,
      });
    }
  }, [id]);

  if (!currentUser) {
    return <div className="text-center py-20">Accès non autorisé.</div>;
  }
  
  if (!place) {
    return <div className="text-center py-20">Établissement non trouvé.</div>;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlace(place.id, formData);
  };

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
           <div className="mb-8">
                <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('espace-pro');}} className="text-sm text-sky-600 hover:underline">&larr; Retour à l'Espace Pro</a>
                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Modifier {place.name}</h1>
            </div>

           <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows={6} value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"></textarea>
                </div>
                <div className="text-right">
                    <button type="submit" className="px-5 py-3 bg-sky-600 text-white font-semibold rounded-md shadow-sm hover:bg-sky-700">
                        Enregistrer les modifications
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ManagePlacePage;