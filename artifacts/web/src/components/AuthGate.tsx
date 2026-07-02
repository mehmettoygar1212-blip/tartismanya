import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user && location !== '/') {
      setLocation('/');
    }
  }, [user, loading, location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user && location !== '/') {
    return null;
  }

  return <>{children}</>;
}
