// apps/web/src/app/mitra/app/e-commerce-c/dashboard/page.tsx
'use client';

import { AiOutlineShoppingCart, AiOutlineCreditCard, AiOutlineBell, AiOutlineHome, AiOutlineLogout, AiOutlineClockCircle } from 'react-icons/ai';
import Link from 'next/link';
import styles from './e-commerce-dashboard.module.css';

const accountBalance = 'Rp 500.000';

const recentOrders = [
  { id: 1, product: 'Smartphone X', status: 'Shipped', date: '25 Okt', amount: 'Rp 4.500.000' },
  { id: 2, product: 'Headphones Pro', status: 'Delivered', date: '24 Okt', amount: 'Rp 1.200.000' },
  { id: 3, product: 'Laptop Stand', status: 'Processing', date: '23 Okt', amount: 'Rp 250.000' },
];

const notifications = [
  { id: 1, message: 'Selamat datang kembali, Budi!', date: '25 Okt' },
  { id: 2, message: 'Pesanan #1234 telah dikirim.', date: '25 Okt' },
  { id: 3, message: 'Dapatkan diskon 20% untuk produk elektronik!', date: '24 Okt' },
];

export default function EcommerceDashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.userSection}>
            <h1 className={styles.greeting}>Selamat Datang, Budi!</h1>
            <p className={styles.accountHolder}>Siap untuk menemukan produk impian Anda?</p>
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
          {/* Bagian Kolom Kiri */}
          <div className={styles.leftColumn}>
            {/* Kartu Saldo */}
            <div className={styles.balanceCard}>
              <p className={styles.cardLabel}>Saldo E-Wallet Anda</p>
              <h2 className={styles.cardBalance}>{accountBalance}</h2>
              <div className={styles.balanceCardFooter}>
                <button className={styles.actionButton}>
                  <AiOutlineCreditCard className={styles.actionIcon} />
                  <span className={styles.actionLabel}>Top Up Saldo</span>
                </button>
                <button className={styles.actionButton}>
                  <AiOutlineShoppingCart className={styles.actionIcon} />
                  <span className={styles.actionLabel}>Belanja</span>
                </button>
              </div>
            </div>

            {/* Bagian Notifikasi */}
            <section className={styles.notificationsSection}>
              <h3 className={styles.sectionTitle}>
                <AiOutlineBell className={styles.sectionIcon} /> Notifikasi
              </h3>
              <ul className={styles.notificationList}>
                {notifications.map(notif => (
                  <li key={notif.id} className={styles.notificationItem}>
                    <div className={styles.notificationIconContainer}>
                      <AiOutlineBell className={styles.notificationIcon} />
                    </div>
                    <div className={styles.notificationInfo}>
                      <p className={styles.notificationMessage}>{notif.message}</p>
                      <span className={styles.notificationDate}>{notif.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Bagian Kolom Kanan */}
          <div className={styles.rightColumn}>
            <section className={styles.ordersSection}>
              <h3 className={styles.sectionTitle}>
                <AiOutlineClockCircle className={styles.sectionIcon} /> Pesanan Terbaru
              </h3>
              <ul className={styles.orderList}>
                {recentOrders.map(order => (
                  <li key={order.id} className={styles.orderItem}>
                    <div className={styles.orderIcon}>
                      <AiOutlineShoppingCart />
                    </div>
                    <div className={styles.orderInfo}>
                      <p className={styles.orderDescription}>{order.product}</p>
                      <span className={styles.orderDate}>{order.date}</span>
                    </div>
                    <div className={styles.orderStatusContainer}>
                      <p className={styles.orderAmount}>{order.amount}</p>
                      <span className={`${styles.orderStatus} ${order.status === 'Shipped' ? styles.statusShipped : order.status === 'Delivered' ? styles.statusDelivered : styles.statusProcessing}`}>
                        {order.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="#" className={styles.viewAllLink}>
                Lihat Semua Pesanan
              </Link>
            </section>
          </div>
        </div>
      </main>
      
    </div>
  );
}
