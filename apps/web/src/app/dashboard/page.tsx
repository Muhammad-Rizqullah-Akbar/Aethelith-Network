// apps/web/src/app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { AiOutlineUser, AiOutlineBank, AiOutlineSearch } from 'react-icons/ai';
import { useAuth } from '../../components/layout/AuthProvider';
import styles from './dashboard.module.css';
import AccessDenied from '../../components/throwError/AccessDenied'; // <-- Import komponen baru

const RoleCard = ({ title, description, link, buttonText, icon }: {
    title: string;
    description: string;
    link: string;
    buttonText: string;
    icon: React.ReactNode;
}) => (
    <div className={styles.roleCard}>
        <div className={styles.cardIcon}>{icon}</div>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardDescription}>{description}</p>
        <Link href={link}>
            <button className={styles.cardButton}>
                {buttonText}
            </button>
        </Link>
    </div>
);

export default function DashboardPage() {
    const { isConnected } = useAuth();

    if (!isConnected) {
        // Render komponen AccessDenied jika pengguna belum terhubung
        return <AccessDenied />;
    }

    return (
        <div className="relative py-12 min-h-screen">
            <header className={styles.heroSection}>
                <h1 className={styles.heroTitle}>
                    Dashboard Utama
                </h1>
                <p className={`${styles.heroDescription} mx-auto max-w-2xl`}>
                    Pilih peran yang ingin Anda gunakan untuk memulai.
                </p>
            </header>

            <section className={`${styles.roleCardsSection} mt-12`}>
                <div className={styles.roleCardsGrid}>
                    <RoleCard
                        icon={<AiOutlineUser />}
                        title="Sebagai Holder"
                        description="Kelola identitas digital Anda, simpan Verifiable Credential (VC), dan bagikan bukti privasi-privasi."
                        link="/holder/my-did"
                        buttonText="Lihat Dashboard Holder"
                    />

                    <RoleCard
                        icon={<AiOutlineBank />}
                        title="Sebagai Issuer"
                        description="Terbitkan Verifiable Credential (VC) ke Holder setelah proses verifikasi KYC yang sukses."
                        link="/issuer/dashboard"
                        buttonText="Lihat Dashboard Issuer"
                    />

                    <RoleCard
                        icon={<AiOutlineSearch />}
                        title="Sebagai Verifier"
                        description="Verifikasi bukti kredensial (Zero-Knowledge Proof) dari Holder untuk memastikan keaslian data."
                        link="/verifier/verify-kyc"
                        buttonText="Lihat Dashboard Verifier"
                    />
                </div>
            </section>
        </div>
    );
}