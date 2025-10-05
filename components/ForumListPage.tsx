import React from 'react';
import { FORUM_CATEGORIES } from '../constants';
import { ForumThread, Place, Profile } from '../types';
import Icon from './Icon';

interface ForumListPageProps {
  threads: ForumThread[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
  currentUser: Profile | null;
}

const CategoryRow: React.FC<{ category: any, navigateTo: (page: string, id: string) => void }> = ({ category, navigateTo }) => (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md">
        <div className="bg-slate-100 p-3 rounded-lg mt-1">
            <Icon name={category.icon} className="w-6 h-6 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('forum-category', category.id); }} className="font-bold text-lg text-gray-800 hover:text-sky-600 transition-colors truncate">{category.title}</a>
            <p className="text-sm text-gray-500">{category.description}</p>
        </div>
        <div className="hidden sm:flex flex-col text-center w-24">
            <span className="font-bold text-gray-800">{category.threadCount}</span>
            <span className="text-xs text-gray-500">Sujets</span>
        </div>
        <div className="hidden sm:flex flex-col text-center w-24">
            <span className="font-bold text-gray-800">{category.postCount}</span>
            <span className="text-xs text-gray-500">Messages</span>
        </div>
        <div className="hidden md:flex items-center space-x-3 w-64 min-w-0">
            {category.latestThread ? (
                <>
                    <img src={category.latestThread.authorAvatar} alt={category.latestThread.authorName} className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="min-w-0">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('forum-thread', category.latestThread.id)}} className="font-semibold text-sm text-gray-700 hover:underline truncate block">{category.latestThread.title}</a>
                        <p className="text-xs text-gray-500">par {category.latestThread.authorName}</p>
                    </div>
                </>
            ) : (
                <p className="text-sm text-gray-400">Aucun sujet</p>
            )}
        </div>
    </div>
);

const ForumListPage: React.FC<ForumListPageProps> = ({ threads, profiles, navigateTo, currentUser }) => {
    const categoriesWithData = FORUM_CATEGORIES.map(category => {
        const categoryThreads = threads.filter(t => t.categoryId === category.id);
        const postCount = categoryThreads.reduce((sum, t) => sum + t.posts.length, 0);
        const latestThreadData = categoryThreads.length > 0 ? [...categoryThreads].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null;
        const author = latestThreadData ? profiles.find(p => p.id === latestThreadData.authorId) : null;
        return {
            ...category,
            threadCount: categoryThreads.length,
            postCount: postCount,
            latestThread: latestThreadData && author ? {
                id: latestThreadData.id,
                title: latestThreadData.title,
                authorName: author.fullName,
                authorAvatar: author.avatarUrl,
            } : null,
        };
    });
    
  return (
    <div className="bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-12">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Forums</h1>
                <p className="mt-4 max-w-2xl text-xl text-gray-600">
                    L'espace de discussion de la communauté de Salut Annecy.
                </p>
            </div>
             <button
                onClick={() => navigateTo('new-thread')}
                disabled={!currentUser}
                className="mt-4 sm:mt-0 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-sm whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
                Créer un nouveau sujet
            </button>
        </div>

        <div className="space-y-4">
            {categoriesWithData.map(category => (
                <CategoryRow key={category.id} category={category} navigateTo={navigateTo} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ForumListPage;