"use client";

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.homePageBackground}>
      <div className={styles.homePageContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Aethelith Network</h1>
          <p className={styles.heroDescription}>
            The Identity Virtual Machine
          </p>
          <div className={styles.heroButtons}>
            <Link href="/login" className={styles.primaryButton}>
              Login
            </Link>
            <Link href="/register" className={styles.secondaryButton}>
              Developers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
