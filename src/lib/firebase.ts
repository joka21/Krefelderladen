'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDnVX1QQlvQg_lVncIJgnJUSDt_atELdZI",
  authDomain: "krefelder-laden.firebaseapp.com",
  projectId: "krefelder-laden",
  storageBucket: "krefelder-laden.firebasestorage.app",
  messagingSenderId: "621839073526",
  appId: "1:621839073526:web:c437a1f48ce40cd2d7acd7"
};

// Initialize Firebase
let app: FirebaseApp;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}

const db = getFirestore(app!);
const auth = getAuth(app!);

export { db, auth, app };