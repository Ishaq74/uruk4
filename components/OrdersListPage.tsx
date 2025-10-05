import React from 'react';
import { Profile, Order, Organization } from '../types';
import { ORGANIZATIONS, ORDERS, PROFILES } from '../constants';

interface OrdersListPageProps {
  orgId: string;
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
}

const OrdersListPage: React.FC<OrdersListPageProps> = ({ orgId, currentUser, navigateTo }) => {
  const organization = ORGANIZATIONS.find(org => org.id === orgId);
  const orders = ORDERS.filter(o => o.organization_id === orgId);

  if (!currentUser || currentUser.id !== organization?.primary_owner_id) {
    return <div className="text-center py-20">Accès non autorisé.</div>;
  }
  
  if (!organization) {
    return <div className="text-center py-20">Organisation non trouvée.</div>;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('espace-pro');}} className="text-sm text-sky-600 hover:underline">&larr; Retour à l'Espace Pro</a>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Historique des Commandes</h1>
            <p className="mt-2 text-lg text-gray-600">Suivez toutes les commandes passées pour vos produits.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                        const customer = PROFILES.find(p => p.id === order.customer_id);
                        return (
                             <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {customer && (
                                            <>
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full" src={customer.avatarUrl} alt={customer.fullName} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.ordered_at}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{order.total_price.toFixed(2)}€</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersListPage;