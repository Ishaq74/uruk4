import React from 'react';
import { Profile, Service, Organization } from '../types';
import { ORGANIZATIONS, SERVICES } from '../constants';

interface ManageServicesPageProps {
  orgId: string;
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
}

const ManageServicesPage: React.FC<ManageServicesPageProps> = ({ orgId, currentUser, navigateTo }) => {
  const organization = ORGANIZATIONS.find(org => org.id === orgId);
  const services = SERVICES.filter(s => s.organization_id === orgId);

  if (!currentUser || currentUser.id !== organization?.primary_owner_id) {
    return <div className="text-center py-20">Accès non autorisé.</div>;
  }
  
  if (!organization) {
    return <div className="text-center py-20">Organisation non trouvée.</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('espace-pro');}} className="text-sm text-sky-600 hover:underline">&larr; Retour à l'Espace Pro</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Gérer mes Services</h1>
            <p className="mt-2 text-lg text-gray-600">Consultez la liste de vos services disponibles à la réservation.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix de base</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Modifier</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                    <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration_minutes} min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.base_price.toFixed(2)}€</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900">Modifier</a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ManageServicesPage;