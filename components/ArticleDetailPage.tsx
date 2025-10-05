import React, { useState, useEffect } from 'react';
import { Article, Place, Profile, Comment } from '../types';
import Icon from './Icon';

interface ArticleDetailPageProps {
  id: string;
  articles: Article[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  currentUser: Profile | null;
  onAddComment: (articleId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'target_entity_id'>) => void;
  onLogin: () => void;
  onOpenReportModal: (targetId: string, targetType: string) => void;
}

const CommentItem: React.FC<{ comment: Comment; profiles: Profile[], navigateTo: (page: string, id: string) => void, onOpenReportModal: (targetId: string, targetType: string) => void }> = ({ comment, profiles, navigateTo, onOpenReportModal }) => {
    const author = profiles.find(p => p.id === comment.authorId);
    if (!author) return null;

    return (
        <div className="flex space-x-4 py-4 border-b border-gray-200 last:border-b-0">
            <img 
                className="h-10 w-10 rounded-full cursor-pointer" 
                src={author.avatarUrl} 
                alt={author.fullName} 
                onClick={() => navigateTo('profile', author.id)}
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h4 
                        className="text-sm font-bold text-gray-900 cursor-pointer hover:underline"
                        onClick={() => navigateTo('profile', author.id)}
                    >
                        {author.fullName}
                    </h4>
                    <p className="text-xs text-gray-500">{comment.createdAt}</p>
                </div>
                <p className="mt-2 text-gray-600 text-sm">{comment.content}</p>
                <div className="mt-2 text-right">
                    <button onClick={() => onOpenReportModal(comment.id, 'Comment')} className="text-xs text-gray-400 hover:text-red-600">
                        Signaler
                    </button>
                </div>
            </div>
        </div>
    );
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ id, articles, profiles, navigateTo, currentUser, onAddComment, onLogin, onOpenReportModal }) => {
    const article = articles.find(a => a.id === id);
    const [commentContent, setCommentContent] = useState('');
    
    if (!article) {
        return <div className="text-center py-20">Article non trouvé. <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home')}} className="text-sky-600">Retour à l'accueil</a></div>;
    }
    
    const author = profiles.find(p => p.id === article.authorId);
    const similarArticles = articles.filter(a => a.id !== article.id).slice(0, 2);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !commentContent.trim()) return;
        const newComment: Omit<Comment, 'id' | 'createdAt' | 'target_entity_id'> = {
            authorId: currentUser.id,
            content: commentContent,
        };
        onAddComment(article.id, newComment);
        setCommentContent('');
    }

    return (
        <div className="bg-white">
            <div className="relative h-96">
                <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="container mx-auto -mt-24 relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-t-xl shadow-xl p-6 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{article.title}</h1>
                    <div className="mt-6 flex items-center space-x-4">
                        {author && (
                            <div 
                                className="flex items-center space-x-3 cursor-pointer" 
                                onClick={() => navigateTo('profile', author.id)}
                            >
                                <img src={author.avatarUrl} alt={author.fullName} className="w-12 h-12 rounded-full"/>
                                <div>
                                    <p className="font-bold text-gray-800 hover:text-sky-600">{author.fullName}</p>
                                    <p className="text-sm text-gray-500">{article.publishedAt}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Article Content */}
                    <div
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Comment Section */}
                    <div className="mt-16 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{article.comments.length} Commentaire(s)</h2>
                         <div className="bg-white rounded-lg ">
                            {article.comments.map(comment => <CommentItem key={comment.id} comment={comment} profiles={profiles} navigateTo={navigateTo} onOpenReportModal={onOpenReportModal} />)}
                         </div>

                         {currentUser ? (
                             <form onSubmit={handleCommentSubmit} className="mt-6">
                                 <textarea
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    placeholder="Ajouter un commentaire..."
                                    className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
                                    rows={3}
                                 />
                                 <div className="mt-2 text-right">
                                     <button type="submit" disabled={!commentContent.trim()} className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 disabled:bg-gray-300">
                                        Commenter
                                     </button>
                                 </div>
                             </form>
                         ) : (
                             <div className="mt-6 text-center border p-6 rounded-lg bg-slate-50">
                                <p className="text-gray-600">Vous devez être connecté pour commenter.</p>
                                <button onClick={onLogin} className="mt-2 text-sm font-semibold text-sky-600 hover:underline">Se connecter</button>
                            </div>
                         )}
                    </div>

                    {/* Similar Articles */}
                    <div className="mt-16 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">À lire aussi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {similarArticles.map(item => (
                                <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); navigateTo('article-detail', item.id); }} className="group block">
                                    <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover rounded-lg shadow-md" />
                                    <h3 className="mt-4 font-bold text-lg text-gray-900 group-hover:text-sky-600">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{item.excerpt.substring(0, 80)}...</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ArticleDetailPage;