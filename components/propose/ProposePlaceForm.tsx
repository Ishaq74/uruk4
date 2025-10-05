
import React, { useState } from 'react';
import { Place, Profile } from '../../types';

interface ProposePlaceFormProps {
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
  onAddPlace: (place: Omit<Place, 'id' | 'rating' | 'reviewCount' | 'reviews' | 'openingHours' | 'coordinates' | 'phone' | 'website' | 'imageUrl' | 'priceRange' | 'attributes' | 'status' | 'organization_id' | 'rejection_reason'>) => void;
}

const ProposePlaceForm: React.FC<ProposePlaceFormProps> = ({ currentUser, navigateTo, onAddPlace }) => {
    if (!currentUser) {
        return <div className="text-center py-20">Accès non autorisé.</div>;
    }

    const [formData, setFormData] = useState({
        name: '',
        mainCategory: 'restauration' as Place['mainCategory'],
        category: '',
        address: '',
        description: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPlace(formData);
    };

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('propose'); }} className="text-sm text-sky-600 hover:underline">&larr; Choisir un autre type de contenu</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Proposer un Nouveau Lieu</h1>
          <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du lieu</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700">Catégorie Principale</label>
                    <select id="mainCategory" name="mainCategory" value={formData.mainCategory} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                        <option value="restauration">Restauration</option>
                        <option value="hebergement">Hébergement</option>
                        <option value="activites">Activité</option>
                        <option value="commerces">Commerce / Service</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Sous-catégorie</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" placeholder="Ex: Savoyard, Hôtel ★★★, ..."/>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse complète</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                </div>
            <div className="pt-5 flex justify-end">
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700">
                    Soumettre pour modération
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProposePlaceForm;
