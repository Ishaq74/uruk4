import React, { useState, useEffect } from 'react';
import { Building2, Users, Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { organizationService, Organization } from '../services/organization.service';

interface OrganizationManagementProps {
  currentUser: any;
  navigateTo: (page: string, id?: string) => void;
}

const OrganizationManagement: React.FC<OrganizationManagementProps> = ({ currentUser, navigateTo }) => {
  const [organizations, setOrganizations] = useState<{ owned: Organization[]; member: any[] }>({ owned: [], member: [] });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSiret, setNewOrgSiret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const orgs = await organizationService.getMyOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      console.error('Error loading organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newOrgName) {
      setError('Le nom de l\'organisation est requis');
      return;
    }

    try {
      await organizationService.createOrganization(newOrgName, newOrgSiret);
      setNewOrgName('');
      setNewOrgSiret('');
      setShowCreateModal(false);
      loadOrganizations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const handleDeleteOrganization = async (orgId: string, orgName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${orgName}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      await organizationService.deleteOrganization(orgId);
      loadOrganizations();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vous devez être connecté pour gérer vos organisations</p>
          <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={32} />
            <h1 className="text-3xl font-bold">Mes Organisations</h1>
          </div>
          <p className="text-sky-100">Gérez vos organisations professionnelles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Plus size={20} />
            Créer une organisation
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            {/* Owned Organizations */}
            {organizations.owned.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Organisations dont vous êtes propriétaire</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organizations.owned.map((org) => (
                    <div key={org.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{org.name}</h3>
                          {org.siret && <p className="text-sm text-gray-600 mt-1">SIRET: {org.siret}</p>}
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                            {org.subscriptionTier}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigateTo('espace-pro')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 text-sm"
                        >
                          <Users size={16} />
                          Gérer
                        </button>
                        <button
                          onClick={() => handleDeleteOrganization(org.id, org.name)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Organizations */}
            {organizations.member.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Organisations dont vous êtes membre</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organizations.member.map((org) => (
                    <div key={org.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{org.name}</h3>
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {org.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigateTo('espace-pro')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        Voir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {organizations.owned.length === 0 && organizations.member.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-4">Vous n'avez pas encore d'organisation</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                >
                  Créer votre première organisation
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Créer une organisation</h3>
              
              <form onSubmit={handleCreateOrganization} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'organisation *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="Mon Restaurant"
                  />
                </div>

                <div>
                  <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-2">
                    SIRET (optionnel)
                  </label>
                  <input
                    id="siret"
                    type="text"
                    value={newOrgSiret}
                    onChange={(e) => setNewOrgSiret(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="123 456 789 00012"
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setError('');
                      setNewOrgName('');
                      setNewOrgSiret('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;
