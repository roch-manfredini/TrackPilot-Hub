import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export const HUB_FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: 'AIzaSyAcUodTUY6P3lRg-orYBvazqBog4boTTk0',
  authDomain: 'trackpilot-hub.firebaseapp.com',
  projectId: 'trackpilot-hub',
  storageBucket: 'trackpilot-hub.firebasestorage.app',
  messagingSenderId: '217147525631',
  appId: '1:217147525631:web:877c4ff18534d8b8947fca',
  measurementId: 'G-BFYKSM6F66',
};

/** Must stay aligned with isAdmin() in firestore.rules */
const ADMIN_EMAILS = new Set<string>([
  'roch.manfredini@gmail.com',
  'roch.manfredini@googlemail.com',
  'rmanf30@gmail.com',
  'rmanf30@googlemail.com',
  'rochmanfredini@gmail.com',
  'rochmanfredini@googlemail.com',
  'rmanf.30@gmail.com',
  'rmanf.30@googlemail.com',
]);

let hubAppInstance: FirebaseApp | null = null;
let hubAuthInstance: Auth | null = null;
let hubDbInstance: Firestore | null = null;

export function getHubApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase client SDK cannot be initialized during SSR.');
  }
  if (!hubAppInstance) {
    hubAppInstance = getApps().some((app) => app.name === '[DEFAULT]')
      ? getApp('[DEFAULT]')
      : initializeApp(HUB_FIREBASE_CONFIG);
  }
  return hubAppInstance;
}

export function getHubAuth(): Auth {
  if (!hubAuthInstance) {
    hubAuthInstance = getAuth(getHubApp());
  }
  return hubAuthInstance;
}

export function getHubDb(): Firestore {
  if (!hubDbInstance) {
    hubDbInstance = getFirestore(getHubApp());
  }
  return hubDbInstance;
}

export function createGoogleAuthProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

export function isAllowedAdminUser(user: User | null): boolean {
  if (!user || !user.email || !user.emailVerified) {
    return false;
  }
  return ADMIN_EMAILS.has(user.email.toLowerCase());
}
