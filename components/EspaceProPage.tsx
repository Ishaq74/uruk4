import React from 'react';
import { Profile, Place, Organization, PlaceClaim, ContentStatus } from '../types';
import Icon from './Icon';
import { ORGANIZATIONS, PLACES, CLAIMS } from '../constants';

interface EspaceProPageProps {
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
}

const getStatusBadge = (status?: ContentStatus) => {
    switch(status) {
        case 'published': return <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Publié</span>;
        case 'pending_review': return <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">En attente</span>;
        case 'rejected': return <span className="text-xs font-medium bg-rose-100 text-rose-800 px-2 py-1 rounded-full">Rejeté</span>;
        default: return <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Brouillon</span>;
    }
}

const PlaceRow: React.FC<{ place: Place, navigateTo: (page: string, id: string) => void }> = ({ place, navigateTo }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
            <img src={place.imageUrl} alt={place.name} className="w-16 h-16 rounded-md object-cover"/>
            <div>
                <h4 className="font-bold text-gray-800">{place.name}</h4>
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">{place.category}</p>
                    {getStatusBadge(place.status)}
                </div>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={() => navigateTo('manage-place', place.id)} className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-100 rounded-full hover:bg-sky-200">
                Modifier
            </button>
            <button onClick={() => navigateTo('place-analytics', place.id)} className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200">
                Statistiques
            </button>
        </div>
    </div>
);

const ClaimRow: React.FC<{ claim: PlaceClaim, places: Place[] }> = ({ claim, places }) => {
    const place = places.find(p => p.id === claim.placeId);
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-800';
            case 'pending': return 'bg-amber-100 text-amber-800';
            case 'rejected': return 'bg-rose-100 text-rose-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-700">Demande pour <span className="font-bold">{place?.name || 'Lieu inconnu'}</span></p>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(claim.status)}`}>
                {claim.status}
            </span>
        </div>
    )
}

const ProDashboardCard: React.FC<{icon: string, title: string, onClick: () => void}> = ({ icon, title, onClick }) => (
    <div onClick={onClick} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer flex items-center space-x-3 transition-shadow">
        <Icon name={icon} className="w-6 h-6 text-gray-500"/>
        <span className="font-semibold text-gray-700">{title}</span>
    </div>
);

const EspaceProDashboard: React.FC<{ org: Organization; places: Place[], userClaims: PlaceClaim[], navigateTo: (page: string, id?: string) => void }> = ({ org, places, userClaims, navigateTo }) => {
    const orgPlaces = places.filter(p => p.organization_id === org.id);
    
    return (
    <div>
        <div className="mb-8 p-6 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl text-white shadow-lg">
            <h2 className="text-3xl font-bold tracking-tight">Espace Pro: {org.name}</h2>
            <p className="mt-2 text-lg opacity-90">Gérez vos pages, produits, services et suivez vos performances.</p>
            <div className="mt-2 text-sm font-semibold uppercase bg-white/20 px-2 py-1 rounded-full inline-block">{org.subscription_tier} Plan</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ProDashboardCard icon="shopping-bag" title="Gérer les produits" onClick={() => navigateTo('manage-products', org.id)} />
            <ProDashboardCard icon="sparkles" title="Gérer les services" onClick={() => navigateTo('manage-services', org.id)} />
            <ProDashboardCard icon="tag" title="Commandes" onClick={() => navigateTo('pro-orders', org.id)} />
            <ProDashboardCard icon="calendar" title="Réservations" onClick={() => navigateTo('pro-bookings', org.id)} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <h3 className="text-2xl font-bold text-gray-800">Mes Établissements</h3>
                 {orgPlaces.length > 0 ? (
                     orgPlaces.map(place => <PlaceRow key={place.id} place={place} navigateTo={navigateTo} />)
                 ) : (
                     <p className="text-gray-500">Vous n'avez aucun établissement.</p>
                 )}
            </div>
             <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Mes Revendications</h3>
                 {userClaims.length > 0 ? (
                     userClaims.map(claim => <ClaimRow key={claim.id} claim={claim} places={places} />)
                 ) : (
                     <p className="text-gray-500 text-sm">Aucune demande en cours.</p>
                 )}
                 <button onClick={() => navigateTo('claim-place')} className="w-full mt-4 px-4 py-3 bg-white text-sky-600 font-semibold rounded-lg border-2 border-sky-600 hover:bg-sky-50 transition-colors">
                     Revendiquer un autre établissement
                </button>
            </div>
        </div>

    </div>
    );
};

const EspaceProPage: React.FC<EspaceProPageProps> = ({ currentUser, navigateTo }) => {

    if (!currentUser) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-gray-800">Accès non autorisé</h1>
                <p className="text-gray-600 mt-2">Vous devez être connecté pour accéder à l'espace professionnel.</p>
                <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-full">
                    Retour à l'accueil
                </button>
            </div>
        );
    }
    
    const userOrganization = ORGANIZATIONS.find(org => org.primary_owner_id === currentUser.id);
    const userClaims = CLAIMS.filter(c => c.userId === currentUser.id);

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {userOrganization ? (
                    <EspaceProDashboard org={userOrganization} places={PLACES} userClaims={userClaims} navigateTo={navigateTo} />
                ) : (
                    <div className="text-center max-w-2xl mx-auto">
                         <Icon name="building-office" className="w-16 h-16 text-sky-500 mx-auto" />
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Bienvenue dans l'Espace Pro</h1>
                        <p className="mt-6 text-xl text-gray-600">
                            Vous ne semblez pas encore avoir d'organisation enregistrée. L'espace Pro vous permet de gérer vos établissements, de répondre aux avis, et bien plus encore.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                             <button
                                onClick={() => navigateTo('claim-place')}
                                className="px-8 py-4 text-base font-semibold text-white bg-sky-600 rounded-full hover:bg-sky-700 transition-all duration-300 shadow-lg"
                            >
                                Revendiquer mon Établissement
                            </button>
                            <button
                                disabled
                                className="px-8 py-4 text-base font-semibold text-gray-700 bg-white rounded-full border border-gray-300 shadow-sm disabled:opacity-50"
                            >
                                Créer une nouvelle organisation (Bientôt)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EspaceProPage;
