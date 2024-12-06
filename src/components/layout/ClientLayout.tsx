'use client';

import { AuthContextProvider, useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <header>
        {/* Hier kommt Ihre Navigation hin */}
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* Hier kommt Ihr Footer hin */}
      </footer>
    </AuthContextProvider>
  );
}