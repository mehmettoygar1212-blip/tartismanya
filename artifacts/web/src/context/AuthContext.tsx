import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { IS_FIREBASE_CONFIGURED, getFirebaseAuth } from '@/lib/firebase';

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

const ADMIN_EMAIL = 'admin@tartismanya.com';

// Derive isAdmin from a trusted email — never from stored flags.
const deriveIsAdmin = (email: string) => email === ADMIN_EMAIL;

// Build a UserProfile from a Firebase user object.
const profileFromFirebase = (fbUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): UserProfile => {
  const email = fbUser.email ?? '';
  return {
    uid: fbUser.uid,
    email,
    displayName: fbUser.displayName ?? email.split('@')[0],
    isAdmin: deriveIsAdmin(email),
    totalVotes: 0,
    totalMessages: 0,
    badges: [],
    isPremium: false,
  };
};

// Build a demo UserProfile — stored in localStorage but isAdmin is always
// re-derived from email so it cannot be tampered by editing localStorage.
const buildDemoProfile = (
  uid: string,
  email: string,
  displayName: string,
  existing?: Partial<UserProfile>,
): UserProfile => ({
  uid,
  email,
  displayName,
  isAdmin: deriveIsAdmin(email),   // trusted derivation, not stored value
  totalVotes: existing?.totalVotes ?? 0,
  totalMessages: existing?.totalMessages ?? 0,
  badges: existing?.badges ?? [],
  isPremium: deriveIsAdmin(email),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (IS_FIREBASE_CONFIGURED) {
      // Firebase mode: subscribe to auth state changes.
      (async () => {
        const auth = await getFirebaseAuth();
        if (!auth) { setLoading(false); return; }
        const { onAuthStateChanged } = await import('firebase/auth');
        unsubRef.current = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            setUser(profileFromFirebase(fbUser));
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      })();
    } else {
      // Demo mode: load from localStorage, re-derive isAdmin from email.
      const storedRaw = localStorage.getItem('tartismanya_user');
      if (storedRaw) {
        try {
          const stored = JSON.parse(storedRaw) as Partial<UserProfile>;
          if (stored.uid && stored.email) {
            setUser(
              buildDemoProfile(
                stored.uid,
                stored.email,
                stored.displayName ?? stored.email.split('@')[0],
                stored,
              ),
            );
          }
        } catch { /* ignore invalid JSON */ }
      }
      setLoading(false);
    }

    return () => { unsubRef.current?.(); };
  }, []);

  // ── Firebase mode helpers ──────────────────────────────────────────────────

  const firebaseLogin = async (email: string, pass: string) => {
    const auth = await getFirebaseAuth();
    if (!auth) throw new Error('Firebase auth unavailable');
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will update user state.
  };

  const firebaseRegister = async (email: string, pass: string, name: string) => {
    const auth = await getFirebaseAuth();
    if (!auth) throw new Error('Firebase auth unavailable');
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    // onAuthStateChanged fires next; setUser happens there.
  };

  const firebaseLoginWithGoogle = async () => {
    const auth = await getFirebaseAuth();
    if (!auth) throw new Error('Firebase auth unavailable');
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const firebaseLogout = async () => {
    const auth = await getFirebaseAuth();
    if (!auth) throw new Error('Firebase auth unavailable');
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  };

  // ── Demo mode helpers ──────────────────────────────────────────────────────

  const demoLogin = async (email: string, _pass: string) => {
    const profile = buildDemoProfile(
      'u_' + Math.random().toString(36).substring(2, 9),
      email,
      email.split('@')[0],
    );
    setUser(profile);
    // Don't persist isAdmin — it will be re-derived on next load.
    localStorage.setItem('tartismanya_user', JSON.stringify(profile));
  };

  const demoRegister = async (email: string, _pass: string, name: string) => {
    const profile = buildDemoProfile(
      'u_' + Math.random().toString(36).substring(2, 9),
      email,
      name,
    );
    setUser(profile);
    localStorage.setItem('tartismanya_user', JSON.stringify(profile));
  };

  const demoLoginWithGoogle = async () => {
    await demoLogin('google_user@demo.tartismanya.com', '');
  };

  const demoLogout = async () => {
    setUser(null);
    localStorage.removeItem('tartismanya_user');
  };

  // ── Unified API ────────────────────────────────────────────────────────────

  const login         = IS_FIREBASE_CONFIGURED ? firebaseLogin         : demoLogin;
  const register      = IS_FIREBASE_CONFIGURED ? firebaseRegister      : demoRegister;
  const loginWithGoogle = IS_FIREBASE_CONFIGURED ? firebaseLoginWithGoogle : demoLoginWithGoogle;
  const logout        = IS_FIREBASE_CONFIGURED ? firebaseLogout        : demoLogout;

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
