// apps/web/src/app/mitra/app/exchange-b/dashboard/page.tsx
'use client';

import { AiOutlineSwap, AiOutlineCreditCard, AiOutlineHistory, AiOutlineHome, AiOutlineLogout } from 'react-icons/ai';
import Link from 'next/link';
import styles from './exchange-dashboard.module.css';

const portfolio = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', balance: '0.50', usdValue: '35,000.00' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', balance: '1.20', usdValue: '4,560.00' },
  { id: 3, name: 'Tether', symbol: 'USDT', balance: '5,000.00', usdValue: '5,000.00' },
];

const recentActivity = [
  { id: 1, type: 'Buy', asset: 'BTC', amount: '0.01', date: '25 Okt' },
  { id: 2, type: 'Sell', asset: 'ETH', amount: '0.50', date: '24 Okt' },
  { id: 3, type: 'Deposit', asset: 'USDT', amount: '1,000', date: '23 Okt' },
];

export default function ExchangeDashboardPage() {
  const totalBalance = portfolio.reduce((sum, asset) => sum + parseFloat(asset.usdValue.replace(/,/g, '')), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.userSection}>
            <h1 className={styles.greeting}>Selamat Datang, Budi!</h1>
            <p className={styles.accountHolder}>Total Saldo: <span className={styles.totalBalanceValue}>{totalBalance}</span></p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/" className={styles.headerButton}>
              <AiOutlineHome />
            </Link>
            <button className={styles.headerButton}>
              <AiOutlineLogout />
            </button>
          </div>
        </div>
      </header>

      <main className={styles.dashboardMainContent}>
        <div className={styles.contentGrid}>
          {/* Kolom Kiri */}
          <div className={styles.leftColumn}>
            <section className={styles.portfolioSection}>
              <h3 className={styles.sectionTitle}>Portofolio Aset</h3>
              <ul className={styles.portfolioList}>
                {portfolio.map(asset => (
                  <li key={asset.id} className={styles.portfolioItem}>
                    <div className={styles.assetInfo}>
                      <p className={styles.assetSymbol}>{asset.symbol}</p>
                      <span className={styles.assetName}>{asset.name}</span>
                    </div>
                    <div className={styles.assetValue}>
                      <p className={styles.assetBalance}>{asset.balance}</p>
                      <span className={styles.usdValue}>{asset.usdValue} USD</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Kolom Kanan */}
          <div className={styles.rightColumn}>
            <section className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>Performa Portofolio</h3>
              <div className={styles.chartPlaceholder}>
                <p>Grafik performa aset akan ditampilkan di sini.</p>
              </div>
            </section>
            
            <section className={styles.activitySection}>
              <h3 className={styles.sectionTitle}>Aktivitas Terkini</h3>
              <ul className={styles.activityList}>
                {recentActivity.map(activity => (
                  <li key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityTypeContainer}>
                      <span className={`${styles.activityType} ${activity.type === 'Buy' ? styles.buy : activity.type === 'Sell' ? styles.sell : styles.deposit}`}>
                        {activity.type}
                      </span>
                    </div>
                    <div className={styles.activityInfo}>
                      <p className={styles.activityDescription}>{activity.amount} {activity.asset}</p>
                      <span className={styles.activityDate}>{activity.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
