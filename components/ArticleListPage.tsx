import React from 'react';
import { Article, Place, Profile } from '../types';

interface ArticleListPageProps {
  articles: Article[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const ArticleCard: React.FC<{ article: Article; author: Profile | undefined; navigateTo: (page: string, id: string) => void }> = ({ article, author, navigateTo }) => {
    return (
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigateTo('article-detail', article.id); }} 
            className="group flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            <div className="h-56">
                <img className="h-full w-full object-cover" src={article.imageUrl} alt={article.title} />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div>
                    <h3 className="block mt-1 text-xl leading-tight font-bold text-black group-hover:text-sky-600 transition-colors">{article.title}</h3>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                        {author && (
                            <>
                                <img src={author.avatarUrl} alt={author.fullName} className="w-6 h-6 rounded-full" />
                                <span>Par {author.fullName}</span>
                            </>
                        )}
                        <span>&middot;</span>
                        <span>{article.publishedAt}</span>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
                </div>
                 <div className="mt-4 flex-grow flex items-end">
                    <span className="text-sm font-semibold text-sky-600 group-hover:text-sky-800 transition-colors">
                        Lire la suite &rarr;
                    </span>
                </div>
            </div>
        </a>
    )
};


const ArticleListPage: React.FC<ArticleListPageProps> = ({ articles, profiles, navigateTo }) => {
    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Le Magazine</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">Histoires, portraits et secrets d'Annecy, racontés par ceux qui y vivent.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map(item => {
                        const author = profiles.find(p => p.id === item.authorId);
                        return <ArticleCard key={item.id} article={item} author={author} navigateTo={navigateTo} />
                    })}
                </div>
                
                {/* A simple pagination placeholder */}
                <nav className="mt-12 flex items-center justify-center border-t border-gray-200 pt-8">
                     <a href="#" className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Précédent</a>
                     <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Suivant</a>
                </nav>
            </div>
        </div>
    );
};

export default ArticleListPage;