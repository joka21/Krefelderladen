'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold hover:text-indigo-600">
                Krefelder-Laden
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/vendors" className="border-indigo-500 text-gray-900 px-1 pt-1 border-b-2 text-sm font-medium hover:text-indigo-600">
                Anbieter
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-gray-700 hover:text-indigo-600"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-indigo-600"
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                >
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}