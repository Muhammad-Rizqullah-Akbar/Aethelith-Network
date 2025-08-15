'use client';

import Link from 'next/link';
import { AiOutlineTeam, AiOutlineIdcard, AiOutlineCheckCircle, AiOutlineLock } from 'react-icons/ai';
import { useState, useEffect, useCallback } from 'react';
import { FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  Auth,
  User,
  onAuthStateChanged,
  signOut,
  getAuth,
  // reauthenticateWithCredential, // Dihapus karena tidak digunakan
  // EmailAuthProvider // Dihapus karena tidak digunakan
} from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

import styles from './dashboard.module.css';

import { initializeApp } from 'firebase/app';

// Import fungsi dari lib/indexedDB
import { getDecryptedUserData, UserData as DecryptedUserDataInterface } from '../../../lib/indexedDB';
import AccessDenied from 'src/components/throwError/AccessDenied';

declare const __firebase_config: string;
declare const __app_id: string;

const firebaseConfig =
  typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const dummyPartners = [
  { name: 'Bank-A', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=B' },
  { name: 'Exchange-B', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=E' },
  { name: 'E-commerce-C', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=C' },
  { name: 'Dukcapil', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=P' }
];

const dummyValidationData = [
  { label: 'NIK', value: 'data terenkripsi' },
  { label: 'Nama Lengkap', value: 'data terenkripsi' },
  { label: 'Tanggal Lahir', value: 'data terenkripsi' }
];

export default function DashboardPage() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [accessPassword, setAccessPassword] = useState('');
  const [accessError, setAccessError] = useState('');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationComplete, setShowVerificationComplete] = useState(false);
  const [decryptedUserData, setDecryptedUserData] = useState<DecryptedUserDataInterface | null>(null);
  const [isLoadingDecryptedData, setIsLoadingDecryptedData] = useState(false);

  useEffect(() => {
    try {
      const app =
        getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setIsConnected(true);
        } else {
          setUser(null);
          setIsConnected(false);
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.error('Firebase initialization failed:', e);
      setIsConnected(false);
    }
  }, []);

  const handleShowData = useCallback(() => {
    if (showSensitiveData) {
      setShowSensitiveData(false);
      setDecryptedUserData(null);
    } else {
      setShowConsentModal(true);
    }
  }, [showSensitiveData]);

  const handleConfirmConsent = useCallback(() => {
    setShowConsentModal(false);
    setShowDataModal(true);
  }, []);

  const handleAccessData = useCallback(async () => {
    if (!user) {
      setAccessError('Tidak ada pengguna yang terautentikasi.');
      setIsLoadingDecryptedData(false);
      return;
    }

    setAccessError('');
    setIsLoadingDecryptedData(true);

    try {
      // Tidak perlu mendapatkan ID Token lagi. Cukup gunakan accessPassword langsung.
      const dataFromIndexedDB = await getDecryptedUserData(user.uid, accessPassword); // <-- Menggunakan accessPassword
      console.log("Data retrieved and decrypted from IndexedDB:", dataFromIndexedDB);

      if (dataFromIndexedDB) {
        setDecryptedUserData(dataFromIndexedDB);
        setShowSensitiveData(true);
        setShowDataModal(false);
        setAccessPassword('');
      } else {
        setAccessError('Data pengguna tidak ditemukan di penyimpanan lokal.');
      }
    } catch (error: any) {
      console.error('Decryption failed:', error);
      // Lebih spesifik menangani error dekripsi
      if (error.message.includes('Decryption failed')) {
        setAccessError('Kata sandi salah atau data rusak. Akses ditolak.');
      } else if (error.message.includes('Failed to open local database')) {
        setAccessError('Gagal mengakses penyimpanan lokal.');
      } else {
        setAccessError('Terjadi kesalahan saat mengakses data. Silakan coba lagi.');
      }
    } finally {
      setIsLoadingDecryptedData(false);
    }
  }, [user, accessPassword]);

  const handleStartValidation = useCallback(() => {
    setShowValidationModal(true);
  }, []);

  const handleValidate = useCallback(async () => {
    setIsVerifying(true);
    setShowValidationModal(false);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsVerifying(false);
    setShowVerificationComplete(true);
  }, []);

  const handleCloseVerificationComplete = useCallback(() => {
    setShowVerificationComplete(false);
  }, []);

  const handleLogout = useCallback(() => {
    if (auth) {
      signOut(auth).catch((e) => console.error('Logout failed:', e));
    }
  }, [auth]);

  if (!isConnected) {
    return (
      <AccessDenied /> 
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.dashboardDescription}>Pilih layanan yang ingin Anda gunakan.</p>
      </header>

      {/* Bagian Login sebagai Developer */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <AiOutlineTeam className={styles.sectionIcon} /> Login sebagai Developer
        </h2>
        <p className={styles.sectionDescription}>Masuk sebagai Validator atau Verifier untuk mengelola kredensial.</p>
        <div className={styles.cardGrid}>
          {/* Tombol yang mengarah ke halaman otentikasi developer untuk peran Validator */}
          <h3 className={styles.cardTitle}>Masuk sebagai Validator</h3>
          <p className={styles.cardDescription}>Verifikasi data dan terbitkan Verifiable Credentials.</p>
          <Link href="/dev-auth?role=validator" className={styles.actionCard}>
            <span className={styles.cardButton}>Login sebagai Validator</span>
          </Link>

          {/* Tombol yang mengarah ke halaman otentikasi developer untuk peran Verifier */}
          <h3 className={styles.cardTitle}>Masuk sebagai Verifier</h3>
          <p className={styles.cardDescription}>Akses bukti kredensial yang telah divalidasi.</p>
          <Link href="/dev-auth?role=verifier" className={styles.actionCard}>
            <span className={styles.cardButton}>Login sebagai Verifier</span>
          </Link>
        </div>
      </section>

      {/* Bagian Layanan Validator */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <AiOutlineIdcard className={styles.sectionIcon} /> Layanan Validasi
        </h2>
        <div className={styles.cardGrid}>
          <div className={styles.actionCard}>
            <h3 className={styles.cardTitle}>Verifikasi Kewarganegaraan</h3>
            <p className={styles.cardDescription}>Lakukan verifikasi identitas resmi dengan data kependudukan.</p>
            <button onClick={handleStartValidation} className={styles.cardButton}>
              Validasi Data
            </button>
          </div>
          <div className={styles.actionCard}>
            <h3 className={styles.cardTitle}>Verifikasi Sertifikat Vaksin</h3>
            <p className={styles.cardDescription}>Validasi status vaksinasi melalui kredensial digital.</p>
            <button onClick={handleStartValidation} className={styles.cardButton}>
              Validasi Data
            </button>
          </div>
        </div>
      </section>

      {/* Bagian Mitra */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <AiOutlineCheckCircle className={styles.sectionIcon} /> Mitra yang Terintegrasi
        </h2>
        <p className={styles.sectionDescription}>Platform yang sudah menggunakan layanan verifikasi kami.</p>
        <div className={styles.partnersGrid}>
          {dummyPartners.map((partner, index) => (
            <div key={index} className={styles.partnerCard}>
              <img src={partner.logo} alt={`${partner.name} logo`} className={styles.partnerLogo} />
              <p className={styles.partnerName}>{partner.name}</p>
              <Link href={`/app/${partner.name}`} className={styles.accessAppButton} target='_blank'>
                Akses App
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian Private Data Collection */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <AiOutlineLock className={styles.sectionIcon} /> Private Data Collection
        </h2>
        <p className={styles.sectionDescription}>
          Data sensitif Anda disimpan di sini. Klik tombol untuk melihatnya (demo).
        </p>
        <div className={styles.privateDataCard}>
          <h3 className={styles.cardTitle}>Data Identitas Terenkripsi</h3>
          <button onClick={handleShowData} className={styles.dataButton}>
            {showSensitiveData ? 'Sembunyikan Data' : 'Tampilkan Data'}
          </button>
          {showSensitiveData && decryptedUserData && (
            <div className={styles.dataDisplay}>
              <p><strong>Nama Lengkap:</strong> {decryptedUserData.fullName}</p>
              <p><strong>NIK:</strong> {decryptedUserData.nik}</p>
              <p><strong>Alamat:</strong> {decryptedUserData.alamat}</p>
              <p><strong>Tanggal Lahir:</strong> {decryptedUserData.tanggalLahir}</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal Konfirmasi */}
      {showConsentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Konfirmasi Akses</h3>
            <p className={styles.modalText}>
              Anda akan melihat data sensitif yang tersimpan di Private Data Collection.
              Pastikan Anda berada di lingkungan yang aman. Lanjutkan?
            </p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowConsentModal(false)} className={styles.modalCancelButton}>Batal</button>
              <button onClick={handleConfirmConsent} className={styles.modalConfirmButton}>Lanjutkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Password */}
      {showDataModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Verifikasi Identitas</h3>
            <p className={styles.modalText}>
              Masukkan kata sandi Anda untuk mendekripsi dan menampilkan data.
            </p>
            <input
              type="password"
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              className={styles.modalInput}
              placeholder="Kata Sandi"
              required
            />
            {accessError && <p className={styles.modalError}>{accessError}</p>}
            <div className={styles.modalActions}>
              <button onClick={() => setShowDataModal(false)} className={styles.modalCancelButton}>Batal</button>
              <button onClick={handleAccessData} className={styles.modalConfirmButton}>Akses</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Validasi Data */}
      {showValidationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Validasi Data</h3>
            <p className={styles.modalText}>
              Layanan Validator akan memeriksa data berikut ini:
            </p>
            <ul className={styles.validationList}>
              {dummyValidationData.map((data, index) => (
                <li key={index}><strong>{data.label}:</strong> {data.value}</li>
              ))}
            </ul>
            <div className={styles.modalActions}>
              <button onClick={() => setShowValidationModal(false)} className={styles.modalCancelButton}>Batal</button>
              <button onClick={handleValidate} className={styles.modalConfirmButton}>Validasi</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Loading Validasi */}
      {isVerifying && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Proses Validasi</h3>
            <p className={styles.modalText}>Harap menunggu, data Anda sedang dalam proses validasi.</p>
            <div className={styles.loadingSpinner} />
            <button onClick={() => setIsVerifying(false)} className={styles.modalCancelButton}>Batal</button>
          </div>
        </div>
      )}

      {/* Modal Verifikasi Selesai */}
      {showVerificationComplete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Verifikasi Selesai</h3>
            <p className={styles.modalText}>
              Selamat! Data Anda telah terverifikasi di jaringan Aethelith. Anda telah mendapatkan kredensial baru.
            </p>
            <div className={styles.verificationResult}>
              <p><strong>Issuer:</strong> Pemerintah X</p>
              <p><strong>Credential ID:</strong> 0x123abc...</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleCloseVerificationComplete} className={styles.modalConfirmButton}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
