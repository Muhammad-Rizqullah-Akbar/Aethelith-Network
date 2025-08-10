import Link from 'next/link';
import { AuthButtons } from './AuthButtons';
import styles from './navbar.module.css';

// Mendefinisikan interface props untuk Navbar
interface NavbarProps {
  className?: string;
}

// Komponen Navbar sekarang menerima `className`
export function Navbar({ className }: NavbarProps) {
  return (
    <nav className={`${styles.navbar} ${className}`}>
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