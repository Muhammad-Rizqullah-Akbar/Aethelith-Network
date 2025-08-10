'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineIdcard, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheckCircle, AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import { useAuth } from '../../components/layout/AuthProvider';
import styles from './dashboard.module.css';

// Data dummy untuk demo
const dummyPartners = [
  { name: 'Bank A', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=B' },
  { name: 'Exchange B', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=E' },
  { name: 'E-commerce C', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=C' },
  { name: 'Pemerintah X', logo: 'https://placehold.co/48x48/0d0e12/ffffff?text=P' },
];

export default function DashboardPage() {
  const { isConnected } = useAuth();
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [accessPassword, setAccessPassword] = useState('');
  const [accessError, setAccessError] = useState('');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationComplete, setShowVerificationComplete] = useState(false);

  const dummyUserData = {
    fullName: "Pengguna Anonim",
    nik: "1234567890123456",
    alamat: "Jl. Merdeka No. 17",
    tanggalLahir: "1990-01-01",
    email: "user@example.com",
  };

  const dummyValidationData = [
    { label: 'NIK', value: dummyUserData.nik },
    { label: 'Nama Lengkap', value: dummyUserData.fullName },
    { label: 'Tanggal Lahir', value: dummyUserData.tanggalLahir },
  ];

  const handleShowData = () => {
    if (showSensitiveData) {
      setShowSensitiveData(false);
    } else {
      setShowConsentModal(true);
    }
  };

  const handleConfirmConsent = () => {
    setShowConsentModal(false);
    setShowDataModal(true);
  };

  const handleAccessData = () => {
    if (accessPassword === '123456') { // Password dummy untuk demo
      setShowSensitiveData(true);
      setShowDataModal(false);
      setAccessError('');
    } else {
      setAccessError('Kata sandi salah. Akses ditolak.');
    }
  };

  const handleStartValidation = () => {
    setShowValidationModal(true);
  };
  
  const handleValidate = async () => {
    setIsVerifying(true);
    setShowValidationModal(false);
    
    // Simulasi proses validasi
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsVerifying(false);
    setShowVerificationComplete(true);
  };

  const handleCloseVerificationComplete = () => {
    setShowVerificationComplete(false);
  };


  if (!isConnected) {
    return (
      <div className={styles.accessDeniedContainer}>
        <h1 className={styles.accessDeniedTitle}>Akses Ditolak</h1>
        <p className={styles.accessDeniedDescription}>Untuk mengakses dashboard, Anda perlu login.</p>
        <Link href="/login" className={styles.loginButton}>Login</Link>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.dashboardDescription}>Pilih layanan yang ingin Anda gunakan.</p>
      </header>

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
              <Link href={`/mitra/app/${partner.name.toLowerCase().replace(/\s/g, '')}`} className={styles.accessAppButton}>
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
          {showSensitiveData && (
            <div className={styles.dataDisplay}>
              <p><strong>Nama Lengkap:</strong> {dummyUserData.fullName}</p>
              <p><strong>NIK:</strong> {dummyUserData.nik}</p>
              <p><strong>Alamat:</strong> {dummyUserData.alamat}</p>
              <p><strong>Tanggal Lahir:</strong> {dummyUserData.tanggalLahir}</p>
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
