// apps/web/src/components/layout/ProfileButton.tsx
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { AiOutlineUser, AiOutlineSetting, AiOutlineLogout, AiOutlineSun, AiOutlineMoon } from 'react-icons/ai';
import { Modal } from './modal';
import { CopyButton } from './CopyButton'; // Tambahkan ini

export function ProfileButton() {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [hasMounted, setHasMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setHasMounted(true);
    
    // Logika tema dari localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
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
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  if (!hasMounted || !address) {
    return null;
  }

  return (
    <>
      <div className="profile-container" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className="profile-button">
          <AiOutlineUser className="profile-icon" />
        </button>
        
        {isOpen && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <span style={{ color: 'var(--text-secondary)' }}>Connected:</span>
              <div className="flex items-center">
                <p className="profile-address">{address.substring(0, 6)}...{address.substring(address.length - 4)}</p>
                <CopyButton textToCopy={address} />
              </div>
            </div>
            <Link href="/profile" onClick={() => setIsOpen(false)} className="dropdown-item">
              <AiOutlineUser className="dropdown-item-icon" /> Profil
            </Link>
            <button onClick={() => { setIsSettingsModalOpen(true); setIsOpen(false); }} className="dropdown-item">
              <AiOutlineSetting className="dropdown-item-icon" /> Pengaturan
            </button>
            <div className="dropdown-item-divider"></div>
            <button onClick={() => disconnect()} className="dropdown-item logout-button">
              <AiOutlineLogout className="dropdown-item-icon" /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Modal Pengaturan dengan Fitur Ganti Tema */}
      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Pengaturan">
        <h3 className="card-title text-xl">Pengaturan Aplikasi</h3>
        <p className="card-description">
          Tema Tampilan:
        </p>
        <button onClick={toggleTheme} className="theme-toggle-button">
          {isDarkMode ? (
            <><AiOutlineSun className="theme-icon" /> Mode Terang</>
          ) : (
            <><AiOutlineMoon className="theme-icon" /> Mode Gelap</>
          )}
        </button>
      </Modal>
    </>
  );
}