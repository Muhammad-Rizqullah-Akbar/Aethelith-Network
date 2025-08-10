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
  const shouldShowSidebar = pathname.startsWith('/dashboard') || pathname.startsWith('/issuer') || pathname.startsWith('/holder') || pathname.startsWith('/verifier');
  const showNavbarOnOtherPages = !isAuthPage && !isHomePage && !shouldShowSidebar;

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

  if (isAuthPage || isHomePage) {
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
  
  if (shouldShowSidebar) {
    return (
      <html lang="en">
        <body>
          <Providers>
            <div className="body-container">
              <Sidebar isCollapsed={isSidebarCollapsed} onToggleClick={toggleSidebar} />
              <div className={`main-content ${isSidebarCollapsed ? 'main-content-collapsed' : ''}`}>
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

  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="main-content main-content-full">
            <Navbar className="fixed-navbar" />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
