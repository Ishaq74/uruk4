import React, { useState, useEffect, useRef } from 'react';
import { Profile, Message, Place, Conversation } from '../types';
import Icon from './Icon';

interface ConversationDetailPageProps {
  id: string;
  conversations: Conversation[];
  profiles: Profile[];
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
  onSendMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
}

const ConversationDetailPage: React.FC<ConversationDetailPageProps> = ({ id, conversations, profiles, currentUser, navigateTo, onSendMessage }) => {
  if (!currentUser) {
    return <div className="text-center py-20">Veuillez vous connecter.</div>;
  }
  
  const conversation = conversations.find(c => c.id === id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);

  if (!conversation) {
    return <div className="text-center py-20">Conversation non trouvée.</div>;
  }
  
  const otherParticipantId = conversation.participantIds.find(pId => pId !== currentUser.id);
  const otherParticipant = profiles.find(p => p.id === otherParticipantId);
  
  if(!otherParticipant) {
     return <div className="text-center py-20">Participant non trouvé.</div>;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newMessage.trim()) return;

    const message: Omit<Message, 'id' | 'createdAt'> = {
        senderId: currentUser.id,
        content: newMessage.trim(),
    };
    onSendMessage(conversation.id, message);
    setNewMessage('');
  };


  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3 h-20">
                    <button onClick={() => navigateTo('conversations')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <Icon name="chevronDown" className="w-6 h-6 rotate-90 text-gray-500" />
                    </button>
                    <img src={otherParticipant.avatarUrl} alt={otherParticipant.fullName} className="w-10 h-10 rounded-full" />
                    <h1 className="font-bold text-lg text-gray-800">{otherParticipant.fullName}</h1>
                </div>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                {conversation.messages.map((msg) => {
                    const isCurrentUser = msg.senderId === currentUser.id;
                    const sender = isCurrentUser ? currentUser : otherParticipant;
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <img src={sender.avatarUrl} alt={sender.fullName} className="w-8 h-8 rounded-full" />
                            <div className={`p-3 rounded-2xl max-w-xs lg:max-w-md ${isCurrentUser ? 'bg-sky-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                                <p className="text-sm">{msg.content}</p>
                            </div>
                             <div className="text-xs text-gray-400 self-end px-1">{msg.createdAt}</div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrire un message..."
                        className="flex-1 h-12 px-4 rounded-full bg-slate-100 border-transparent focus:ring-2 focus:ring-sky-400 focus:outline-none"
                    />
                    <button type="submit" className="w-12 h-12 flex-shrink-0 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors disabled:bg-gray-300" disabled={!newMessage.trim()}>
                        <Icon name="trending-up" className="w-6 h-6 -rotate-45" />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ConversationDetailPage;