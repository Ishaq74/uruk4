import React from 'react';
import { Trail, TrailDifficulty, Place } from '../types';
import Icon from './Icon';

interface TrailDetailPageProps {
  id: string;
  trails: Trail[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const getDifficultyClass = (difficulty: TrailDifficulty) => {
    switch(difficulty) {
        case TrailDifficulty.Easy: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
        case TrailDifficulty.Medium: return 'bg-sky-100 text-sky-800 border-sky-300';
        case TrailDifficulty.Hard: return 'bg-amber-100 text-amber-800 border-amber-300';
        case TrailDifficulty.Expert: return 'bg-rose-100 text-rose-800 border-rose-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const StatCard: React.FC<{ icon: string, value: string, label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
        <div className="flex-shrink-0">
            <Icon name={icon} className="w-8 h-8 text-slate-500"/>
        </div>
        <div>
            <p className="text-xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);


const TrailDetailPage: React.FC<TrailDetailPageProps> = ({ id, trails, navigateTo }) => {
    const trail = trails.find(t => t.id === id);
    
    if (!trail) {
        return <div className="text-center py-20">Sentier non trouvé. <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home')}} className="text-sky-600">Retour à l'accueil</a></div>;
    }

    return (
        <div className="bg-white">
            {/* Header Image */}
            <div className="relative h-96">
                <img src={trail.imageUrl} alt={trail.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <div className={`inline-block mb-2 px-3 py-1 text-sm font-bold rounded-full border-2 ${getDifficultyClass(trail.difficulty)}`}>
                        Difficulté : {trail.difficulty}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">{trail.name}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                     {/* --- Left Column --- */}
                    <div className="lg:col-span-2">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            <StatCard icon="hiking" value={`${trail.distanceKm} km`} label="Distance"/>
                            <StatCard icon="clock" value={`${Math.floor(trail.durationMin/60)}h${trail.durationMin%60}`} label="Durée"/>
                            <StatCard icon="trending-up" value={`${trail.ascentM} m`} label="Dénivelé +"/>
                        </div>

                        {/* Description */}
                        <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: trail.description }}
                        />
                    </div>
                     {/* --- Right Column (Sidebar) --- */}
                    <aside className="lg:col-span-1 mt-12 lg:mt-0">
                        <div className="sticky top-24 space-y-8">
                             {/* Map */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                                <h3 className="text-lg font-bold text-gray-800 p-4 border-b">Point de départ</h3>
                                <img 
                                    src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s-hiker+285A98(${trail.startPoint.lng},${trail.startPoint.lat})/${trail.startPoint.lng},${trail.startPoint.lat},13,0/400x300?access_token=pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTd2ZzUwMDk1bHNrdDR2d3p3bmVoIn0.p-b4-dlBS_G87-O3T5M0gQ`}
                                    alt={`Carte pour ${trail.name}`}
                                    className="w-full h-56 object-cover" 
                                />
                                <div className="p-4 bg-slate-50">
                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${trail.startPoint.lat},${trail.startPoint.lng}`} target="_blank" rel="noopener noreferrer" className="mt-1 block text-center w-full bg-slate-200 text-slate-800 font-semibold py-2 rounded-lg hover:bg-slate-300 transition-colors">
                                        S'y rendre
                                    </a>
                                </div>
                            </div>
                            {/* GPX Download */}
                             <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Tracé GPX</h3>
                                <p className="text-sm text-gray-600 mb-4">Téléchargez le fichier GPX pour suivre le parcours sur votre appareil GPS ou votre application de randonnée.</p>
                                <button className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                                    <Icon name="download" className="w-5 h-5"/>
                                    <span>Télécharger le GPX</span>
                                </button>
                             </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TrailDetailPage;