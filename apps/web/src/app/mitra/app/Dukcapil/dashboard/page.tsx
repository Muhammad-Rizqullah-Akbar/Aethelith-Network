// apps/web/src/app/mitra/app/pemerintah-x/dashboard/page.tsx
'use client';

import { AiOutlineFileSearch, AiOutlineFileDone, AiOutlineIdcard, AiOutlineHome, AiOutlineLogout } from 'react-icons/ai';
import Link from 'next/link';
import styles from './pemerintah-dashboard.module.css';

const populationData = {
  total: '278.7 Juta',
  verified: '250.1 Juta',
  pending: '2.5 Juta',
};

const recentVerification = [
  { id: 1, type: 'Pencatatan Kelahiran', status: 'Selesai', date: '25 Okt' },
  { id: 2, type: 'Pembaruan Alamat', status: 'Selesai', date: '24 Okt' },
  { id: 3, type: 'Verifikasi NIK', status: 'Tertunda', date: '23 Okt' },
  { id: 4, type: 'Penerbitan KTP', status: 'Selesai', date: '23 Okt' },
];

export default function PemerintahDashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div className={styles.userSection}>
          <h1 className={styles.greeting}>Layanan Administrasi Publik</h1>
          <p className={styles.accountHolder}>Selamat datang di Dashboard Dukcapil</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.cardLabel}>Total Penduduk Terdata</p>
          <h2 className={styles.cardValue}>{populationData.total}</h2>
          <p className={styles.cardSubText}>Data per 2025</p>
        </div>
      </header>

      <main className={styles.dashboardMainContent}>
        <section className={styles.actionsSection}>
          <div className={styles.actionButton}>
            <AiOutlineFileSearch className={styles.actionIcon} />
            <p className={styles.actionLabel}>Cek Status Dokumen</p>
          </div>
          <div className={styles.actionButton}>
            <AiOutlineIdcard className={styles.actionIcon} />
            <p className={styles.actionLabel}>Pencatatan Baru</p>
          </div>
          <div className={styles.actionButton}>
            <AiOutlineFileDone className={styles.actionIcon} />
            <p className={styles.actionLabel}>Verifikasi Digital</p>
          </div>
        </section>

        <section className={styles.verificationsSection}>
          <h3 className={styles.sectionTitle}>Aktivitas Verifikasi Terkini</h3>
          <ul className={styles.verificationList}>
            {recentVerification.map(verif => (
              <li key={verif.id} className={styles.verificationItem}>
                <div className={styles.verificationInfo}>
                  <p className={styles.verificationDescription}>{verif.type}</p>
                  <span className={styles.verificationDate}>{verif.date}</span>
                </div>
                <span className={`${styles.verificationStatus} ${verif.status === 'Selesai' ? styles.statusSuccess : styles.statusPending}`}>
                  {verif.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className={styles.dashboardFooter}>
        <Link href="/" className={styles.footerLink}>
          <AiOutlineHome />
          <span>Beranda</span>
        </Link>
        <button className={styles.footerButton}>
          <AiOutlineLogout />
          <span>Keluar</span>
        </button>
      </footer>
    </div>
  );
}
