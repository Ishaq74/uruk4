import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApiData<T>(endpoint: string, requiresAuth: boolean = false): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const options: RequestInit = {
        credentials: 'include',
      };

      const response = await fetch(`${API_URL}${endpoint}`, options);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks for each data type
export function usePlaces() {
  return useApiData<any[]>('/api/places');
}

export function useEvents() {
  return useApiData<any[]>('/api/events');
}

export function useTrails() {
  return useApiData<any[]>('/api/trails');
}

export function useArticles() {
  return useApiData<any[]>('/api/articles');
}

export function useListings() {
  return useApiData<any[]>('/api/listings');
}

export function useForumCategories() {
  return useApiData<any[]>('/api/forum/categories');
}

export function useForumThreads() {
  return useApiData<any[]>('/api/forum/threads');
}

export function useGroups() {
  return useApiData<any[]>('/api/groups');
}

export function useProfiles() {
  return useApiData<any[]>('/api/profiles');
}

export function useConversations() {
  return useApiData<any[]>('/api/conversations', true);
}

export function useProducts() {
  return useApiData<any[]>('/api/products');
}

export function useServices() {
  return useApiData<any[]>('/api/services');
}

export function useOrders() {
  return useApiData<any[]>('/api/orders', true);
}

export function useBookings() {
  return useApiData<any[]>('/api/bookings', true);
}

export function useClaims() {
  return useApiData<any[]>('/api/claims');
}

export function useReports() {
  return useApiData<any[]>('/api/reports', true);
}

export function useLiveEvents() {
  return useApiData<any[]>('/api/live-events');
}

export function useOrganizations() {
  return useApiData<any[]>('/api/organizations');
}
