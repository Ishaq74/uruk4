import React, { useState, useMemo } from 'react';
import { Group, Place, Profile } from '../types';
import Icon from './Icon';

interface GroupListPageProps {
  groups: Group[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  currentUser: Profile | null;
  filter?: 'my-listings' | 'my-groups';
  onAddGroup: () => void;
}

const GroupCard: React.FC<{ group: Group; navigateTo: (page: string, id: string) => void }> = ({ group, navigateTo }) => {
  return (
    <div 
        onClick={() => navigateTo('group-detail', group.id)}
        className="group bg-white rounded-xl shadow-sm border hover:border-sky-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="h-32 bg-slate-200">
        <img src={group.bannerUrl} alt={`Bannière de ${group.name}`} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 relative">
        <div className="absolute -top-10 left-4">
          <img src={group.avatarUrl} alt={`Avatar de ${group.name}`} className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
        </div>
        <div className="pt-12">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-sky-600">{group.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{group.memberCount} membres &middot; {group.isPrivate ? 'Privé' : 'Public'}</p>
            <p className="mt-3 text-sm text-gray-600 h-20 overflow-hidden">{group.description}</p>
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t">
        <button className="w-full py-2 text-sm font-semibold bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
            Voir le groupe
        </button>
      </div>
    </div>
  );
};

const GroupListPage: React.FC<GroupListPageProps> = ({ groups, navigateTo, currentUser, filter, onAddGroup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const isMyGroupsFiltered = filter === 'my-groups' && currentUser;

  const filteredGroups = useMemo(() => {
    let currentGroups = groups;

    if (isMyGroupsFiltered && currentUser) {
        currentGroups = currentGroups.filter(g => g.members.some(m => m.profileId === currentUser.id));
    }

    if (searchTerm.trim() !== '') {
        currentGroups = currentGroups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return currentGroups;

  }, [searchTerm, isMyGroupsFiltered, currentUser, groups]);

  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-12">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    {isMyGroupsFiltered ? "Mes Groupes" : "Groupes"}
                </h1>
                <p className="mt-4 max-w-2xl text-xl text-gray-600">
                    {isMyGroupsFiltered 
                        ? "Retrouvez ici toutes les communautés que vous avez rejointes."
                        : "Trouvez des personnes qui partagent vos centres d'intérêt."
                    }
                </p>
                {isMyGroupsFiltered && (
                     <button onClick={() => navigateTo('groupes')} className="mt-2 text-sm text-sky-600 hover:underline font-semibold">Voir tous les groupes</button>
                )}
            </div>
             <button
                onClick={onAddGroup}
                disabled={!currentUser}
                className="mt-4 sm:mt-0 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-sm whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
                Créer un groupe
            </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredGroups.map(group => (
                <GroupCard key={group.id} group={group} navigateTo={navigateTo} />
            ))}
        </div>
      </div>
    </div>
  );
};
export default GroupListPage;