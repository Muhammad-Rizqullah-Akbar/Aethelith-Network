// apps/web/src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AiFillDashboard, AiOutlineUser, AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import { IoIosBusiness, IoIosSearch, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Url } from 'next/dist/shared/lib/router/router';
import styles from './sidebar.module.css';

interface SubItem {
  name: string;
  href: string;
}

interface NavLinkItem {
  name: string;
  href: Url;
  icon: React.ReactNode;
  type: 'link';
}

interface NavDropdownItem {
  name: string;
  type: 'dropdown';
  icon: React.ReactNode;
  id: string;
  subItems: SubItem[];
}

type NavItem = NavLinkItem | NavDropdownItem;

interface SidebarProps {
  isCollapsed: boolean;
  onToggleClick: () => void;
}

export function Sidebar({ isCollapsed, onToggleClick }: SidebarProps) {
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({
    holder: false,
    issuer: false,
  });

  const toggleDropdown = (name: string) => {
    setDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: <AiFillDashboard />, type: 'link' },
    {
      name: 'Sebagai Holder',
      type: 'dropdown',
      icon: <AiOutlineUser />,
      id: 'holder',
      subItems: [
        { name: 'DID Saya', href: '/holder/my-did' },
        { name: 'VCs Saya', href: '/holder/my-vcs' },
      ],
    },
    {
      name: 'Sebagai Issuer',
      type: 'dropdown',
      icon: <IoIosBusiness />,
      id: 'issuer',
      subItems: [
        { name: 'Dashboard', href: '/issuer/dashboard' },
        { name: 'Terbitkan VC', href: '/issuer/issue-vc' },
        { name: 'Manajemen VC', href: '/issuer/vc-management' },
      ],
    },
    { name: 'Sebagai Verifier', href: '/verifier/verify-kyc', icon: <IoIosSearch />, type: 'link' },
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
          <div key={item.name}>
            {item.type === 'link' ? (
              <Link href={item.href} className={styles.sidebarLink}>
                <span className={styles.sidebarIcon}>{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className={`${styles.dropdownLink} ${dropdowns[item.id] ? styles.dropdownActive : ''}`}
                >
                  <div className="flex items-center">
                    <span className={styles.sidebarIcon}>{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className={styles.dropdownArrow}>
                      {dropdowns[item.id] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  )}
                </button>
                {!isCollapsed && dropdowns[item.id] && (
                  <div className={styles.dropdownContainer}>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={styles.dropdownItem}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        {!isCollapsed && <span>© 2025 ZK-KYC Protocol</span>}
      </div>
    </aside>
  );
}