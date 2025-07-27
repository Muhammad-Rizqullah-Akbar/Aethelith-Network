// apps/web/src/app/layout.tsx
'use client';

import { useState } from 'react';
import './global.css';
import { Providers } from './provider';
import { Sidebar } from '../components/layout/sidebar';
import { Navbar } from '../components/layout/navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <html lang="en" className="dark-mode">
      <body className={inter.className}>
        <Providers>
          <div className="body-container">
            {/* --- Perubahan Kunci: Berikan toggleSidebar ke Sidebar --- */}
            <Sidebar isCollapsed={isSidebarCollapsed} onToggleClick={toggleSidebar} />
            <div className={`main-content ${isSidebarCollapsed ? 'main-content-collapsed' : ''}`}>
              {/* --- Navbar tidak perlu tombol lagi --- */}
              <Navbar />
              <main className="main-content-inner">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}