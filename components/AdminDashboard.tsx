import React, { useState } from 'react';
import { Shield, Users, MapPin, Calendar, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: any;
  navigateTo: (page: string, id?: string) => void;
  pendingPlaces?: any[];
  pendingEvents?: any[];
  pendingReports?: any[];
  users?: any[];
  onApprovePlace?: (placeId: string) => void;
  onRejectPlace?: (placeId: string, reason: string) => void;
  onApproveEvent?: (eventId: string) => void;
  onRejectEvent?: (eventId: string, reason: string) => void;
  onUpdateUserRole?: (userId: string, role: string) => void;
  onBanUser?: (userId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  navigateTo,
  pendingPlaces = [],
  pendingEvents = [],
  pendingReports = [],
  users = [],
  onApprovePlace,
  onRejectPlace,
  onApproveEvent,
  onRejectEvent,
  onUpdateUserRole,
  onBanUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'events' | 'users' | 'reports'>('overview');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<{ type: 'place' | 'event', id: string } | null>(null);

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

  const handleReject = (type: 'place' | 'event', id: string) => {
    setShowRejectModal({ type, id });
  };

  const confirmReject = () => {
    if (!showRejectModal) return;

    if (showRejectModal.type === 'place' && onRejectPlace) {
      onRejectPlace(showRejectModal.id, rejectionReason);
    } else if (showRejectModal.type === 'event' && onRejectEvent) {
      onRejectEvent(showRejectModal.id, rejectionReason);
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
                          <h3 className="font-semibold text-gray-900">{event.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.category}</p>
                          <p className="text-sm text-gray-500 mt-2">{event.description}</p>
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

        {/* Users Tab */}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion des utilisateurs</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Utilisateur</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Rôle</th>
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
                            onChange={(e) => onUpdateUserRole && onUpdateUserRole(user.id, e.target.value)}
                            className="border rounded px-2 py-1"
                          >
                            <option value="user">Utilisateur</option>
                            <option value="moderator">Modérateur</option>
                            <option value="admin">Administrateur</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onBanUser && onBanUser(user.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Bannir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </div>
  );
};

export default AdminDashboard;
