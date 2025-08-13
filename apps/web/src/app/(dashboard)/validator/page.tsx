// apps/web/src/app/validator/dashboard/page.tsx
'use client';

import { AiOutlineFileAdd, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading } from 'react-icons/ai';
import dashboardStyles from './validator-page.module.css';

// Komponen Card Statistik
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className={dashboardStyles.statCard}>
    <div className={dashboardStyles.statIcon}>{icon}</div>
    <div className={dashboardStyles.statInfo}>
      <p className={dashboardStyles.statTitle}>{title}</p>
      <h3 className={dashboardStyles.statValue}>{value}</h3>
    </div>
  </div>
);

// Komponen Dashboard Utama
export default function ValidatorDashboardPage() {
  // Data dummy untuk demo
  const stats = [
    { title: 'Total Diterbitkan', value: '1,250', icon: <AiOutlineFileAdd /> },
    { title: 'Kredensial Aktif', value: '1,120', icon: <AiOutlineCheckCircle /> },
    { title: 'Kredensial Dicabut', value: '130', icon: <AiOutlineCloseCircle /> },
    { title: 'Permintaan Tertunda', value: '15', icon: <AiOutlineLoading /> },
  ];

  const recentActivities = [
    { type: 'Penerbitan', subject: 'e5a3f12b...', credential: 'KYC Verified', date: '2025-07-28' },
    { type: 'Pencabutan', subject: 'f8c4d21a...', credential: 'Accredited Investor', date: '2025-07-27', reason: 'Kredensial kedaluwarsa' },
  ];

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <header className={dashboardStyles.dashboardHeader}>
        <h1 className={dashboardStyles.dashboardTitle}>Dashboard Validator</h1>
        <p className={dashboardStyles.dashboardDescription}>
          Ringkasan aktivitas dan status kredensial yang diterbitkan.
        </p>
      </header>

      <section className={dashboardStyles.section}>
        <div className={dashboardStyles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      <section className={dashboardStyles.section}>
        <h2 className={dashboardStyles.sectionTitle}>Aktivitas Terkini</h2>
        <ul className={dashboardStyles.activityList}>
          {recentActivities.map((activity, index) => (
            <li key={index} className={dashboardStyles.activityItem}>
              <span className={dashboardStyles.activityType}>{activity.type}</span>
              <span className={dashboardStyles.activitySubject}>Subjek: {activity.subject}</span>
              <span className={dashboardStyles.activityCredential}>Kredensial: {activity.credential}</span>
              {activity.type === 'Pencabutan' && (
                <span className={dashboardStyles.activityReason}>Alasan: {activity.reason}</span>
              )}
              <span className={dashboardStyles.activityDate}>{activity.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}