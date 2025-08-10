// apps/web/src/app/holder/my-vcs/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Impor useState dan useEffect
import { AiOutlineIdcard, AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import styles from './my-vcs.module.css';
import dashboardStyles from '../dashboard/dashboard.module.css';

// --- Definisi Tipe Data ---
interface VcCardProps {
  id: number;
  title: string;
  status: 'Active' | 'Revoked';
  issuer: string;
  issueDate: string;
  description: string;
}

// Komponen Card VC
const VcCard = ({ id, title, status, issuer, issueDate, description }: VcCardProps) => (
  <div className={styles.vcCard}>
    <div className={styles.vcHeader}>
      <div className={styles.vcIcon}>
        {status === 'Active' ? <AiOutlineCheckCircle style={{ color: 'var(--accent-color-start)' }} /> : <AiOutlineInfoCircle style={{ color: '#FCD34D' }} />}
      </div>
      <div className={styles.vcInfo}>
        <h3 className={styles.vcTitle}>{title}</h3>
        <p className={styles.vcIssuer}>Issued by: {issuer}</p>
      </div>
    </div>
    <p className={styles.vcDescription}>{description}</p>
    <div className={styles.vcFooter}>
      <span className={`${styles.vcStatus} ${styles[`vcStatus-${status.toLowerCase()}`]}`}>{status}</span>
      <span className={styles.vcIssueDate}>Issued on: {issueDate}</span>
    </div>
  </div>
);

export default function MyVcsPage() {
  // Gunakan state lokal untuk mensimulasikan status otentikasi
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Gunakan useEffect untuk mensimulasikan proses otentikasi
  useEffect(() => {
    // Di sini Anda bisa mengintegrasikan Firebase Auth atau sistem lainnya
    // Contoh: const user = firebase.auth().currentUser;
    // setIsAuthenticated(!!user);

    // Untuk demo, kita asumsikan pengguna selalu terotentikasi
    setIsAuthenticated(true);
  }, []);

  const dummyVCs: VcCardProps[] = [
    { id: 1, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-07-21', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
    { id: 2, title: 'Accredited Investor', status: 'Revoked', issuer: 'Issuer Beta', issueDate: '2025-07-15', description: 'This credential certifies you as an accredited investor.' },
    { id: 3, title: 'Age Verified (18+)', status: 'Active', issuer: 'Issuer Gamma', issueDate: '2025-07-10', description: 'This credential verifies that you are above 18 years of age.' },
    { id: 4, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-07-05', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
    { id: 5, title: 'Accredited Investor', status: 'Active', issuer: 'Issuer Beta', issueDate: '2025-06-28', description: 'This credential certifies you as an accredited investor.' },
    { id: 6, title: 'Age Verified (18+)', status: 'Active', issuer: 'Issuer Gamma', issueDate: '2025-06-25', description: 'This credential verifies that you are above 18 years of age.' },
    { id: 7, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-06-20', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
    { id: 8, title: 'Accredited Investor', status: 'Revoked', issuer: 'Issuer Beta', issueDate: '2025-06-18', description: 'This credential certifies you as an accredited investor.' },
    { id: 9, title: 'Age Verified (18+)', status: 'Active', issuer: 'Issuer Gamma', issueDate: '2025-06-12', description: 'This credential verifies that you are above 18 years of age.' },
    { id: 10, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-06-08', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
  ];

  if (!isAuthenticated) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <div className={dashboardStyles.dashboardHeader}>
          <h1 className={dashboardStyles.dashboardTitle}>Anda Belum Terotentikasi</h1>
          <p className={dashboardStyles.dashboardDescription}>Silakan login untuk melihat Verifiable Credentials Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <header className={dashboardStyles.dashboardHeader}>
        <h1 className={dashboardStyles.dashboardTitle}>Verifiable Credentials (VCs) Anda</h1>
        <p className={dashboardStyles.dashboardDescription}>
          Berikut adalah daftar Verifiable Credentials yang telah Anda terima.
        </p>
      </header>

      <section className={dashboardStyles.section}>
        <h2 className={dashboardStyles.sectionTitle}>
          <AiOutlineIdcard className={dashboardStyles.sectionIcon} /> Daftar VCs
        </h2>
        <div className={styles.vcGrid}>
          {dummyVCs.map(vc => (
            <VcCard
              key={vc.id}
              id={vc.id}
              title={vc.title}
              status={vc.status}
              issuer={vc.issuer}
              issueDate={vc.issueDate}
              description={vc.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}