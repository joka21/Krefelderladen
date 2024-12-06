'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export type CustomUser = User & {
  role?: string;
};

export type AuthContextType = {
  user: CustomUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!app || typeof window === 'undefined') return;

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        if (role) {
          setUser({ ...user, role });
        } else {
          console.warn('Benutzerrolle konnte nicht geladen werden.');
          setUser({ ...user, role: 'user' }); // Standardrolle zuweisen, wenn keine Rolle gefunden wird
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUserRole = async (uid: string): Promise<string | null> => {
    if (!app) {
      throw new Error('Firebase-App nicht initialisiert');
    }
    const db = getFirestore(app);
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.role || null;
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    if (!app) {
      throw new Error('Firebase-App nicht initialisiert');
    }
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Fehler beim Login:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!app) {
      throw new Error('Firebase-App nicht initialisiert');
    }
    const auth = getAuth(app);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Fehler beim Logout:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    if (!app) {
      throw new Error('Firebase-App nicht initialisiert');
    }
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthContextProviders verwendet werden');
  }
  return context;
};
