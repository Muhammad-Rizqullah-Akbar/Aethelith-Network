// components/AuthLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State untuk notifikasi

  const { loading, error, handleLogin, handleRegister, setError } = useAuthLogic();
  const isLogin = type === 'login';

  const searchParams = useSearchParams(); // Dapatkan search params
  const router = useRouter(); // Dapatkan router untuk manipulasi URL

  // Efek untuk mengecek query param 'registered' saat komponen mount atau searchParams berubah
  useEffect(() => {
    if (isLogin) { // Hanya cek di halaman login
      const registered = searchParams.get('registered');
      if (registered === 'true') {
        setShowSuccessMessage(true);
        // Opsional: Hapus query param setelah ditampilkan
        // Ini akan membersihkan URL tanpa reload halaman
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('registered');
        router.replace(`/login?${newSearchParams.toString()}`, { scroll: false }); // Gunakan replace agar tidak menambah history
      }
    }
  }, [isLogin, searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccessMessage(false); // Reset notifikasi saat submit

    if (isLogin) {
      handleLogin(email, password);
    } else {
      // Panggil handleRegister dan biarkan hook menangani redirect
      await handleRegister(email, password, name, nik, alamat, tanggalLahir);
      // Notifikasi akan ditangani oleh redirect dengan query param di useEffect halaman login
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
          <div className={styles.successMessage}> {/* Anda perlu mendefinisikan styles.successMessage di CSS Anda */}
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