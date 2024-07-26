'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();

  useEffect(() => {
    if (!initialUser) {
      const fetchUser = async () => {
        try {
          const res = await fetch('/api/user');

          if (!res.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await res.json();
          setUser(data.user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, [initialUser]);

  const login = async (idToken) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userResponse = await fetch('/api/user');
      const userData = await userResponse.json();
      setUser(userData.user);

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    await fetch('/api/logout');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
