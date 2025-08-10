// apps/web/src/components/layout/validator-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineDashboard, AiOutlineTool, AiOutlineRight, AiOutlineLeft, AiOutlineHome, AiOutlineLogout, AiOutlineCloudUpload } from 'react-icons/ai';
import { useAuthDev } from '../../app/dev-auth/AuthProvider-Dev';
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

export function ValidatorSidebar({ isCollapsed, onToggleClick }: SidebarProps) {
  const { logout } = useAuthDev();
  const pathname = usePathname();

  const navItems: NavLinkItem[] = [
    { name: 'Dashboard', href: '/validator', icon: <AiOutlineDashboard /> },
    { name: 'Audit Kredensial', href: '/validator/templates', icon: <AiOutlineTool /> },
    { name: 'Integrasi', href: '/validator/integrate', icon: <AiOutlineCloudUpload /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <button onClick={onToggleClick} className={styles.sidebarToggleButton}>
          {isCollapsed ? <AiOutlineRight /> : <AiOutlineLeft />}
        </button>
      </div>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`${styles.sidebarLink} ${pathname.startsWith(item.href) ? styles.active : ''}`}
          >
            <span className={styles.sidebarIcon}>{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <div className={styles.divider} />
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