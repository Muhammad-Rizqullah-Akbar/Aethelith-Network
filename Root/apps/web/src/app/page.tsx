
// apps/web/src/app/page.tsx
'use client';

import Link from 'next/link';
import { AiOutlineUser, AiOutlineLock, AiOutlineSwap } from 'react-icons/ai';
import { Navbar } from '../components/layout/navbar';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import navbarStyles from '../components/layout/navbar.module.css';
import { useAuth } from '../components/layout/AuthProvider';

const features = [
  {
    icon: <AiOutlineUser />,
    title: 'Self-Sovereign Identity',
    description: 'Pengguna memiliki kendali penuh atas identitas digital mereka, bukan entitas terpusat.',
  },
  {
    icon: <AiOutlineLock />,
    title: 'Zero-Knowledge Proof',
    description: 'Memverifikasi data tanpa perlu mengungkapkan informasi sensitif, menjaga privasi maksimal.',
  },
  {
    icon: <AiOutlineSwap />,
    title: 'Verifikasi Lintas Platform',
    description: 'Satu kali input data untuk verifikasi di berbagai layanan digital yang berbeda.',
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useAuth();
  const [navbarHeight, setNavbarHeight] = useState(0); // State untuk menyimpan tinggi navbar

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && navbarRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        if (heroBottom <= 0) {
          navbarRef.current.classList.add(navbarStyles.stickyNavbar);
        } else {
          navbarRef.current.classList.remove(navbarStyles.stickyNavbar);
        }
      }
    };
    
    // Simpan tinggi navbar saat komponen mount
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };
    
    // Panggil fungsi update saat mount dan resize
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, []);

  const getStartedHref = isConnected ? '/dashboard' : '/register';

  return (
    <>
      <div ref={heroRef} className={styles.heroSection}>
        <div className={styles.homePageBackground}>
          <div className={styles.homePageContainer}>
            <div className={styles.heroLayout}>
              <div className={styles.heroContent}>
                <p className={styles.heroPreTitle}>Masa Depan Identitas Digital</p>
                <h1 className={styles.heroTitle}>Aethelith Network</h1>
                <p className={styles.heroDescription}>
                  Satu kali input, verifikasi untuk semua platform. Solusi terdesentralisasi
                  yang melindungi privasi Anda dengan Zero-Knowledge Proof.
                </p>
                <div className={styles.heroButtons}>
                  <Link href={getStartedHref} className={styles.primaryButton}>
                    Get Started
                  </Link>
                  <Link href="/docs" className={styles.secondaryButton}>
                    Read Docs
                  </Link>
                </div>
              </div>
              <img src="/Logo.png" alt="Aethelith Network Logo" className={styles.heroLogo} />
            </div>
          </div>
        </div>
      </div>

      <div ref={navbarRef}>
        <Navbar />
      </div>

      {/* Konten utama sekarang memiliki padding-top dinamis */}
      <div className={styles.mainContent} style={{ paddingTop: `${navbarHeight + 4*16}px` }}>
        {/* Fitur Utama */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Fitur Utama</h2>
            <p className={styles.sectionDescription}>Solusi kami dibangun untuk revolusi identitas digital.</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Alur Kerja */}
        <section className={styles.howItWorksSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Bagaimana Ini Bekerja</h2>
            <p className={styles.sectionDescription}>Proses verifikasi yang aman dan efisien dalam 3 langkah mudah.</p>
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>1</span>
              <h3 className={styles.stepTitle}>Daftar & Buat DID</h3>
              <p className={styles.stepDescription}>Buat identitas digital Anda dan simpan data sensitif dengan aman.</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>2</span>
              <h3 className={styles.stepTitle}>Verifikasi dengan Validator</h3>
              <p className={styles.stepDescription}>Pilih validator tepercaya untuk memverifikasi data Anda.</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>3</span>
              <h3 className={styles.stepTitle}>Gunakan Verifiable Credentials</h3>
              <p className={styles.stepDescription}>Gunakan kredensial Anda untuk verifikasi di berbagai platform.</p>
            </div>
          </div>
        </section>

        {/* CTA Terakhir */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Siap Bergabung dengan Kami?</h2>
          <p className={styles.ctaDescription}>
            Mulai bangun solusi identitas digital Anda dengan Aethelith Network.
          </p>
          <Link href={getStartedHref} className={styles.ctaButton}>
            Mulai Sekarang
          </Link>
        </section>
      </div>
    </>
  );
}