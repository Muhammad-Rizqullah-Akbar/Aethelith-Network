// components/AuthLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineUser, AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import { IoIosCalendar } from "react-icons/io";
import { HiOutlineIdentification, HiOutlineMapPin } from "react-icons/hi2";
import styles from './AuthLayout.module.css';
import { useAuthLogic } from '../hooks/useAuthLogic';

interface AuthLayoutProps {
  type: 'login' | 'register';
}

export default function AuthLayout({ type }: AuthLayoutProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { loading, error, handleLogin, handleRegister, setError } = useAuthLogic();
  const isLogin = type === 'login';

  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect untuk mengecek query param 'registered' saat komponen mount atau searchParams berubah
  useEffect(() => {
    if (isLogin) {
      const registered = searchParams.get('registered');
      if (registered === 'true') {
        setShowSuccessMessage(true);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('registered');
        router.replace(`/login?${newSearchParams.toString()}`, { scroll: false });
      }
    }
  }, [isLogin, searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccessMessage(false);

    if (isLogin) {
      await handleLogin(email, password); // Pastikan handleLogin juga await
    } else {
      // Konsolidasi data pengguna ke dalam satu objek sebelum dikirim ke hook
      const userData = {
        name: name,
        nik: nik,
        alamat: alamat,
        tanggalLahir: tanggalLahir,
      };
      await handleRegister(email, password, userData);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authCardTitle}>
          {isLogin ? 'Selamat Datang' : 'Bergabunglah dengan Kami'}
        </h1>
        <p className={styles.authCardDescription}>
          {isLogin ?
            'Silakan masuk ke akun Anda untuk melanjutkan.' :
            'Buat akun baru untuk memulai perjalanan Anda.'
          }
        </p>
        {/* Notifikasi Sukses */}
        {showSuccessMessage && isLogin && (
          <div className={styles.successMessage}>
            Akun Anda berhasil didaftarkan! Silakan masuk. 🎉
          </div>
        )}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.authForm}>
          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.inputLabel}>Nama Lengkap</label>
                <div className={styles.inputWrapper}>
                  <AiOutlineUser className={styles.inputIcon} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="nik" className={styles.inputLabel}>Nomor Induk Kependudukan (NIK)</label>
                <div className={styles.inputWrapper}>
                  <HiOutlineIdentification className={styles.inputIcon} />
                  <input
                    id="nik"
                    name="nik"
                    type="text"
                    placeholder="Nomor Induk Kependudukan (NIK)"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="alamat" className={styles.inputLabel}>Alamat</label>
                <div className={styles.inputWrapper}>
                  <HiOutlineMapPin className={styles.inputIcon} />
                  <input
                    id="alamat"
                    name="alamat"
                    type="text"
                    placeholder="Alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="tanggalLahir" className={styles.inputLabel}>Tanggal Lahir</label>
                <div className={styles.inputWrapper}>
                  <IoIosCalendar className={styles.inputIcon} />
                  <input
                    id="tanggalLahir"
                    name="tanggalLahir"
                    type="date"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>Alamat Email</label>
            <div className={styles.inputWrapper}>
              <AiOutlineMail className={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>Kata Sandi</label>
            <div className={styles.inputWrapper}>
              <AiOutlineLock className={styles.inputIcon} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Memproses...' : (isLogin ? 'Login' : 'Daftar Sekarang')}
          </button>
        </form>
        <p className={styles.toggleLink}>
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <Link href={isLogin ? '/register' : '/login'}>
            <span className={styles.linkText}>
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}