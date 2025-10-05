
import React, { useState } from 'react';
import { Listing, Profile, ListingType } from '../../types';

interface ProposeListingFormProps {
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
  onAddListing: (listing: Omit<Listing, 'id' | 'date' | 'userId' | 'status' | 'expires_at' | 'rejection_reason' | 'imageUrl' | 'metadata'>) => void;
}

const ProposeListingForm: React.FC<ProposeListingFormProps> = ({ currentUser, navigateTo, onAddListing }) => {
    if (!currentUser) return <div className="text-center py-20">Accès non autorisé.</div>;

    const [formData, setFormData] = useState({
        type: ListingType.BonnesAffaires,
        title: '',
        price: '',
        description: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddListing(formData);
    };

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('propose'); }} className="text-sm text-sky-600 hover:underline">&larr; Choisir un autre type de contenu</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Déposer une Petite Annonce</h1>
            <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="type">Type d'annonce</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            {Object.values(ListingType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price">Prix ou Rémunération</label>
                        <input type="text" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Ex: 450€, 20€/h, ..." />
                    </div>
                </div>
                <div>
                    <label htmlFor="title">Titre de l'annonce</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows={6} value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
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
export default ProposeListingForm;
