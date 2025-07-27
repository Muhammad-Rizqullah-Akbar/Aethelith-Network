// apps/web/src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AiFillDashboard, AiOutlineUser, AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import { IoIosBusiness, IoIosSearch, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Url } from 'next/dist/shared/lib/router/router';

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
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <button onClick={onToggleClick} className="sidebar-toggle-button">
          {isCollapsed ? <AiOutlineRight /> : <AiOutlineLeft />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div key={item.name}>
            {item.type === 'link' ? (
              <Link href={item.href} className="sidebar-link">
                <span className="sidebar-icon">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className={`dropdown-link ${dropdowns[item.id] ? 'dropdown-active' : ''}`}
                >
                  <div className="flex items-center">
                    <span className="sidebar-icon">{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="dropdown-arrow">
                      {dropdowns[item.id] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  )}
                </button>
                {!isCollapsed && dropdowns[item.id] && (
                  <div className="dropdown-container">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="dropdown-item"
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
      <div className="sidebar-footer">
        {!isCollapsed && <span>© 2025 ZK-KYC Protocol</span>}
      </div>
    </aside>
  );
}