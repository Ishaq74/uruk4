import React, { useState } from 'react';
import { Profile, Place, Group } from '../types';

interface NewGroupPageProps {
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  onAddGroup: (group: Omit<Group, 'id' | 'members' | 'memberCount' | 'bannerUrl' | 'avatarUrl'>) => void;
}

const NewGroupPage: React.FC<NewGroupPageProps> = ({ currentUser, navigateTo, onAddGroup }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    if (!currentUser) {
        return <div className="text-center py-20">Veuillez vous connecter pour créer un groupe.</div>;
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
        
        onAddGroup({
            name,
            description,
            isPrivate,
        });
    };

    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <div className="max-w-3xl mx-auto">
                    <div className="text-left mb-12">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('groupes'); }} className="text-sm text-sky-600 hover:underline">&larr; Retour aux groupes</a>
                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Créer un nouveau groupe</h1>
                        <p className="mt-4 text-xl text-gray-600">
                            Rassemblez une communauté autour d'une passion ou d'un intérêt commun.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du groupe</label>
                            <input 
                                type="text" 
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                placeholder="Ex: Les Amoureux du Fromage d'Annecy"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea 
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                placeholder="Décrivez l'objectif de votre groupe en quelques mots..."
                            />
                        </div>
                        <div className="relative flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                id="isPrivate"
                                name="isPrivate"
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="isPrivate" className="font-medium text-gray-700">Groupe privé</label>
                                <p className="text-gray-500">Seuls les membres invités pourront voir le contenu et les participants.</p>
                            </div>
                        </div>
                        <div className="pt-5 text-right">
                             <button
                                type="submit"
                                disabled={!name.trim() || !description.trim()}
                                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400"
                            >
                                Créer le groupe
                            </button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
};
export default NewGroupPage;