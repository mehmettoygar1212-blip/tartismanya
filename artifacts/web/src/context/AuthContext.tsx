import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROOMS } from '@/lib/rooms';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  totalVotes: number;
  totalMessages: number;
  badges: string[];
  isPremium: boolean;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('tartismanya_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // invalid JSON
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // Demo mode: accept any credentials
    const isAd = email === 'admin@tartismanya.com';
    const fakeUser: UserProfile = {
      uid: 'u_' + Math.random().toString(36).substring(2, 9),
      email,
      displayName: email.split('@')[0],
      isAdmin: isAd,
      totalVotes: 42,
      totalMessages: 128,
      badges: ['Ateşli Tartışmacı', 'İlk Oy'],
      isPremium: isAd,
    };
    setUser(fakeUser);
    localStorage.setItem('tartismanya_user', JSON.stringify(fakeUser));
  };

  const register = async (email: string, pass: string, name: string) => {
    const isAd = email === 'admin@tartismanya.com';
    const fakeUser: UserProfile = {
      uid: 'u_' + Math.random().toString(36).substring(2, 9),
      email,
      displayName: name,
      isAdmin: isAd,
      totalVotes: 0,
      totalMessages: 0,
      badges: [],
      isPremium: isAd,
    };
    setUser(fakeUser);
    localStorage.setItem('tartismanya_user', JSON.stringify(fakeUser));
  };

  const loginWithGoogle = async () => {
    await login('google_user@tartismanya.com', 'dummy');
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('tartismanya_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
