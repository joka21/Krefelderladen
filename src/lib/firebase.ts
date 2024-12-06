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

let app: FirebaseApp | undefined = undefined;

// Überprüfen, ob wir im Browser sind
if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}

const db = app ? getFirestore(app) : undefined;
const auth = app ? getAuth(app) : undefined;

export { db, auth, app };