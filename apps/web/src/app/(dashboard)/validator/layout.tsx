// apps/web/src/app/validator/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { ValidatorSidebar } from '../../../components/dashboard/validator-sidebar';
import styles from '../layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function ValidatorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
  
  // Atur status awal sidebar berdasarkan ukuran layar
  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [isMobile]);

  return (
    <div className={inter.className}>
      <div className={styles.bodyContainer}>
        {isMobile && (
          <button 
            onClick={toggleSidebar} 
            className={styles.mobileMenuButton}
          >
            {isSidebarCollapsed ? <AiOutlineMenu /> : <AiOutlineClose />}
          </button>
        )}
        <ValidatorSidebar isCollapsed={isSidebarCollapsed} onToggleClick={toggleSidebar} />
        <div 
          className={`${styles.mainContent} ${isSidebarCollapsed ? styles.mainContentCollapsed : ''}`}
        >
          <main className={styles.mainContentInner}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}