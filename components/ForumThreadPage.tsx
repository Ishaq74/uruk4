import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { USER_LEVELS, FORUM_CATEGORIES } from '../constants';
import { ForumPost, Profile, Place, ForumThread } from '../types';
import Icon from './Icon';

interface ForumThreadPageProps {
  id: string;
  threads: ForumThread[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string) => void;
  currentUser: Profile | null;
  addPost: (threadId: string, post: Omit<ForumPost, 'id' | 'createdAt' | 'threadId'>) => void;
  onOpenReportModal: (targetId: string, targetType: string) => void;
}

const PostCard: React.FC<{ post: ForumPost, profiles: Profile[], isOP: boolean, navigateTo: (page: string, id: string) => void, onOpenReportModal: (targetId: string, targetType: string) => void, onQuote: (author: string, content: string) => void }> = ({ post, profiles, isOP, navigateTo, onOpenReportModal, onQuote }) => {
    const author = profiles.find(p => p.id === post.authorId);
    if (!author) return null;
    const authorLevel = USER_LEVELS.find(l => l.id === author.levelId);

    return (
        <div className={`flex space-x-4 ${isOP ? 'bg-white p-6 rounded-xl shadow-sm' : 'p-4'}`}>
            <div className="flex flex-col items-center flex-shrink-0 w-24">
                <img 
                    src={author.avatarUrl} 
                    alt={author.fullName} 
                    className="w-16 h-16 rounded-full cursor-pointer" 
                    onClick={() => navigateTo('profile', author.id)}
                />
                <a 
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigateTo('profile', author.id); }}
                    className="mt-2 font-bold text-sm text-center text-gray-800 hover:text-sky-600"
                >
                    {author.fullName}
                </a>
                <span className="text-xs text-gray-500">{authorLevel?.name}</span>
            </div>
            <div className={`w-full ${!isOP ? 'border-t pt-4 sm:border-t-0 sm:border-l sm:pl-4' : ''}`}>
                <p className="text-xs text-gray-500">{post.createdAt}</p>
                <div className="mt-2 prose max-w-none text-gray-700 prose-blockquote:bg-sky-50 prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:text-sky-900 prose-blockquote:p-4 prose-blockquote:rounded-lg prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-base">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                    <button onClick={() => onQuote(author.fullName, post.content)} className="flex items-center space-x-1 text-xs text-gray-500 hover:text-sky-600">
                        <Icon name="message-circle" className="w-4 h-4" />
                        <span>Citer</span>
                    </button>
                    <button onClick={() => onOpenReportModal(post.id, 'Forum Post')} className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600">
                         <Icon name="alert-triangle" className="w-4 h-4" />
                        <span>Signaler</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ForumThreadPage: React.FC<ForumThreadPageProps> = ({ id, threads, profiles, navigateTo, currentUser, addPost, onOpenReportModal }) => {
    const thread = threads.find(t => t.id === id);
    const [replyContent, setReplyContent] = useState('');
    const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

    if (!thread) {
        return <div className="text-center py-20">Sujet non trouvé.</div>;
    }
    
    const category = FORUM_CATEGORIES.find(c => c.id === thread.categoryId);
    const [op, ...replies] = thread.posts;
    
    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentUser || !replyContent.trim()) return;
        
        const newPost: Omit<ForumPost, 'id' | 'createdAt' | 'threadId'> = {
            authorId: currentUser.id,
            content: replyContent,
        };
        addPost(thread.id, newPost);
        setReplyContent('');
    };
    
    const handleQuote = (authorName: string, content: string) => {
        const quoteText = `> **${authorName} a écrit:**\n> ${content.split('\n').join('\n> ')}\n\n`;
        setReplyContent(prev => prev + quoteText);
        
        if (replyTextareaRef.current) {
            replyTextareaRef.current.focus();
            replyTextareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                     <nav className="text-sm font-medium" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">
                                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('forums'); }} className="text-sky-600 hover:underline">Forums</a>
                            </li>
                            {category && (
                                <li className="flex items-center">
                                    <Icon name="chevronDown" className="w-5 h-5 -rotate-90 text-gray-400" />
                                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('forum-category', category.id); }} className="text-sky-600 hover:underline">{category.title}</a>
                                </li>
                            )}
                        </ol>
                    </nav>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">{thread.title}</h1>
                </div>

                <div className="space-y-6">
                    <PostCard post={op} profiles={profiles} isOP={true} navigateTo={navigateTo} onOpenReportModal={onOpenReportModal} onQuote={handleQuote} />
                    
                    {replies.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{replies.length} réponse(s)</h2>
                             {replies.map(reply => (
                                <PostCard key={reply.id} post={reply} profiles={profiles} isOP={false} navigateTo={navigateTo} onOpenReportModal={onOpenReportModal} onQuote={handleQuote} />
                            ))}
                        </div>
                    )}

                    {currentUser && (
                        <form onSubmit={handleReplySubmit} className="bg-white p-6 rounded-xl shadow-sm">
                             <h3 className="text-lg font-bold mb-4">Répondre au sujet</h3>
                             <textarea 
                                ref={replyTextareaRef}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Votre message..."
                                className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none transition-shadow"
                             />
                             <div className="mt-4 text-right">
                                 <button 
                                    type="submit"
                                    disabled={!replyContent.trim()}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
                                    Publier la réponse
                                </button>
                             </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumThreadPage;