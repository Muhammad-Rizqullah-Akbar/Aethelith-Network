// apps/web/src/app/mitra/app/e-commerce-c/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineLock, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters, AiOutlineShoppingCart } from 'react-icons/ai';
import styles from './mitra-app-e-commerce-c.module.css';

const partnerName = 'E-commerce C';

export default function MitraAppPage() {
  const router = useRouter();
  const isConnectedToAethelith = true;

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'requesting' | 'verifying' | 'success' | 'failed' | 'denied'>('idle');
  const [showVerificationOptions, setShowVerificationOptions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    window.open('/validator/dashboard', '_blank');
  }, []);

  const handleConnect = useCallback(() => {
    setShowVerificationOptions(true);
  }, []);
  
  const handleStartVerification = useCallback(() => {
    setShowVerificationOptions(false);
    setShowLoginModal(true);
  }, []);
  
  const handleAethelithLogin = useCallback(() => {
    if (loginUsername === 'user@aethelith.net' && loginPassword === 'password') {
      setLoginError('');
      setShowLoginModal(false);
      setVerificationStatus('requesting');
      setTimeout(() => {
        setVerificationStatus('verifying');
        setTimeout(() => {
          setVerificationStatus('failed'); // Skenario gagal: selalu gagal
        }, 2000);
      }, 1500);
    } else {
      setLoginError('Kredensial Aethelith tidak valid.');
    }
  }, [loginUsername, loginPassword]);

  const renderVerificationContent = () => {
    switch (verificationStatus) {
      case 'idle':
        return (
          <>
            <h3 className={styles.cardTitle}>Verifikasi Usia</h3>
            <p className={styles.cardDescription}>
              Verifikasi usia Anda untuk membeli produk dengan batasan umur.
            </p>
            <button onClick={handleConnect} className={styles.connectButton}>
              Connect with Aethelith
            </button>
          </>
        );
      case 'requesting':
        return (
          <div className={styles.verificationMessage}>
            <AiOutlineLoading3Quarters className={`${styles.loadingSpinner} ${styles.spinner}`} />
            <h3 className={styles.cardTitle}>Meminta Kredensial Usia...</h3>
            <p className={styles.cardDescription}>
              Kami sedang meminta kredensial verifikasi usia Anda dari Aethelith Network.
            </p>
          </div>
        );
      case 'verifying':
        return (
          <div className={styles.verificationMessage}>
            <AiOutlineLoading3Quarters className={`${styles.loadingSpinner} ${styles.spinner}`} />
            <h3 className={styles.cardTitle}>Memverifikasi Kredensial...</h3>
            <p className={styles.cardDescription}>
              Mohon tunggu, kami sedang memastikan kredensial Anda valid.
            </p>
          </div>
        );
      case 'success':
        return (
          <div className={`${styles.verificationMessage} ${styles.success}`}>
            <AiOutlineCheckCircle className={styles.successIcon} />
            <h3 className={styles.cardTitle}>Verifikasi Berhasil!</h3>
            <p className={styles.cardDescription}>
              Usia Anda telah berhasil diverifikasi. Selamat berbelanja di {partnerName}!
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className={`${styles.verificationMessage} ${styles.failed}`}>
            <AiOutlineCloseCircle className={styles.failedIcon} />
            <h3 className={styles.cardTitle}>Verifikasi Gagal</h3>
            <p className={styles.cardDescription}>
              Kredensial Anda tidak ditemukan atau tidak valid. Silakan coba lagi.
            </p>
            <button onClick={handleConnect} className={styles.revalidateButton}>Validasi Ulang</button>
          </div>
        );
      case 'denied':
        return (
          <div className={`${styles.verificationMessage} ${styles.failed}`}>
            <AiOutlineCloseCircle className={styles.failedIcon} />
            <h3 className={styles.cardTitle}>Akses Ditolak</h3>
            <p className={styles.cardDescription}>
              Anda menolak untuk membagikan data. Silakan coba lagi jika Anda berubah pikiran.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <div className={styles.appLogo}><AiOutlineShoppingCart /></div>
        <h1 className={styles.appTitle}>{partnerName}</h1>
      </header>
      <main className={styles.appMainContent}>
        <div className={styles.simulasiCard}>
          {renderVerificationContent()}
        </div>
      </main>
      <footer className={styles.appFooter}>
        <p>Didukung oleh Aethelith Network</p>
      </footer>
      {showVerificationOptions && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Pilih Data Verifikasi</h3>
              <button onClick={() => {setShowVerificationOptions(false); setVerificationStatus('denied');}} className={styles.modalCloseButton}><AiOutlineCloseCircle /></button>
            </div>
            <p className={styles.modalDescription}>
              Untuk terhubung dengan {partnerName}, kami membutuhkan akses ke data berikut:
            </p>
            <ul className={styles.verificationList}>
                <li><AiOutlineCheckCircle className={styles.checkIcon}/> Status Usia (18+)</li>
            </ul>
            <div className={styles.modalActions}>
                <button onClick={() => {setShowVerificationOptions(false); setVerificationStatus('denied');}} className={styles.modalCancelButton}>
                    Tolak
                </button>
                <button onClick={handleStartVerification} className={styles.modalConfirmButton}>
                    Verifikasi Usia
                </button>
            </div>
          </div>
        </div>
      )}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Login ke Aethelith Network</h3>
              <button onClick={() => {setShowLoginModal(false); setVerificationStatus('denied');}} className={styles.modalCloseButton}><AiOutlineCloseCircle /></button>
            </div>
            <p className={styles.modalDescription}>
              Masukkan kredensial Aethelith Anda untuk membagikan data verifikasi.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleAethelithLogin(); }} className={styles.loginForm}>
                <input
                    type="email"
                    placeholder="Email Aethelith"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className={styles.loginInput}
                    required
                />
                <input
                    type="password"
                    placeholder="Kata Sandi Aethelith"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={styles.loginInput}
                    required
                />
                {loginError && <p className={styles.loginError}>{loginError}</p>}
                <button type="submit" className={styles.loginButton}>Login & Verifikasi</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}