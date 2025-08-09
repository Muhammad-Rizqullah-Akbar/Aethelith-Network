import Link from 'next/link';
import { AuthButtons } from './AuthButtons';
import styles from './navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLeft}>
          <Link href="/">
            <span className={styles.navbarLogo}>Aethelith Network</span>
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
