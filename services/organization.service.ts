const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Organization {
  id: string;
  name: string;
  primaryOwnerId: string;
  subscriptionTier: 'free' | 'pro' | 'premium';
  siret?: string;
  stripeAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  profileId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  invitedBy: string;
  invitedAt: Date;
  acceptedAt?: Date;
}

class OrganizationService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Une erreur est survenue' }));
      throw new Error(error.error || 'Une erreur est survenue');
    }

    return response.json();
  }

  async getMyOrganizations(): Promise<{ owned: Organization[]; member: (Organization & { role: string })[] }> {
    return this.request('/api/organizations/my');
  }

  async createOrganization(name: string, siret?: string): Promise<Organization> {
    return this.request('/api/organizations', {
      method: 'POST',
      body: JSON.stringify({ name, siret }),
    });
  }

  async updateOrganization(orgId: string, data: { name?: string; siret?: string }): Promise<Organization> {
    return this.request(`/api/organizations/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrganization(orgId: string): Promise<void> {
    await this.request(`/api/organizations/${orgId}`, {
      method: 'DELETE',
    });
  }

  async addMember(orgId: string, profileId: string, role: 'admin' | 'editor' | 'viewer'): Promise<OrganizationMember> {
    return this.request(`/api/organizations/${orgId}/members`, {
      method: 'POST',
      body: JSON.stringify({ profileId, role }),
    });
  }

  async removeMember(orgId: string, memberId: string): Promise<void> {
    await this.request(`/api/organizations/${orgId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  async updateMemberRole(orgId: string, memberId: string, role: 'admin' | 'editor' | 'viewer'): Promise<OrganizationMember> {
    return this.request(`/api/organizations/${orgId}/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export const organizationService = new OrganizationService();
