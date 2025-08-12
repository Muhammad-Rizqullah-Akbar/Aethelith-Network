'use client';

import { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineIdcard, AiOutlineTrophy, AiOutlineCheckCircle, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IoIosDocument } from "react-icons/io";
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { CopyButton } from '../../../components/layout/CopyButton';
import styles from './Profile.module.css';

import { getAndDecryptSensitiveData } from '../../../lib/indexedDB';
import { getAuth, getIdToken } from 'firebase/auth';

interface VCItemProps {
  title: string;
  issuer: string;
  status: string;
  date: string;
}

const VCItem = ({ title, issuer, status, date }: VCItemProps) => (
  <div className={styles.vcCard}>
    <div className={styles.vcHeader}>
      <IoIosDocument className={styles.vcIcon} />
      <div>
        <h3 className={styles.vcTitle}>{title}</h3>
        <p className={styles.vcIssuer}>Diterbitkan oleh: {issuer}</p>
      </div>
    </div>
    <div className={styles.vcFooter}>
      <span className={`${styles.vcStatus} ${status === 'Active' ? styles.vcStatusActive : styles.vcStatusRevoked}`}>
        {status}
      </span>
      <span className={styles.vcIssueDate}>Pada: {date}</span>
    </div>
  </div>
);

interface UserData {
  did: string | null;
  email: string | null;
  fullName: string;
  nik: string;
  alamat: string;
  tanggalLahir: string;
}

export default function ProfilePage() {
  const { userDid, userIdentity, isConnected } = useAuth();
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  
  useEffect(() => {
    if (isConnected && userIdentity?.uid && auth.currentUser) {
      const fetchData = async () => {
        try {
          if (!auth.currentUser) {
            setIsLoading(false);
            return;
          }
          const idToken = await getIdToken(auth.currentUser);
          const sensitiveData = await getAndDecryptSensitiveData(userIdentity.uid, idToken);
          
          if (sensitiveData) {
            setUserData({
              ...sensitiveData,
              did: userDid,
              email: userIdentity.email,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else if (!isConnected) {
        setIsLoading(false);
    }
  }, [isConnected, userIdentity?.uid, userDid, auth.currentUser]);

  const dummyVCs = [
    { id: 1, title: "KYC Verified", issuer: "Aethelith Issuer", status: "Active", date: "2023-10-27" },
    { id: 2, title: "Age Verified (18+)", issuer: "Aethelith Issuer", status: "Active", date: "2023-10-27" },
    { id: 3, title: "Sertifikat Vaksin", issuer: "Kemenkes RI", status: "Revoked", date: "2022-05-15" },
  ];

  if (isLoading) {
    return (
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Loading...</h1>
      </div>
    );
  }

  // Menampilkan profil meskipun data userData mungkin null
  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          <AiOutlineUser className={styles.avatarIcon} />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{userData?.fullName ?? 'Memuat...'}</h1>
          <p className={styles.profileDid}>
            {userData?.did?.substring(0, 10)}...{userData?.did?.substring(userData.did.length - 8) ?? 'Memuat...'}
            <CopyButton textToCopy={userData?.did ?? ''} className={styles.copyButton} />
          </p>
        </div>
      </header>

      <div className={styles.profileContent}>
        <section className={styles.cardSection}>
          <h2 className={styles.sectionTitle}>
            <AiOutlineIdcard className={styles.sectionIcon} /> Informasi Dasar
          </h2>
          <div className={styles.dataCard}>
            <div className={styles.dataGroup}>
              <span className={styles.dataLabel}>Nama Lengkap:</span>
              <span className={styles.dataValue}>{userData?.fullName ?? 'Memuat...'}</span>
            </div>
            <div className={styles.dataGroup}>
              <span className={styles.dataLabel}>Alamat Email:</span>
              <span className={styles.dataValue}>{userData?.email ?? 'Memuat...'}</span>
            </div>
            <div className={styles.dataGroup}>
              <span className={styles.dataLabel}>NIK:</span>
              <span className={styles.dataValue}>
                {showSensitiveData ? (userData?.nik ?? 'Memuat...') : '************'}
                <button 
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  className={styles.toggleButton}
                  disabled={!userData}
                >
                  {showSensitiveData ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </span>
            </div>
            <div className={styles.dataGroup}>
              <span className={styles.dataLabel}>Alamat:</span>
              <span className={styles.dataValue}>
                {showSensitiveData ? (userData?.alamat ?? 'Memuat...') : '************'}
                <button 
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  className={styles.toggleButton}
                  disabled={!userData}
                >
                  {showSensitiveData ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </span>
            </div>
            <div className={styles.dataGroup}>
              <span className={styles.dataLabel}>Tanggal Lahir:</span>
              <span className={styles.dataValue}>
                {showSensitiveData ? (userData?.tanggalLahir ?? 'Memuat...') : '********'}
                <button 
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  className={styles.toggleButton}
                  disabled={!userData}
                >
                  {showSensitiveData ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </span>
            </div>
          </div>
        </section>

        <section className={styles.cardSection}>
          <h2 className={styles.sectionTitle}>
            <AiOutlineTrophy className={styles.sectionIcon} /> Status Kredensial
          </h2>
          <div className={styles.vcGrid}>
            <div className={styles.vcCard}>
              <h3 className={styles.cardTitle}>Total VC Dimiliki</h3>
              <p className={styles.cardValue}>{dummyVCs.length}</p>
            </div>
            <div className={styles.vcCard}>
              <h3 className={styles.cardTitle}>VC Aktif</h3>
              <p className={styles.cardValue}>{dummyVCs.filter(vc => vc.status === 'Active').length}</p>
            </div>
          </div>
        </section>

        <section className={styles.cardSection}>
          <h2 className={styles.sectionTitle}>
            <AiOutlineCheckCircle className={styles.sectionIcon} /> Riwayat Verifikasi
          </h2>
          <div className={styles.vcGrid}>
            {dummyVCs.map(vc => (
              <VCItem key={vc.id} {...vc} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
