import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/storage';
import { IS_FIREBASE_CONFIGURED, getFirebaseAuth } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  totalVotes: number;
  totalMessages: number;
  badges: string[];
  isPremium: boolean;
  dailyMessages: number;
  createdAt: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo admin is accessed only via this exact email in demo mode
const DEMO_ADMIN_EMAIL = 'admin@tartismanya.com';

const DEMO_ADMIN_PROFILE: UserProfile = {
  uid: 'demo_admin',
  email: DEMO_ADMIN_EMAIL,
  displayName: 'Demo Admin',
  isAdmin: true,
  totalVotes: 1337,
  totalMessages: 521,
  badges: ['10_oda_fatih', 'futbol_lideri', 'gundem_uzman'],
  isPremium: true,
  dailyMessages: 5,
  createdAt: Date.now() - 86400000 * 30,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // Holds the Firebase onAuthStateChanged unsubscribe, if any
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (IS_FIREBASE_CONFIGURED) {
        try {
          const auth = await getFirebaseAuth();
          if (auth && !cancelled) {
            const { onAuthStateChanged } = await import('firebase/auth');
            const unsub = onAuthStateChanged(auth, async (fbUser) => {
              if (fbUser) {
                const stored = await storage.get<UserProfile>(`user_profile_${fbUser.uid}`);
                setUser(
                  stored ?? {
                    uid: fbUser.uid,
                    email: fbUser.email ?? '',
                    displayName: fbUser.displayName ?? 'Kullanıcı',
                    photoURL: fbUser.photoURL ?? undefined,
                    isAdmin: false,
                    totalVotes: 0,
                    totalMessages: 0,
                    badges: [],
                    isPremium: false,
                    dailyMessages: 0,
                    createdAt: Date.now(),
                  },
                );
              } else {
                setUser(null);
              }
              setLoading(false);
            });
            unsubRef.current = unsub;
            return; // Firebase handles setLoading via the subscription
          }
        } catch (e) {
          console.error('Firebase auth init error:', e);
        }
      }

      if (!cancelled) {
        // Demo mode — restore session from AsyncStorage
        const storedUser = await storage.get<UserProfile>('current_user');
        setUser(storedUser ?? null);
        setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, []);

  async function login(email: string, password: string) {
    if (IS_FIREBASE_CONFIGURED) {
      const auth = await getFirebaseAuth();
      if (auth) {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, password);
        return;
      }
    }

    // Demo mode — only exact admin email gets admin privileges
    const isAdmin = email.toLowerCase() === DEMO_ADMIN_EMAIL;
    const profile: UserProfile = isAdmin
      ? DEMO_ADMIN_PROFILE
      : {
          uid: `demo_${Date.now()}`,
          email,
          displayName: email.split('@')[0] ?? 'Kullanıcı',
          isAdmin: false,
          totalVotes: Math.floor(Math.random() * 200),
          totalMessages: Math.floor(Math.random() * 100),
          badges: [],
          isPremium: false,
          dailyMessages: 0,
          createdAt: Date.now(),
        };
    await storage.set('current_user', profile);
    setUser(profile);
  }

  async function register(email: string, password: string, displayName: string) {
    if (IS_FIREBASE_CONFIGURED) {
      const auth = await getFirebaseAuth();
      if (auth) {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });
        return;
      }
    }

    // Demo mode — registered users are never admin
    const profile: UserProfile = {
      uid: `demo_${Date.now()}`,
      email,
      displayName,
      isAdmin: false,
      totalVotes: 0,
      totalMessages: 0,
      badges: [],
      isPremium: false,
      dailyMessages: 0,
      createdAt: Date.now(),
    };
    await storage.set('current_user', profile);
    setUser(profile);
  }

  async function loginWithGoogle() {
    // Demo mode Google login (real OAuth requires Expo auth session setup)
    const profile: UserProfile = {
      uid: `google_demo_${Date.now()}`,
      email: 'kullanici@gmail.com',
      displayName: 'Google Kullanıcı',
      isAdmin: false,
      totalVotes: 42,
      totalMessages: 15,
      badges: [],
      isPremium: false,
      dailyMessages: 0,
      createdAt: Date.now(),
    };
    await storage.set('current_user', profile);
    setUser(profile);
  }

  async function logout() {
    if (IS_FIREBASE_CONFIGURED) {
      const auth = await getFirebaseAuth();
      if (auth) {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
        return;
      }
    }
    await storage.remove('current_user');
    setUser(null);
  }

  async function updateUser(updates: Partial<UserProfile>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    // Write to both keys so Firebase-mode profile reads also stay in sync
    await storage.set('current_user', updated);
    if (user.uid) {
      await storage.set(`user_profile_${user.uid}`, updated);
    }
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
