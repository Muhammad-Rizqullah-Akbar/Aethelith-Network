// apps/web/src/app/mitra/app/pemerintah-x/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineLock, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters, AiOutlineFileProtect } from 'react-icons/ai';
import styles from './mitra-app-pemerintah-x.module.css';

const partnerName = 'Pemerintah X';

export default function MitraAppPage() {
  const router = useRouter();
  const isConnectedToAethelith = true;

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'requesting' | 'verifying' | 'success' | 'failed' | 'denied' | 'status-check'>('idle');
  const [showVerificationOptions, setShowVerificationOptions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [credentialStatus, setCredentialStatus] = useState<'active' | 'revoked'>('active');



  const handleConnect = useCallback(() => {
    setShowVerificationOptions(true);
  }, []);

  const handleStatusCheck = useCallback(() => {
    setVerificationStatus('status-check');
    setTimeout(() => {
      // Simulasikan status kredensial
      const isCredentialActive = Math.random() > 0.5; // 50% kemungkinan sukses
      setCredentialStatus(isCredentialActive ? 'active' : 'revoked');
      setTimeout(() => {
        if (isCredentialActive) {
          setShowVerificationOptions(true);
        } else {
          setVerificationStatus('failed');
        }
      }, 1000);
    }, 1500);
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
          setVerificationStatus('success');
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
            <h3 className={styles.cardTitle}>Verifikasi Lisensi</h3>
            <p className={styles.cardDescription}>
              Validasi status lisensi profesional Anda di layanan publik ini.
            </p>
            <button onClick={handleStatusCheck} className={styles.connectButton}>
              Verifikasi Lisensi
            </button>
          </>
        );
      case 'status-check':
        return (
          <div className={styles.verificationMessage}>
            <AiOutlineLoading3Quarters className={`${styles.loadingSpinner} ${styles.spinner}`} />
            <h3 className={styles.cardTitle}>Memeriksa Status Lisensi...</h3>
            <p className={styles.cardDescription}>
              Kami sedang memeriksa status kredensial lisensi Anda di blockchain.
            </p>
          </div>
        );
      case 'requesting':
        return (
          <div className={styles.verificationMessage}>
            <AiOutlineLoading3Quarters className={`${styles.loadingSpinner} ${styles.spinner}`} />
            <h3 className={styles.cardTitle}>Meminta Kredensial Lisensi...</h3>
            <p className={styles.cardDescription}>
              Kami sedang meminta kredensial lisensi dari Aethelith Network.
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
              Status lisensi Anda telah berhasil divalidasi.
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className={`${styles.verificationMessage} ${styles.failed}`}>
            <AiOutlineCloseCircle className={styles.failedIcon} />
            <h3 className={styles.cardTitle}>Verifikasi Gagal</h3>
            <p className={styles.cardDescription}>
              Status lisensi Anda **{credentialStatus === 'revoked' ? 'sudah dicabut' : 'tidak valid'}.** Silakan periksa kredensial Anda.
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
        <div className={styles.appLogo}><AiOutlineFileProtect /></div>
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
                <li><AiOutlineCheckCircle className={styles.checkIcon}/> Nomor Lisensi Profesional</li>
                <li><AiOutlineCheckCircle className={styles.checkIcon}/> Status Lisensi</li>
            </ul>
            <div className={styles.modalActions}>
                <button onClick={() => {setShowVerificationOptions(false); setVerificationStatus('denied');}} className={styles.modalCancelButton}>
                    Tolak
                </button>
                <button onClick={handleStartVerification} className={styles.modalConfirmButton}>
                    Verifikasi Lisensi
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