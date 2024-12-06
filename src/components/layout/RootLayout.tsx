'use client';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 bg-white"
      >
        Zum Hauptinhalt springen
      </a>
      {/* Navigation wird später hier eingefügt */}
      <main 
        id="main-content" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}