// apps/web/src/app/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import './global.css';
import { Providers } from './provider';
import { Sidebar } from '../components/layout/sidebar';
import { Navbar } from '../components/layout/navbar';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useAuth } from '../components/layout/AuthProvider';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { isConnected } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/dev-auth' || pathname === '/dev-register' || pathname === '/profile';
  const isHomePage = pathname === '/';

  const shouldShowDashboardLayout = pathname.startsWith('/dashboard') || pathname.startsWith('/my-vcs') || pathname.startsWith('/issuer') || pathname.startsWith('/profile');
  const isValidatorPage = pathname.startsWith('/validator') || pathname.startsWith('/verifier'); // Kondisi baru untuk halaman validator

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [isMobile]);

  if (isAuthPage || isHomePage) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <main>
              {children}
            </main>
          </Providers>
        </body>
      </html>
    );
  }

  if (shouldShowDashboardLayout) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <div className={styles.bodyContainer}>
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className={styles.mobileMenuButton}
                  style={{ zIndex: 150 }}
                >
                  {isSidebarCollapsed ? <AiOutlineMenu /> : <AiOutlineClose />}
                </button>
              )}
              <Sidebar isCollapsed={isSidebarCollapsed} onToggleClick={toggleSidebar} />
              <div
                className={`${styles.mainContent} ${isSidebarCollapsed ? styles.mainContentCollapsed : ''}`}
              >
                <main className={styles.mainContentInner}>
                  {children}
                </main>
              </div>
            </div>
          </Providers>
        </body>
      </html>
    );
  }

  if (isValidatorPage) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <main className={styles.mainContentFull}>
              {children}
            </main>
          </Providers>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className={styles.mainContentFull}>
            <Navbar className="fixed-navbar" />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}