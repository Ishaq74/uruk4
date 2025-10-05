import React from 'react';
import { Profile, Place, Conversation } from '../types';

interface ConversationsListPageProps {
  conversations: Conversation[];
  profiles: Profile[];
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const ConversationsListPage: React.FC<ConversationsListPageProps> = ({ conversations, profiles, currentUser, navigateTo }) => {
  if (!currentUser) {
    return <div className="text-center py-20">Veuillez vous connecter.</div>;
  }

  const userConversations = conversations.filter(c => c.participantIds.includes(currentUser.id));

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Ma Messagerie</h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600">
            Retrouvez ici toutes vos conversations privées.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg">
            <ul className="divide-y divide-gray-200">
                {userConversations.length > 0 ? userConversations.map(convo => {
                    const otherParticipantId = convo.participantIds.find(id => id !== currentUser.id);
                    const otherParticipant = profiles.find(p => p.id === otherParticipantId);
                    const lastMessage = convo.messages[convo.messages.length - 1];

                    if (!otherParticipant) return null;

                    return (
                         <li key={convo.id} onClick={() => navigateTo('conversation-detail', convo.id)} className="p-4 sm:p-6 hover:bg-slate-50 cursor-pointer transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <img className="h-12 w-12 rounded-full" src={otherParticipant.avatarUrl} alt={otherParticipant.fullName} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{otherParticipant.fullName}</p>
                                    <p className="text-sm text-gray-500 truncate">{lastMessage?.senderId === currentUser.id ? 'Vous: ' : ''}{lastMessage?.content || 'Aucun message'}</p>
                                </div>
                                <div className="text-xs text-gray-400 self-start">
                                    {lastMessage?.createdAt}
                                </div>
                            </div>
                        </li>
                    )
                }) : (
                     <div className="p-12 text-center text-gray-500">
                        Vous n'avez aucune conversation pour le moment.
                    </div>
                )}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default ConversationsListPage;