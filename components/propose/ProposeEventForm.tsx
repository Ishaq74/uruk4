
import React, { useState } from 'react';
import { Event, Profile, EventCategory } from '../../types';
import { EVENT_CATEGORIES } from '../../constants';

interface ProposeEventFormProps {
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
  onAddEvent: (event: Omit<Event, 'id' | 'imageUrl' | 'coordinates' | 'status' | 'rejection_reason'>) => void;
}

const ProposeEventForm: React.FC<ProposeEventFormProps> = ({ currentUser, navigateTo, onAddEvent }) => {
    if (!currentUser) return <div className="text-center py-20">Accès non autorisé.</div>;
    
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        category: 'Culture' as EventCategory,
        price: '',
        description: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value as EventCategory }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddEvent(formData);
    };

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('propose'); }} className="text-sm text-sky-600 hover:underline">&larr; Choisir un autre type de contenu</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Proposer un Nouvel Événement</h1>
            <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-6">
                 <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre de l'événement</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date(s)</label>
                        <input type="text" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Ex: 15 JUILLET or 09-15 JUIN" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lieu</label>
                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Ex: Bonlieu, Paquier, ..." />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            {EVENT_CATEGORIES.map(cat => <option key={cat.id} value={cat.label}>{cat.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
                        <input type="text" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Ex: Gratuit, 15€, ..." />
                    </div>
                 </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
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
export default ProposeEventForm;
