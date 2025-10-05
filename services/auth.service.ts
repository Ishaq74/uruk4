const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: 'user' | 'moderator' | 'admin';
  image?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  levelId: number;
  joinDate: Date;
  isVerified: boolean;
  points: number;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
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

  async register(name: string, username: string, email: string, password: string): Promise<{ user: AuthUser; profile: UserProfile }> {
    const data = await this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('auth_token', data.token);
    }

    // Create profile with username
    const profile = await this.request('/api/auth/create-profile', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });

    return { user: data.user, profile };
  }

  async login(email: string, password: string): Promise<{ user: AuthUser; profile: UserProfile }> {
    const data = await this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('auth_token', data.token);
    }

    const me = await this.getCurrentUser();
    return me;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/signout', {
        method: 'POST',
      });
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  }

  async getCurrentUser(): Promise<{ user: AuthUser; profile: UserProfile }> {
    return this.request('/api/auth/me');
  }

  async verifyEmail(token: string): Promise<void> {
    await this.request('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(): Promise<void> {
    await this.request('/api/auth/resend-verification', {
      method: 'POST',
    });
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}

export const authService = new AuthService();
