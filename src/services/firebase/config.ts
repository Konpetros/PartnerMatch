// Firebase configuration
// All values come from environment variables (VITE_ prefix for Vite)
// These will be set as ENV variables in the Dockerfile for Cloud Run deployment

export const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
};

// TODO: Initialize Firebase app here when SDK is installed
// import { initializeApp } from 'firebase/app';
// export const firebaseApp = initializeApp(firebaseConfig);
