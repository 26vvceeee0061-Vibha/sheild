// Firebase configuration — SHEild
// In production: replace with actual Firebase credentials from environment variables
// In demo mode: all Firebase operations are simulated

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'DEMO_MODE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'DEMO_MODE',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'DEMO_MODE',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'DEMO_MODE',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'DEMO_MODE',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'DEMO_MODE',
}

export const isDemoMode = firebaseConfig.apiKey === 'DEMO_MODE'
