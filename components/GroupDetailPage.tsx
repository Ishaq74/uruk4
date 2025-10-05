import React from 'react';
import { Group, Profile, Place } from '../types';
import Icon from './Icon';

interface GroupDetailPageProps {
  id: string;
  groups: Group[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
  currentUser: Profile | null;
  onToggleMembership: (groupId: string) => void;
}

const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ id, groups, profiles, navigateTo, currentUser, onToggleMembership }) => {
  const group = groups.find(g => g.id === id);

  if (!group) {
    return <div className="text-center py-20">Groupe non trouvé.</div>;
  }
  
  const members = group.members.map(m => profiles.find(p => p.id === m.profileId)).filter(Boolean) as Profile[];
  const isMember = currentUser ? group.members.some(m => m.profileId === currentUser.id) : false;

  return (
    <div className="bg-slate-100">
      {/* Group Header */}
      <div className="relative h-56 md:h-72">
        <img src={group.bannerUrl} alt={`Bannière de ${group.name}`} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 absolute bottom-0 left-0 right-0 pb-6 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">{group.name}</h1>
            <p className="mt-2 text-lg drop-shadow-sm">{group.memberCount} membres &middot; {group.isPrivate ? 'Groupe Privé' : 'Groupe Public'}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Fil de discussion</h2>
                 <div className="text-center py-16">
                    <p className="text-gray-500">Les discussions de groupe arrivent bientôt !</p>
                 </div>
            </div>
          </div>
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8 mt-8 lg:mt-0">
             <div className="bg-white rounded-xl shadow-sm p-6">
                <button
                    onClick={() => onToggleMembership(group.id)}
                    disabled={!currentUser}
                    className={`w-full py-3 text-base font-semibold rounded-full transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed ${
                        isMember 
                        ? 'bg-white text-rose-600 border border-rose-600 hover:bg-rose-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                >
                    {isMember ? 'Quitter le groupe' : 'Rejoindre le groupe'}
                </button>
             </div>
             <div className="bg-white rounded-xl shadow-sm p-6">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">À propos</h3>
                 <p className="text-sm text-gray-600">{group.description}</p>
             </div>
             <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Membres ({group.memberCount})</h3>
                <div className="space-y-3">
                    {members.slice(0, 8).map(member => (
                        <div key={member.id} onClick={() => navigateTo('profile', member.id)} className="flex items-center space-x-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-slate-100">
                            <img src={member.avatarUrl} alt={member.fullName} className="w-10 h-10 rounded-full"/>
                            <div>
                                <p className="font-semibold text-sm text-gray-700">{member.fullName}</p>
                                <p className="text-xs text-gray-500">@{member.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {members.length > 8 && (
                    <button className="w-full mt-4 py-2 text-sm text-sky-600 font-semibold hover:bg-sky-50 rounded-full">
                        Voir tous les membres
                    </button>
                )}
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;