import React, { useState, useEffect } from 'react';
import { USER_LEVELS } from '../constants';
import Icon from './Icon';
import StarRating from './StarRating';
import { Review, Place, Profile, Comment, Article } from '../types';

interface ProfilePageProps {
  id: string;
  slug?: string;
  profiles: Profile[];
  places: Place[];
  articles: Article[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  currentUser: Profile | null;
  onStartConversation: (recipientId: string) => void;
}

const ProfileContributionItem: React.FC<{ item: Review | Comment; type: 'review' | 'comment'; places: Place[]; articles: Article[]; navigateTo: (page: string, id?: string) => void; }> = ({ item, type, places, articles, navigateTo }) => {
    if (type === 'review') {
        const review = item as Review;
        const place = places.find(p => p.id === review.placeId);
        if (!place) return null;
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm flex space-x-4">
                <img 
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-20 h-20 rounded-md object-cover cursor-pointer"
                    onClick={() => navigateTo('place-detail', place.id)}
                />
                <div className="flex-1">
                    <p className="text-xs text-gray-400">Avis sur</p>
                    <h4 
                        className="font-bold text-gray-800 hover:underline cursor-pointer"
                        onClick={() => navigateTo('place-detail', place.id)}
                    >
                        {place.name}
                    </h4>
                    <div className="flex items-center my-1">
                        <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                    <p className="text-xs text-gray-400 mt-2 text-right">{review.date}</p>
                </div>
            </div>
        );
    }

    if (type === 'comment') {
        const comment = item as Comment;
        const article = articles.find(a => a.id === comment.target_entity_id);
        if(!article) return null;
        return (
             <div className="bg-white p-4 rounded-lg shadow-sm flex space-x-4">
                <img 
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-20 h-20 rounded-md object-cover cursor-pointer"
                    onClick={() => navigateTo('article-detail', article.id)}
                />
                <div className="flex-1">
                    <p className="text-xs text-gray-400">Commentaire sur</p>
                    <h4 
                        className="font-bold text-gray-800 hover:underline cursor-pointer"
                        onClick={() => navigateTo('article-detail', article.id)}
                    >
                        {article.title}
                    </h4>
                    <p className="text-sm text-gray-600 italic mt-2">"{comment.content}"</p>
                    <p className="text-xs text-gray-400 mt-2 text-right">{comment.createdAt}</p>
                </div>
            </div>
        )
    }
    
    return null;
};

const GamificationSection: React.FC<{ profile: Profile }> = ({ profile }) => {
    const currentLevel = USER_LEVELS.find(l => l.id === profile.levelId);
    const nextLevel = USER_LEVELS.find(l => l.id === profile.levelId + 1);

    if (!currentLevel) return null;

    const pointsInLevel = profile.points - currentLevel.min_points;
    const pointsForNextLevel = nextLevel ? nextLevel.min_points - currentLevel.min_points : pointsInLevel;
    const progressPercentage = nextLevel ? (pointsInLevel / pointsForNextLevel) * 100 : 100;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Niveau & Progression</h3>
            <div className="text-center">
                <span className="text-amber-500 font-bold text-xl">{currentLevel.name}</span>
                <p className="text-sm text-gray-500">{profile.points} points</p>
            </div>
            {nextLevel && (
                <div className="mt-4">
                    <div className="h-2 w-full bg-slate-200 rounded-full">
                        <div style={{ width: `${progressPercentage}%`}} className="h-2 bg-amber-400 rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        {nextLevel.min_points - profile.points} points restants pour atteindre le niveau <span className="font-semibold">{nextLevel.name}</span>.
                    </p>
                </div>
            )}
        </div>
    )
}

const ProfilePage: React.FC<ProfilePageProps> = ({ id, slug, profiles, places, articles, navigateTo, currentUser, onStartConversation }) => {
    const profile = profiles.find(p => p.id === id);
    
    const [activeTab, setActiveTab] = useState<'contributions' | 'activity'>(slug === 'contributions' ? 'contributions' : 'activity');
    
    useEffect(() => {
        if(slug === 'contributions') {
            setActiveTab('contributions');
        }
    }, [slug]);

    if (!profile) {
        return <div className="text-center py-20">Profil non trouvé. <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home')}} className="text-sky-600">Retour à l'accueil</a></div>;
    }
    
    const userReviews = places.flatMap(p => p.reviews).filter(r => r.profileId === profile.id);
    const userComments: Comment[] = articles.flatMap(a => a.comments).filter(c => c.authorId === profile.id);
    const allContributions = [...userReviews, ...userComments].sort((a,b) => 0); // Simplified sort

    const TabButton: React.FC<{tabId: 'contributions' | 'activity', icon: string, label: string}> = ({ tabId, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeTab === tabId
                ? 'bg-sky-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            <Icon name={icon} className="w-5 h-5"/>
            <span>{label}</span>
        </button>
    );
    
    const isOwnProfile = currentUser?.id === profile.id;

    return (
        <div className="bg-slate-100">
            {/* --- Profile Header --- */}
            <div className="relative h-56 md:h-72">
                <img src={profile.coverImageUrl} alt={`Photo de couverture de ${profile.fullName}`} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-16 md:-mt-24 flex flex-col md:flex-row md:items-end md:space-x-6">
                   <img src={profile.avatarUrl} alt={`Avatar de ${profile.fullName}`} className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-slate-100 object-cover shadow-lg"/>
                   <div className="mt-4 md:mb-6 flex-grow">
                        <div className="flex items-center space-x-2">
                           <h1 className="text-2xl md:text-4xl font-bold text-gray-900">{profile.fullName}</h1>
                           {profile.isVerified && <Icon name="award" className="w-6 h-6 text-blue-500" />}
                        </div>
                        <p className="text-sm md:text-base text-gray-500">@{profile.username}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Icon name="award" className="w-4 h-4 text-amber-500"/>
                                <span>{USER_LEVELS.find(l => l.id === profile.levelId)?.name || ''}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Icon name="calendar" className="w-4 h-4 text-sky-500"/>
                                <span>Membre depuis {profile.joinDate}</span>
                            </div>
                        </div>
                   </div>
                   <div className="mt-4 md:mb-6">
                        {!isOwnProfile && currentUser && (
                             <button 
                                onClick={() => onStartConversation(profile.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                <Icon name="message-square" className="w-5 h-5"/>
                                <span>Envoyer un message</span>
                            </button>
                        )}
                   </div>
                </div>

                 <div className="lg:grid lg:grid-cols-3 lg:gap-8 mt-8">
                    <div className="lg:col-span-2">
                         <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">À propos</h3>
                            <p className="text-gray-700">{profile.bio}</p>
                        </div>
                    </div>
                    <div className="mt-8 lg:mt-0">
                        <GamificationSection profile={profile} />
                    </div>
                 </div>


                 {/* --- Tabs --- */}
                <div className="mt-8 border-b border-gray-200">
                    <nav className="flex space-x-2" aria-label="Tabs">
                        <TabButton tabId="contributions" icon="star" label={`Contributions (${allContributions.length})`}/>
                        <TabButton tabId="activity" icon="activity" label="Activité"/>
                    </nav>
                </div>
                
                {/* --- Tab Content --- */}
                <div className="py-8">
                    {activeTab === 'contributions' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contributions de {profile.fullName}</h2>
                            {allContributions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {allContributions.map((item, index) => (
                                        <ProfileContributionItem 
                                            key={item.id || `item-${index}`} 
                                            item={item} 
                                            type={'rating' in item ? 'review' : 'comment'} 
                                            places={places}
                                            articles={articles}
                                            navigateTo={navigateTo} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                    <p className="text-gray-500">{profile.fullName} n'a pas encore contribué.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'activity' && (
                         <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500">Le fil d'activité sera bientôt disponible !</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;