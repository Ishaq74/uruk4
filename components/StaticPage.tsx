import React from 'react';
import { STATIC_PAGES_CONTENT } from '../constants';
import { Place } from '../types';

interface StaticPageProps {
  slug: string;
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string) => void;
}

const StaticPage: React.FC<StaticPageProps> = ({ slug, navigateTo }) => {
  const pageContent = STATIC_PAGES_CONTENT.find(p => p.slug === slug);

  if (!pageContent) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-800">Page non trouvée</h1>
        <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-full">
            Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-8">
            {pageContent.title}
          </h1>
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
