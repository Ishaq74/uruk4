import React from 'react';
import { FORUM_CATEGORIES } from '../constants';
import { Place, Profile, ForumThread } from '../types';
import Icon from './Icon';

interface ForumCategoryPageProps {
  categoryId: string;
  threads: ForumThread[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  currentUser: Profile | null;
}

const ForumCategoryPage: React.FC<ForumCategoryPageProps> = ({ categoryId, threads: allThreads, profiles, navigateTo, currentUser }) => {
  const category = FORUM_CATEGORIES.find(c => c.id === categoryId);
  const threads = allThreads.filter(t => t.categoryId === categoryId);

  if (!category) {
    return <div className="text-center py-20">Catégorie de forum non trouvée.</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('forums'); }} className="text-sm text-sky-600 hover:underline">&larr; Retour à l'index des forums</a>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{category.title}</h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600">{category.description}</p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigateTo('new-thread', category.id)}
            disabled={!currentUser}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Créer un nouveau sujet
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="divide-y divide-gray-200">
            {threads.length > 0 ? threads.map(thread => {
              const author = profiles.find(p => p.id === thread.authorId);
              const lastPost = thread.posts[thread.posts.length - 1];
              const lastPostAuthor = profiles.find(p => p.id === lastPost.authorId);
              return (
                <div key={thread.id} className="p-4 flex items-center space-x-4 hover:bg-slate-50">
                  <div className="flex-shrink-0">
                    <Icon name="hash" className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('forum-thread', thread.id)}} className="text-base font-bold text-gray-800 hover:text-sky-600 truncate block">
                      {thread.title}
                    </a>
                    <p className="text-sm text-gray-500">
                      par <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('profile', author?.id || '')}} className="font-semibold hover:underline">{author?.fullName}</a>, {thread.createdAt}
                    </p>
                  </div>
                  <div className="hidden sm:block text-center w-24">
                    <p className="font-semibold">{thread.posts.length - 1}</p>
                    <p className="text-xs text-gray-500">Réponses</p>
                  </div>
                  <div className="hidden md:block text-sm text-gray-600 w-48 text-right">
                    <p className="font-semibold">
                      Dernier message par <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('profile', lastPostAuthor?.id || '')}} className="hover:underline">{lastPostAuthor?.fullName}</a>
                    </p>
                    <p className="text-xs text-gray-500">{lastPost.createdAt}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-gray-500">
                Il n'y a aucun sujet dans cette catégorie pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumCategoryPage;