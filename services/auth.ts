'use client';

import { storageService } from './storage';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'editor';
}

interface AuthResponse {
  user: User;
  token: string;
  expires: number;
}

export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = storageService.getLocal<User | null>('current_user', null);
    if (userData) {
      this.currentUser = userData;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        this.currentUser = data.user;
        storageService.setLocal('current_user', data.user);
        
        return {
          user: data.user,
          token: data.token || '',
          expires: data.expires || Date.now() + 24 * 60 * 60 * 1000,
        };
      }

      throw new Error(data.error || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      this.currentUser = null;
      storageService.removeLocal('current_user');
      storageService.removeLocal('user_session');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        this.currentUser = data.user;
        storageService.setLocal('current_user', data.user);
        
        return {
          user: data.user,
          token: data.token || '',
          expires: data.expires || Date.now() + 24 * 60 * 60 * 1000,
        };
      }

      throw new Error(data.error || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        return data.token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser?.role === role;
  }

  updateUserProfile(updates: Partial<User>): void {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      storageService.setLocal('current_user', this.currentUser);
    }
  }

  async socialLogin(provider: 'google' | 'facebook' | 'twitter'): Promise<void> {
    console.log(`Social login with ${provider} - to be implemented`);
  }
}

export const authService = new AuthService();