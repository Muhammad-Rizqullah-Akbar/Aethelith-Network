// apps/web/src/app/mitra/app/bank-a/dashboard/page.tsx
'use client';

import { AiOutlineSwap, AiOutlineCreditCard, AiOutlineHistory, AiOutlineHome, AiOutlineLogout } from 'react-icons/ai';
import Link from 'next/link';
import styles from './bank-dashboard.module.css';

const accountBalance = 'Rp 12.345.678';

const transactions = [
  { id: 1, type: 'Debit', description: 'Pembayaran Listrik', amount: 'Rp 250.000', date: '25 Okt' },
  { id: 2, type: 'Credit', description: 'Gaji Bulanan', amount: 'Rp 10.000.000', date: '25 Okt' },
  { id: 3, type: 'Debit', description: 'Belanja Bulanan', amount: 'Rp 1.500.000', date: '24 Okt' },
  { id: 4, type: 'Debit', description: 'Transfer ke Rekening B', amount: 'Rp 500.000', date: '23 Okt' },
];

export default function BankDashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div className={styles.userSection}>
          <h1 className={styles.greeting}>Selamat Datang, Budi!</h1>
          <p className={styles.accountHolder}>Pemilik Akun</p>
        </div>
        <div className={styles.accountCard}>
          <p className={styles.cardLabel}>Saldo Rekening</p>
          <h2 className={styles.cardBalance}>{accountBalance}</h2>
          <p className={styles.cardNumber}>**** **** **** 1234</p>
        </div>
      </header>

      <main className={styles.dashboardMainContent}>
        <section className={styles.actionsSection}>
          <div className={styles.actionButton}>
            <AiOutlineSwap className={styles.actionIcon} />
            <p className={styles.actionLabel}>Transfer</p>
          </div>
          <div className={styles.actionButton}>
            <AiOutlineCreditCard className={styles.actionIcon} />
            <p className={styles.actionLabel}>Bayar</p>
          </div>
          <div className={styles.actionButton}>
            <AiOutlineHistory className={styles.actionIcon} />
            <p className={styles.actionLabel}>Riwayat</p>
          </div>
        </section>

        <section className={styles.transactionsSection}>
          <h3 className={styles.sectionTitle}>Riwayat Transaksi</h3>
          <ul className={styles.transactionList}>
            {transactions.map(tx => (
              <li key={tx.id} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <p className={styles.transactionDescription}>{tx.description}</p>
                  <span className={styles.transactionDate}>{tx.date}</span>
                </div>
                <span className={`${styles.transactionAmount} ${tx.type === 'Credit' ? styles.credit : styles.debit}`}>
                  {tx.type === 'Credit' ? '+' : '-'} {tx.amount}
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
