import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const IS_FIREBASE_CONFIGURED = !!(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let _app: any = null;
let _auth: any = null;
let _db: any = null;

export async function getFirebaseApp() {
  if (!IS_FIREBASE_CONFIGURED) return null;
  if (_app) return _app;
  const { initializeApp, getApps } = await import('firebase/app');
  if (getApps().length === 0) {
    _app = initializeApp(firebaseConfig);
  } else {
    _app = getApps()[0];
  }
  return _app;
}

export async function getFirebaseAuth() {
  if (!IS_FIREBASE_CONFIGURED) return null;
  if (_auth) return _auth;
  const app = await getFirebaseApp();
  if (!app) return null;
  try {
    const { initializeAuth, getReactNativePersistence } = await import('firebase/auth');
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    const { getAuth } = await import('firebase/auth');
    _auth = getAuth(app);
  }
  return _auth;
}

export async function getFirebaseDb() {
  if (!IS_FIREBASE_CONFIGURED) return null;
  if (_db) return _db;
  const app = await getFirebaseApp();
  if (!app) return null;
  const { getFirestore } = await import('firebase/firestore');
  _db = getFirestore(app);
  return _db;
}
