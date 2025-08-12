// apps/web/src/app/mitra/app/exchange-b/page.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineLock, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters, AiOutlineStock, AiOutlineUser, AiOutlineIdcard, AiOutlineCamera, AiOutlineClose } from 'react-icons/ai';
import styles from './mitra-app-exchange-b.module.css';

const partnerName = 'Exchange B';

export default function MitraAppPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'requesting' | 'verifying' | 'success' | 'failed' | 'denied' | 'kyc-form' | 'scan-ktp' | 'scan-wajah'>('idle');
  const [showVerificationOptions, setShowVerificationOptions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [kycName, setKycName] = useState('');
  const [kycNIK, setKycNIK] = useState('');
  const [kycError, setKycError] = useState('');

  const [ktpPhoto, setKtpPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Menghapus baris yang membuka tab baru karena ini halaman verifikasi
    // window.open('/validator/dashboard', '_blank');
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera: ", err);
      setVerificationStatus('failed');
      setKycError('Gagal mengakses kamera. Mohon berikan izin akses.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const handleConnect = useCallback(() => {
    setShowVerificationOptions(true);
  }, []);

  const handleStartRegularKyc = useCallback(() => {
    setVerificationStatus('kyc-form');
  }, []);

  const handleKycFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setKycError('');
    if (kycName && kycNIK) {
      setVerificationStatus('scan-ktp');
    } else {
      setKycError('Nama dan NIK harus diisi.');
    }
  }, [kycName, kycNIK]);

  const handleKtpPhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPhoto(reader.result as string);
        setVerificationStatus('scan-wajah');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCaptureSelfie = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photo = canvas.toDataURL('image/jpeg');
        setSelfiePhoto(photo);
        stopCamera();

        setVerificationStatus('requesting');
        setTimeout(() => {
          setVerificationStatus('verifying');
          setTimeout(() => {
            setVerificationStatus('success');
            setTimeout(() => {
              router.push('/mitra/app/exchange-b/dashboard');
            }, 2000);
          }, 2000);
        }, 1500);
      }
    }
  }, [router, stopCamera]);
  
  const handleStartAethelithVerification = useCallback(() => {
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
          // Skenario gagal: verifikasi exchange selalu gagal karena kredensial tidak valid
          setVerificationStatus('failed'); 
        }, 2000);
      }, 1500);
    } else {
      setLoginError('Kredensial Aethelith tidak valid.');
    }
  }, [loginUsername, loginPassword, router]);

  const handleCloseModal = useCallback(() => {
    setShowVerificationOptions(false);
    setShowLoginModal(false);
    setVerificationStatus('denied');
  }, []);

  const renderVerificationContent = () => {
    switch (verificationStatus) {
      case 'idle':
        return (
          <>
            <h3 className={styles.cardTitle}>Verifikasi Akun</h3>
            <p className={styles.cardDescription}>
              Untuk memulai trading, kami memerlukan verifikasi identitas dan lisensi profesional.
            </p>
            <div className={styles.verificationMethodGrid}>
              <button onClick={handleStartRegularKyc} className={styles.regularKycButton}>
                Lakukan Verifikasi Biasa
              </button>
              <button onClick={handleConnect} className={styles.connectButton}>
                Connect with Aethelith
              </button>
            </div>
          </>
        );
      case 'kyc-form':
        return (
          <div className={styles.regularKycForm}>
            <h3 className={styles.cardTitle}>Verifikasi Biasa</h3>
            <p className={styles.cardDescription}>
              Isi data berikut untuk melanjutkan verifikasi.
            </p>
            <form onSubmit={handleKycFormSubmit} className={styles.kycForm}>
              <div className={styles.kycInputGroup}>
                <label htmlFor="kycName">Nama Lengkap</label>
                <input
                  type="text"
                  id="kycName"
                  value={kycName}
                  onChange={(e) => setKycName(e.target.value)}
                  className={styles.kycInput}
                  required
                />
              </div>
              <div className={styles.kycInputGroup}>
                <label htmlFor="kycNIK">Nomor Induk Kependudukan (NIK)</label>
                <input
                  type="text"
                  id="kycNIK"
                  value={kycNIK}
                  onChange={(e) => setKycNIK(e.target.value)}
                  className={styles.kycInput}
                  required
                />
              </div>
              {kycError && <p className={styles.kycError}>{kycError}</p>}
              <button type="submit" className={styles.kycSubmitButton}>Lanjut ke Foto KTP</button>
            </form>
          </div>
        );
      case 'scan-ktp':
        return (
          <div className={styles.regularKycForm}>
            <h3 className={styles.cardTitle}>Upload Foto KTP</h3>
            <p className={styles.cardDescription}>
              Pastikan foto KTP Anda terlihat jelas dan tidak buram.
            </p>
            <div className={styles.uploadBox}>
              {ktpPhoto ? (
                <img src={ktpPhoto} alt="Foto KTP" className={styles.uploadedImage} />
              ) : (
                <>
                  <label htmlFor="ktp-upload" className={styles.uploadLabel}>
                    <AiOutlineIdcard className={styles.uploadIcon} />
                    <span>Klik untuk upload foto KTP</span>
                  </label>
                  <input
                    id="ktp-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleKtpPhotoUpload}
                    className={styles.fileInput}
                  />
                </>
              )}
            </div>
            {ktpPhoto && (
              <button onClick={() => setVerificationStatus('scan-wajah')} className={styles.kycSubmitButton}>
                Lanjut ke Scan Wajah
              </button>
            )}
          </div>
        );
      case 'scan-wajah':
        return (
          <div className={styles.regularKycForm}>
            <h3 className={styles.cardTitle}>Scan Wajah</h3>
            <p className={styles.cardDescription}>
              Posisikan wajah Anda di dalam bingkai yang tersedia.
            </p>
            <div className={styles.uploadBox}>
              {!selfiePhoto && !isCameraActive && (
                  <button onClick={startCamera} className={styles.cameraButton}>
                    <AiOutlineCamera /> Aktifkan Kamera
                  </button>
              )}
              {isCameraActive && !selfiePhoto && (
                <video ref={videoRef} autoPlay playsInline className={styles.cameraFeed} />
              )}
              {selfiePhoto && (
                <img src={selfiePhoto} alt="Foto Wajah" className={styles.uploadedImage} />
              )}
            </div>
            {isCameraActive && !selfiePhoto && (
              <button onClick={handleCaptureSelfie} className={styles.kycSubmitButton}>
                Ambil Foto
              </button>
            )}
            {selfiePhoto && (
              <button onClick={() => setVerificationStatus('failed')} className={styles.kycSubmitButton}>
                Lanjut Verifikasi
              </button>
            )}
          </div>
        );
      case 'requesting':
        return (
          <div className={styles.verificationMessage}>
            <AiOutlineLoading3Quarters className={`${styles.loadingSpinner} ${styles.spinner}`} />
            <h3 className={styles.cardTitle}>Memproses Verifikasi...</h3>
            <p className={styles.cardDescription}>
              Kami sedang memproses data Anda.
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
              Identitas Anda telah berhasil diverifikasi. Anda akan dialihkan secara otomatis.
            </p>
            <div className={styles.loadingSpinnerSmall} />
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
            <button onClick={() => setVerificationStatus('idle')} className={styles.revalidateButton}>Validasi Ulang</button>
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
        <div className={styles.appLogo}><AiOutlineStock /></div>
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
              <button onClick={handleCloseModal} className={styles.modalCloseButton}><AiOutlineCloseCircle /></button>
            </div>
            <p className={styles.modalDescription}>
              Untuk terhubung dengan {partnerName}, kami membutuhkan akses ke data berikut:
            </p>
            <ul className={styles.verificationList}>
                <li><AiOutlineCheckCircle className={styles.checkIcon}/> Nama Lengkap</li>
                <li><AiOutlineCheckCircle className={styles.checkIcon}/> Nomor Induk Kependudukan (NIK)</li>
                <li><AiOutlineCheckCircle className={styles.checkIcon}/> Sertifikasi Profesi</li>
            </ul>
            <div className={styles.modalActions}>
                <button onClick={handleCloseModal} className={styles.modalCancelButton}>
                    Tolak
                </button>
                <button onClick={handleStartAethelithVerification} className={styles.modalConfirmButton}>
                    Verifikasi Akun
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
              <button onClick={handleCloseModal} className={styles.modalCloseButton}><AiOutlineCloseCircle /></button>
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
