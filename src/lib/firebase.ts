/// lib/firebase.ts
'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDnVX1QQlvQg_lVncIJgnJUSDt_atELdZI",
  authDomain: "krefelder-laden.firebaseapp.com",
  projectId: "krefelder-laden",
  storageBucket: "krefelder-laden.firebasestorage.app",
  messagingSenderId: "621839073526",
  appId: "1:621839073526:web:c437a1f48ce40cd2d7acd7"
};



let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (typeof window !== 'undefined') {
  // Ensure Firebase is only initialized once
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
  auth = getAuth(app);
} else {
  console.warn('Firebase services are not available on the server.');
}

export { app, db, auth };
