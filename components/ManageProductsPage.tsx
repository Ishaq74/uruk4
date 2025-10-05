import React from 'react';
import { Profile, Organization, Product } from '../types';
import { ORGANIZATIONS, PRODUCTS } from '../constants';

interface ManageProductsPageProps {
  orgId: string;
  currentUser: Profile | null;
  navigateTo: (page: string) => void;
}

const ManageProductsPage: React.FC<ManageProductsPageProps> = ({ orgId, currentUser, navigateTo }) => {
  const organization = ORGANIZATIONS.find(org => org.id === orgId);
  const products = PRODUCTS.filter(p => p.organization_id === orgId);

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
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Gérer mes Produits</h1>
            <p className="mt-2 text-lg text-gray-600">Consultez la liste de vos produits disponibles à la vente.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Modifier</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                    <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price.toFixed(2)}€</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
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

export default ManageProductsPage;