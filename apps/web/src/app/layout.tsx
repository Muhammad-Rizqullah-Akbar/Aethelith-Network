'use client';

import { useState, useEffect } from 'react';
import './global.css';
import { Providers } from './provider';
import { Sidebar } from '../components/layout/sidebar';
import { Navbar } from '../components/layout/navbar';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useAuth } from '../components/layout/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { isConnected } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isHomePage = pathname === '/';
  const isProfilePage = pathname === '/profile';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Tata letak untuk halaman login/register
  if (isAuthPage) {
    return (
      <html lang="en">
        <body>
          <Providers>
            <main>
              {children}
            </main>
          </Providers>
        </body>
      </html>
    );
  }

  // Tata letak untuk halaman landing dan profil
  if (isHomePage || isProfilePage) {
    return (
      <html lang="en">
        <body>
          <Providers>
            <main className="main-content main-content-full">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    );
  }
  
  // Tata letak untuk semua halaman lain dengan sidebar
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="body-container">
            <Sidebar isCollapsed={isSidebarCollapsed} onToggleClick={toggleSidebar} />
            <div className={`main-content ${isSidebarCollapsed ? 'main-content-collapsed' : ''}`}>
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