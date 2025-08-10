'use client';

import Link from 'next/link';
import styles from './AccessDenied.module.css';

export default function AccessDenied() {
  return (
    <div className={styles.accessDeniedContainer}>
      <h1 className={styles.title}>Akses Ditolak</h1>
      <p className={styles.description}>
        Anda perlu masuk terlebih dahulu untuk mengakses konten ini.
        <br />
        Silakan gunakan akun Anda untuk melanjutkan.
      </p>
      <Link href="/login" className={styles.loginButton}>
        Login
      </Link>
    </div>
  );
}
