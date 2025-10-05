
import React, { useState } from 'react';
import { Trail, Profile, TrailDifficulty } from '../../types';

interface ProposeTrailFormProps {
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
  onAddTrail: (trail: Omit<Trail, 'id' | 'imageUrl' | 'startPoint' | 'status' | 'rejection_reason'>) => void;
}

const ProposeTrailForm: React.FC<ProposeTrailFormProps> = ({ currentUser, navigateTo, onAddTrail }) => {
    if (!currentUser) return <div className="text-center py-20">Accès non autorisé.</div>;
    
    const [formData, setFormData] = useState({
        name: '',
        excerpt: '',
        description: '',
        difficulty: TrailDifficulty.Easy,
        distanceKm: 0,
        durationMin: 0,
        ascentM: 0,
        gpxUrl: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTrail(formData);
    };

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('propose'); }} className="text-sm text-sky-600 hover:underline">&larr; Choisir un autre type de contenu</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Proposer un Nouveau Sentier</h1>
            <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-6">
                <div>
                    <label htmlFor="name">Nom du sentier</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label htmlFor="excerpt">Résumé (1 phrase)</label>
                    <input type="text" name="excerpt" id="excerpt" value={formData.excerpt} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="difficulty">Difficulté</label>
                        <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            {Object.values(TrailDifficulty).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="distanceKm">Distance (km)</label>
                        <input type="number" step="0.1" name="distanceKm" id="distanceKm" value={formData.distanceKm} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="durationMin">Durée (minutes)</label>
                        <input type="number" name="durationMin" id="durationMin" value={formData.durationMin} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="ascentM">Dénivelé positif (m)</label>
                        <input type="number" name="ascentM" id="ascentM" value={formData.ascentM} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                 </div>
                <div>
                    <label htmlFor="gpxUrl">URL du fichier GPX (optionnel)</label>
                    <input type="text" name="gpxUrl" id="gpxUrl" value={formData.gpxUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label htmlFor="description">Description complète</label>
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
export default ProposeTrailForm;
