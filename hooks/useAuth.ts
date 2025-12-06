'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  avatar?: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  user?: User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      // Using your WordPress GraphQL endpoint
      const response = await fetch('https://admin-al-asr.centers.pk/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                authToken
                user {
                  id
                  name
                  email
                }
              }
            }
          `,
          variables: {
            input: {
              username,
              password,
            },
          },
        }),
      });

      const data = await response.json();
      
      if (data.errors) {
        return {
          success: false,
          message: data.errors[0]?.message || 'Login failed',
        };
      }

      if (data.data?.login?.authToken) {
        const userData = data.data.login.user;
        const token = data.data.login.authToken;
        
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          token: token,
        };

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        setUser(user);
        setIsAuthenticated(true);
        
        return {
          success: true,
          message: 'Login successful',
          user,
        };
      }

      return {
        success: false,
        message: 'Login failed - no token received',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    // Redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
  };
}