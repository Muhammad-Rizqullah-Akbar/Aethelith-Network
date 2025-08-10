'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AiFillDashboard, AiOutlineUser, AiOutlineRight, AiOutlineLeft, AiOutlineLogout, AiOutlineHome } from 'react-icons/ai';
import { IoIosDocument } from 'react-icons/io';
import { useAuth } from './AuthProvider';
import styles from './sidebar.module.css';

interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleClick: () => void;
}

export function Sidebar({ isCollapsed, onToggleClick }: SidebarProps) {
  const { logout } = useAuth();

  const navItems: NavLinkItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <AiFillDashboard /> },
    { name: 'My VCs', href: '/my-vcs', icon: <IoIosDocument /> },
    { name: 'Profile', href: '/profile', icon: <AiOutlineUser /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {/* Tombol toggle sidebar untuk desktop */}
        <button onClick={onToggleClick} className={styles.sidebarToggleButton}>
          {isCollapsed ? <AiOutlineRight /> : <AiOutlineLeft />}
        </button>
      </div>
      <nav className={styles.sidebarNav}>
        {!isCollapsed && (
          <Link href="/" className={styles.sidebarLogoLink}>
            <img src="/Logo.png" alt="Aethelith Network Logo" className={styles.sidebarLogo} />
          </Link>
        )}

        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className={styles.sidebarLink}>
            <span className={styles.sidebarIcon}>{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <div className={styles.divider} />
        {/* Menggunakan class spesifik untuk styling yang berbeda */}
        <Link href="/" className={`${styles.footerLink} ${styles.backToHomeButton}`}>
          <AiOutlineHome className={styles.footerIcon} />
          {!isCollapsed && <span>Back to Home</span>}
        </Link>
        <button onClick={() => logout()} className={`${styles.footerLink} ${styles.logoutButton}`}>
          <AiOutlineLogout className={styles.footerIcon} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}