import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const IS_FIREBASE_CONFIGURED = !!(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let _app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!IS_FIREBASE_CONFIGURED) return null;
  if (_app) return _app;
  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
  return _app;
}

export async function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) return null;
  const { getAuth } = await import('firebase/auth');
  return getAuth(app);
}

export async function getFirebaseDb() {
  const app = getFirebaseApp();
  if (!app) return null;
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app);
}
