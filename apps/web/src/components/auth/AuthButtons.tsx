'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { AiOutlineUser, AiOutlineSetting, AiOutlineLogout, AiOutlineSun, AiOutlineMoon } from 'react-icons/ai';
import { Modal } from '../layout/modal';
import { CopyButton } from '../layout/CopyButton';
import { useUserIdentity } from '../hooks/useUserIdentity';
import styles from './navbar.module.css'; // Perbaikan: Mengimpor CSS dari navbar.module.css

export function AuthButtons() {
  const { userDid, isConnected, logout } = useUserIdentity();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [hasMounted, setHasMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setHasMounted(true);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  if (!hasMounted || !isConnected) {
    return (
      <Link href="/login" className={styles.navOpenAppButton}>
        Buka Aplikasi
      </Link>
    );
  }

  return (
    <>
      <div className={styles.profileContainer} ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className={styles.profileButton}>
          <AiOutlineUser className={styles.profileIcon} />
        </button>
        
        {isOpen && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileDropdownHeader}>
              <span style={{ color: 'var(--text-secondary)' }}>Terhubung:</span>
              <div className="flex items-center">
                <p className={styles.profileAddress}>{userDid ? `${userDid.substring(0, 6)}...${userDid.substring(userDid.length - 4)}` : 'N/A'}</p>
                {userDid && <CopyButton textToCopy={userDid} />}
              </div>
            </div>
            <Link href="/profile" onClick={() => setIsOpen(false)} className={styles.dropdownItem}>
              <AiOutlineUser className={styles.dropdownItemIcon} /> Profil
            </Link>
            <button onClick={() => { setIsSettingsModalOpen(true); setIsOpen(false); }} className={styles.dropdownItem}>
              <AiOutlineSetting className={styles.dropdownItemIcon} /> Pengaturan
            </button>
            <div className={styles.dropdownItemDivider}></div>
            <button onClick={() => logout()} className={styles.logoutButton}>
              <AiOutlineLogout className={styles.dropdownItemIcon} /> Logout
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Pengaturan">
        <h3 className="card-title text-xl">Pengaturan Aplikasi</h3>
        <p className="card-description">
          Tema Tampilan:
        </p>
        <button onClick={toggleTheme} className={styles.themeToggleButton}>
          {isDarkMode ? (
            <><AiOutlineSun className={styles.themeIcon} /> Mode Terang</>
          ) : (
            <><AiOutlineMoon className={styles.themeIcon} /> Mode Gelap</>
          )}
        </button>
      </Modal>
    </>
  );
}
