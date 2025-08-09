import Link from 'next/link';
import { AuthButtons } from './AuthButtons';
import styles from './navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLeft}>
          <Link href="/">
            <img src="/Logo.png" alt="Aethelith Network" className={styles.navbarLogo} />
          </Link>
          <div className={styles.navbarLinks}>
            <Link href="/about" className={styles.navLink}>Tentang Kami</Link>
            <Link href="/services" className={styles.navLink}>Layanan</Link>
            <Link href="/docs" className={styles.navLink}>Dokumentasi</Link>
          </div>
        </div>
        <div className={styles.navbarRight}>
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
