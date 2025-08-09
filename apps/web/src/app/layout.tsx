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
  const isProtectedPage = pathname.startsWith('/profile');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : 'dark');
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Tata letak untuk halaman login/register dan halaman yang dilindungi jika belum login
  if (isAuthPage || (isProtectedPage && !isConnected)) {
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

  // Tata letak untuk halaman landing (hanya navbar)
  if (isHomePage) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <main className="main-content main-content-full">
              <Navbar />
              {children}
            </main>
          </Providers>
        </body>
      </html>
    );
  }
  
  // Tata letak untuk semua halaman lain dengan sidebar DAN navbar
  return (
    <html lang="en">
      <body className={inter.className}>
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
