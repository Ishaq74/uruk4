import React, { useState, useEffect } from 'react';
import { Shield, Users, MapPin, Calendar, MessageSquare, AlertTriangle, CheckCircle, XCircle, Ban, Unlock, Trash2, Key, Clock } from 'lucide-react';
import { authClient } from '../auth-client';

interface AdminDashboardProps {
  currentUser: any;
  navigateTo: (page: string, id?: string) => void;
  pendingPlaces?: any[];
  pendingEvents?: any[];
  pendingTrails?: any[];
  pendingArticles?: any[];
  pendingListings?: any[];
  pendingReports?: any[];
  onApprovePlace?: (placeId: string) => void;
  onRejectPlace?: (placeId: string, reason: string) => void;
  onApproveEvent?: (eventId: string) => void;
  onRejectEvent?: (eventId: string, reason: string) => void;
  onApproveTrail?: (trailId: string) => void;
  onRejectTrail?: (trailId: string, reason: string) => void;
  onApproveArticle?: (articleId: string) => void;
  onRejectArticle?: (articleId: string, reason: string) => void;
  onApproveListing?: (listingId: string) => void;
  onRejectListing?: (listingId: string, reason: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  navigateTo,
  pendingPlaces = [],
  pendingEvents = [],
  pendingTrails = [],
  pendingArticles = [],
  pendingListings = [],
  pendingReports = [],
  onApprovePlace,
  onRejectPlace,
  onApproveEvent,
  onRejectEvent,
  onApproveTrail,
  onRejectTrail,
  onApproveArticle,
  onRejectArticle,
  onApproveListing,
  onRejectListing,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'events' | 'trails' | 'articles' | 'listings' | 'users' | 'reports'>('overview');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<{ type: 'place' | 'event' | 'trail' | 'article' | 'listing', id: string } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [banModal, setBanModal] = useState<{ userId: string; userName: string } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDays, setBanDays] = useState<number>(7);
  const [showSessions, setShowSessions] = useState<{ userId: string; userName: string } | null>(null);
  const [userSessions, setUserSessions] = useState<any[]>([]);

  // Check if user is admin or moderator
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Load users using Better Auth Admin API
  useEffect(() => {
    if (activeTab === 'users' && currentUser.role === 'admin') {
      loadUsers();
    }
  }, [activeTab, currentUser.role]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: { limit: 100 }
      });
      
      if (error) {
        console.error('Failed to load users:', error);
      } else if (data) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await authClient.admin.setRole({
        userId,
        role: newRole
      });

      if (error) {
        alert('Erreur lors de la mise à jour du rôle: ' + error.message);
      } else {
        alert('Rôle mis à jour avec succès');
        loadUsers(); // Reload users
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleBanUser = async () => {
    if (!banModal) return;

    try {
      const banExpiresIn = banDays > 0 ? banDays * 24 * 60 * 60 : undefined; // Convert days to seconds
      
      const { error } = await authClient.admin.banUser({
        userId: banModal.userId,
        banReason: banReason || 'Violation des conditions d\'utilisation',
        banExpiresIn
      });

      if (error) {
        alert('Erreur lors du bannissement: ' + error.message);
      } else {
        alert('Utilisateur banni avec succès');
        setBanModal(null);
        setBanReason('');
        setBanDays(7);
        loadUsers();
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Erreur lors du bannissement');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const { error } = await authClient.admin.unbanUser({ userId });

      if (error) {
        alert('Erreur lors du débannissement: ' + error.message);
      } else {
        alert('Utilisateur débanni avec succès');
        loadUsers();
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('Erreur lors du débannissement');
    }
  };

  const handleViewSessions = async (userId: string, userName: string) => {
    try {
      const { data, error } = await authClient.admin.listUserSessions({ userId });

      if (error) {
        alert('Erreur lors du chargement des sessions: ' + error.message);
      } else if (data) {
        setUserSessions(data || []);
        setShowSessions({ userId, userName });
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      alert('Erreur lors du chargement des sessions');
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      const { error } = await authClient.admin.revokeUserSession({ sessionToken });

      if (error) {
        alert('Erreur lors de la révocation: ' + error.message);
      } else {
        alert('Session révoquée avec succès');
        if (showSessions) {
          handleViewSessions(showSessions.userId, showSessions.userName);
        }
      }
    } catch (error) {
      console.error('Error revoking session:', error);
      alert('Erreur lors de la révocation');
    }
  };

  const handleRevokeAllSessions = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir révoquer toutes les sessions de cet utilisateur ?')) {
      return;
    }

    try {
      const { error } = await authClient.admin.revokeUserSessions({ userId });

      if (error) {
        alert('Erreur lors de la révocation: ' + error.message);
      } else {
        alert('Toutes les sessions ont été révoquées');
        setShowSessions(null);
        setUserSessions([]);
      }
    } catch (error) {
      console.error('Error revoking sessions:', error);
      alert('Erreur lors de la révocation');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur ${userName} ? Cette action est irréversible.`)) {
      return;
    }

    try {
      const { error } = await authClient.admin.removeUser({ userId });

      if (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      } else {
        alert('Utilisateur supprimé avec succès');
        loadUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleReject = (type: 'place' | 'event' | 'trail' | 'article' | 'listing', id: string) => {
    setShowRejectModal({ type, id });
  };

  const confirmReject = () => {
    if (!showRejectModal) return;

    if (showRejectModal.type === 'place' && onRejectPlace) {
      onRejectPlace(showRejectModal.id, rejectionReason);
    } else if (showRejectModal.type === 'event' && onRejectEvent) {
      onRejectEvent(showRejectModal.id, rejectionReason);
    } else if (showRejectModal.type === 'trail' && onRejectTrail) {
      onRejectTrail(showRejectModal.id, rejectionReason);
    } else if (showRejectModal.type === 'article' && onRejectArticle) {
      onRejectArticle(showRejectModal.id, rejectionReason);
    } else if (showRejectModal.type === 'listing' && onRejectListing) {
      onRejectListing(showRejectModal.id, rejectionReason);
    }

    setShowRejectModal(null);
    setRejectionReason('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={32} />
            <h1 className="text-3xl font-bold">Panneau d'Administration</h1>
          </div>
          <p className="text-sky-100">Gestion et modération de la plateforme</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'places'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lieux ({pendingPlaces.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'events'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Événements ({pendingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('trails')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'trails'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sentiers ({pendingTrails.length})
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'articles'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Articles ({pendingArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'listings'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annonces ({pendingListings.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'users'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Signalements ({pendingReports.length})
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <MapPin className="text-sky-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">{pendingPlaces.length}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Lieux en attente</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-green-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">{pendingEvents.length}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Événements en attente</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <MapPin className="text-orange-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">{pendingTrails.length}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Sentiers en attente</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="text-blue-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">{pendingArticles.length}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Articles en attente</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="text-indigo-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">{pendingListings.length}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Annonces en attente</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-red-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">{pendingReports.length}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Signalements</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-purple-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">{users.length}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Utilisateurs</h3>
            </div>
          </div>
        )}

        {/* Places Tab */}
        {activeTab === 'places' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lieux en attente de modération</h2>
              {pendingPlaces.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun lieu en attente</p>
              ) : (
                <div className="space-y-4">
                  {pendingPlaces.map((place) => (
                    <div key={place.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{place.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{place.category}</p>
                          <p className="text-sm text-gray-500 mt-2">{place.description}</p>
                        </div>
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-24 h-24 object-cover rounded-lg ml-4"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => onApprovePlace && onApprovePlace(place.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <CheckCircle size={16} />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject('place', place.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <XCircle size={16} />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Événements en attente de modération</h2>
              {pendingEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun événement en attente</p>
              ) : (
                <div className="space-y-4">
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.title || event.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.category} - {event.date}</p>
                          <p className="text-sm text-gray-500 mt-2">{event.description}</p>
                          {event.slug && <p className="text-xs text-blue-600 mt-1">Slug: {event.slug}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => onApproveEvent && onApproveEvent(event.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <CheckCircle size={16} />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject('event', event.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <XCircle size={16} />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trails Tab */}
        {activeTab === 'trails' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sentiers en attente de modération</h2>
              {pendingTrails.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun sentier en attente</p>
              ) : (
                <div className="space-y-4">
                  {pendingTrails.map((trail) => (
                    <div key={trail.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{trail.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Distance: {trail.distanceKm}km - Difficulté: {trail.difficulty}</p>
                          <p className="text-sm text-gray-500 mt-2">{trail.description || trail.excerpt}</p>
                          {trail.slug && <p className="text-xs text-blue-600 mt-1">Slug: {trail.slug}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => onApproveTrail && onApproveTrail(trail.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <CheckCircle size={16} />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject('trail', trail.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <XCircle size={16} />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Articles en attente de modération</h2>
              {pendingArticles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun article en attente</p>
              ) : (
                <div className="space-y-4">
                  {pendingArticles.map((article) => (
                    <div key={article.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{article.title}</h3>
                          <p className="text-sm text-gray-500 mt-2">{article.excerpt}</p>
                          {article.slug && <p className="text-xs text-blue-600 mt-1">Slug: {article.slug}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => onApproveArticle && onApproveArticle(article.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <CheckCircle size={16} />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject('article', article.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <XCircle size={16} />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Annonces en attente de modération</h2>
              {pendingListings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune annonce en attente</p>
              ) : (
                <div className="space-y-4">
                  {pendingListings.map((listing) => (
                    <div key={listing.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{listing.type} - {listing.price}</p>
                          <p className="text-sm text-gray-500 mt-2">{listing.description}</p>
                          {listing.slug && <p className="text-xs text-blue-600 mt-1">Slug: {listing.slug}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => onApproveListing && onApproveListing(listing.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <CheckCircle size={16} />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject('listing', listing.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <XCircle size={16} />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion des utilisateurs</h2>
              {loadingUsers ? (
                <p className="text-gray-500 text-center py-8">Chargement des utilisateurs...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Utilisateur</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Rôle</th>
                        <th className="text-left py-3 px-4">Statut</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <select
                              value={user.role || 'user'}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                              className="border rounded px-2 py-1"
                              disabled={user.id === currentUser.id}
                            >
                              <option value="user">Utilisateur</option>
                              <option value="moderator">Modérateur</option>
                              <option value="admin">Administrateur</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {user.banned ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                                <Ban size={14} />
                                Banni
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                <CheckCircle size={14} />
                                Actif
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 flex-wrap">
                              {user.banned ? (
                                <button
                                  onClick={() => handleUnbanUser(user.id)}
                                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                                  title="Débannir"
                                >
                                  <Unlock size={16} />
                                  Débannir
                                </button>
                              ) : (
                                <button
                                  onClick={() => setBanModal({ userId: user.id, userName: user.name })}
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                                  title="Bannir"
                                  disabled={user.id === currentUser.id}
                                >
                                  <Ban size={16} />
                                  Bannir
                                </button>
                              )}
                              <button
                                onClick={() => handleViewSessions(user.id, user.name)}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                title="Sessions"
                              >
                                <Clock size={16} />
                                Sessions
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm"
                                title="Supprimer"
                                disabled={user.id === currentUser.id}
                              >
                                <Trash2 size={16} />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Signalements</h2>
              {pendingReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun signalement</p>
              ) : (
                <div className="space-y-4">
                  {pendingReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{report.targetType}</h3>
                          <p className="text-sm text-gray-600 mt-1">Raison: {report.reason}</p>
                          <p className="text-sm text-gray-500 mt-2">{report.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Raison du rejet</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                rows={4}
                placeholder="Expliquez pourquoi ce contenu est rejeté..."
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirmer le rejet
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {banModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Bannir {banModal.userName}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison du bannissement
                  </label>
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    rows={3}
                    placeholder="Expliquez la raison du bannissement..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (jours)
                  </label>
                  <input
                    type="number"
                    value={banDays}
                    onChange={(e) => setBanDays(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    min="0"
                    placeholder="0 = permanent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    0 = bannissement permanent
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleBanUser}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirmer le bannissement
                </button>
                <button
                  onClick={() => {
                    setBanModal(null);
                    setBanReason('');
                    setBanDays(7);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Sessions de {showSessions.userName}
              </h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {userSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune session active</p>
              ) : (
                <div className="space-y-3">
                  {userSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            <strong>ID:</strong> {session.id.substring(0, 20)}...
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>IP:</strong> {session.ipAddress || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>User Agent:</strong> {session.userAgent?.substring(0, 50) || 'N/A'}...
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Créée:</strong> {new Date(session.createdAt).toLocaleString('fr-FR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Expire:</strong> {new Date(session.expiresAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRevokeSession(session.token)}
                          className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Révoquer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t flex gap-2">
              <button
                onClick={() => handleRevokeAllSessions(showSessions.userId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                disabled={userSessions.length === 0}
              >
                Révoquer toutes les sessions
              </button>
              <button
                onClick={() => {
                  setShowSessions(null);
                  setUserSessions([]);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
