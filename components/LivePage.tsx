import React, { useState, useMemo, useEffect } from 'react';
import { LIVE_EVENTS, PROFILES, LIVE_EVENT_ICONS } from '../constants';
import { LiveEvent, LiveEventType, Profile, Place } from '../types';
import Icon from './Icon';
import InteractiveMap from './InteractiveMap';

// --- PROPS ---
interface LivePageProps {
  liveEvents: LiveEvent[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
  currentUser: Profile | null;
  onAddEvent: (event: Omit<LiveEvent, 'id' | 'createdAt' | 'expiresAt' | 'upvotes' | 'downvotes'>) => void;
  onVote: (eventId: string, voteType: 'up' | 'down') => void;
  onLogin: () => void;
}

// --- SUB-COMPONENTS ---
const AddEventModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { type: LiveEventType; title: string; location: string; }) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [type, setType] = useState<LiveEventType>(LiveEventType.Info);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');

    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !location.trim()) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
        onSubmit({ type, title, location });
        onClose();
        setTitle('');
        setLocation('');
        setType(LiveEventType.Info);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="p-6 border-b text-xl font-bold">Signaler un événement</h2>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Type</label>
                        <select value={type} onChange={e => setType(e.target.value as LiveEventType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-sky-500 focus:border-sky-500">
                            {Object.values(LiveEventType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Titre (court et descriptif)</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Grosse affluence au pont des amours" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Lieu (précis)</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Rue Carnot, près de la Fnac" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700">Signaler</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TimeBadge: React.FC<{ createdAt: string, expiresAt: string }> = ({ createdAt, expiresAt }) => {
    const [[timeLeft, progress, color], setTimeInfo] = useState<[string, number, string]>(['', 0, 'bg-emerald-500']);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const start = new Date(createdAt);
            const expiry = new Date(expiresAt);
            const totalDuration = (expiry.getTime() - start.getTime()) / 1000;
            const secondsLeft = (expiry.getTime() - now.getTime()) / 1000;

            if (secondsLeft <= 0) {
                setTimeInfo(['Expiré', 0, 'bg-rose-500']);
                return;
            }

            const currentProgress = Math.max(0, (secondsLeft / totalDuration) * 100);
            
            const hours = Math.floor(secondsLeft / 3600);
            const minutes = Math.floor((secondsLeft % 3600) / 60);

            let timeString = '';
            if (hours > 0) timeString += `${hours}h `;
            if (minutes > 0) timeString += `${minutes}m`;
            if (timeString === '') timeString = '< 1m';

            let progressColor = 'bg-emerald-500';
            if (currentProgress < 50) progressColor = 'bg-amber-500';
            if (currentProgress < 20) progressColor = 'bg-rose-500';
            
            setTimeInfo([`Expire dans ${timeString}`, currentProgress, progressColor]);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 10000); // update every 10s
        return () => clearInterval(interval);
    }, [createdAt, expiresAt]);

    return (
        <div className="absolute bottom-0 left-0 right-0 h-1.5">
            <div className={`h-full rounded-b-xl ${color}`} style={{ width: `${progress}%`, transition: 'width 0.5s linear' }} title={timeLeft}></div>
        </div>
    );
};


const LiveEventCard: React.FC<{
    event: LiveEvent;
    profiles: Profile[];
    currentUser: Profile | null;
    onVote: (eventId: string, voteType: 'up' | 'down') => void;
    isSelected: boolean;
    onSelect: (id: string | null) => void;
}> = ({ event, profiles, currentUser, onVote, isSelected, onSelect }) => {
    const author = profiles.find(p => p.id === event.authorId);
    const { icon, color } = LIVE_EVENT_ICONS[event.type];
    const voteCount = event.upvotes.length - event.downvotes.length;
    const userVote = currentUser ? (event.upvotes.includes(currentUser.id) ? 'up' : (event.downvotes.includes(currentUser.id) ? 'down' : null)) : null;

    const timeAgo = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        if(seconds < 60) return "à l'instant";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `il y a ${minutes}m`;
        const hours = Math.floor(minutes / 60);
        return `il y a ${hours}h`;
    };

    return (
        <div 
            className={`bg-white rounded-xl shadow-sm p-4 flex space-x-4 transition-all duration-200 border-2 relative overflow-hidden ${isSelected ? 'border-sky-500 ring-2 ring-sky-500' : 'border-transparent'}`}
            onMouseEnter={() => onSelect(event.id)}
            onMouseLeave={() => onSelect(null)}
        >
            <div className="flex flex-col items-center space-y-1 z-10">
                <button onClick={() => currentUser && onVote(event.id, 'up')} disabled={!currentUser} className={`p-1 rounded-full ${userVote === 'up' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:bg-gray-100'}`}><Icon name="arrow-up" className="w-5 h-5"/></button>
                <span className="font-bold text-lg">{voteCount}</span>
                <button onClick={() => currentUser && onVote(event.id, 'down')} disabled={!currentUser} className={`p-1 rounded-full ${userVote === 'down' ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:bg-gray-100'}`}><Icon name="arrow-down" className="w-5 h-5"/></button>
            </div>
            <div className="flex-1 z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                        <Icon name={icon} className={`w-5 h-5 ${color}`} />
                        <span className={`text-sm font-bold ${color}`}>{event.type}</span>
                    </div>
                     <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <img src={author?.avatarUrl} className="w-5 h-5 rounded-full" />
                        <span>par <b>{author?.fullName}</b></span>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mt-1">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.location}</p>
                 <p className="text-xs text-gray-400 mt-2">{timeAgo(event.createdAt)}</p>
            </div>
            <TimeBadge createdAt={event.createdAt} expiresAt={event.expiresAt} />
        </div>
    );
}

// --- MAIN COMPONENT ---
const LivePage: React.FC<LivePageProps> = ({ liveEvents: allLiveEvents, profiles, navigateTo, currentUser, onAddEvent, onVote, onLogin }) => {
    const [filters, setFilters] = useState<LiveEventType[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    
    // For mobile view toggle
    const [isMobileMapVisible, setIsMobileMapVisible] = useState(false);
    
    const now = new Date().toISOString();
    const liveEvents = useMemo(() => {
        let events = allLiveEvents.filter(e => e.expiresAt > now);
        if (filters.length > 0) {
            events = events.filter(e => filters.includes(e.type));
        }
        return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [filters, allLiveEvents]);

    const handleFilterChange = (type: LiveEventType) => {
        setFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };
    
    const handleAddEventSubmit = (data: { type: LiveEventType; title: string; location: string; }) => {
        if (!currentUser) return;
        onAddEvent({
            ...data,
            authorId: currentUser.id,
            coordinates: { lat: 45.899 + (Math.random() - 0.5) * 0.02, lng: 6.129 + (Math.random() - 0.5) * 0.02 },
        });
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    return (
        <div className="bg-slate-100">
            <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddEventSubmit} />
            
            {showSuccessToast && (
                <div className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
                    Signalement ajouté avec succès !
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">En Direct</h1>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600">Le pouls de la ville en temps réel grâce à la communauté.</p>
                    </div>
                     <button onClick={() => currentUser ? setIsModalOpen(true) : onLogin()} className="mt-4 sm:mt-0 flex items-center space-x-2 px-5 py-3 text-sm font-semibold text-white bg-rose-500 rounded-full hover:bg-rose-600 shadow-sm"><Icon name="alert-triangle" className="w-5 h-5" /><span>Signaler un événement</span></button>
                </div>

                <div className="lg:grid lg:grid-cols-5 lg:gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                             <h3 className="text-lg font-semibold text-gray-900 mb-2">Filtres</h3>
                             <div className="flex flex-wrap gap-2">
                                {Object.values(LiveEventType).map(type => (
                                    <button key={type} onClick={() => handleFilterChange(type)} className={`px-3 py-1 text-sm font-semibold rounded-full border-2 ${filters.includes(type) ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile View Toggle */}
                        <div className="lg:hidden flex justify-center mb-4">
                            <div className="inline-flex rounded-md shadow-sm">
                                <button onClick={() => setIsMobileMapVisible(false)} className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${!isMobileMapVisible ? 'bg-sky-600 text-white border-sky-600 z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Liste</button>
                                <button onClick={() => setIsMobileMapVisible(true)} className={`-ml-px px-4 py-2 text-sm font-medium rounded-r-lg border ${isMobileMapVisible ? 'bg-sky-600 text-white border-sky-600 z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Carte</button>
                            </div>
                        </div>
                        
                        <div className={`space-y-4 lg:block ${isMobileMapVisible ? 'hidden' : ''}`}>
                             {liveEvents.length > 0 ? (
                                liveEvents.map(event => <LiveEventCard key={event.id} event={event} profiles={profiles} currentUser={currentUser} onVote={onVote} isSelected={selectedEventId === event.id} onSelect={setSelectedEventId} />)
                             ) : (
                                <div className="text-center py-16 bg-white rounded-xl"><p className="text-gray-500">Aucun événement en direct pour le moment.</p></div>
                             )}
                        </div>
                    </div>

                    <div className={`lg:col-span-3 lg:block ${!isMobileMapVisible ? 'hidden' : ''}`}>
                        <div className="sticky top-24 h-[calc(100vh-8rem)]">
                            <InteractiveMap items={liveEvents} selectedItemId={selectedEventId} onMarkerClick={setSelectedEventId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LivePage;