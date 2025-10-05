import React from 'react';
import { Profile, Place } from '../types';
import Icon from './Icon';

interface MemberListPageProps {
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const MemberCard: React.FC<{ profile: Profile; navigateTo: (page: string, id: string) => void }> = ({ profile, navigateTo }) => {
    return (
        <div 
            onClick={() => navigateTo('profile', profile.id)}
            className="group bg-white rounded-xl shadow-sm border hover:border-sky-500 hover:shadow-lg transition-all duration-300 cursor-pointer text-center p-6"
        >
            <div className="relative inline-block">
                <img src={profile.avatarUrl} alt={profile.fullName} className="w-24 h-24 rounded-full mx-auto" />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
                    <Icon name="award" className="w-5 h-5 text-amber-500" />
                </div>
            </div>
            <h3 className="mt-4 font-bold text-lg text-gray-800 group-hover:text-sky-600">{profile.fullName}</h3>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            <p className="mt-1 text-xs text-gray-400">Membre depuis {profile.joinDate}</p>
        </div>
    )
};


const MemberListPage: React.FC<MemberListPageProps> = ({ profiles, navigateTo }) => {
  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Membres</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                Découvrez la communauté qui fait vivre Salut Annecy.
            </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {profiles.map(profile => (
                <MemberCard key={profile.id} profile={profile} navigateTo={navigateTo} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MemberListPage;