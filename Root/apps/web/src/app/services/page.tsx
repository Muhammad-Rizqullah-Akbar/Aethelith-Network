'use client';

import { AiOutlineIdcard, AiOutlineLock, AiOutlineSwap, AiOutlineCheckCircle } from 'react-icons/ai';
import { IoIosDocument } from "react-icons/io";
import { HiOutlineLightBulb } from "react-icons/hi2";
import styles from './services.module.css';

const services = [
  {
    icon: <AiOutlineIdcard />,
    title: "Identitas Digital (DID)",
    description: "Kami menyediakan platform untuk membuat dan mengelola identitas digital yang berdaulat, memberikan Anda kendali penuh atas data pribadi."
  },
  {
    icon: <IoIosDocument />,
    title: "Verifiable Credentials (VCs)",
    description: "Menerbitkan dan memverifikasi kredensial digital yang aman, seperti sertifikat kewarganegaraan atau bukti usia, yang dapat dipercaya."
  },
  {
    icon: <AiOutlineLock />,
    title: "Zero-Knowledge Proof (ZKP)",
    description: "Memungkinkan verifikasi data tanpa mengungkapkan informasi sensitif. Buktikan 'usia Anda di atas 18' tanpa menunjukkan tanggal lahir."
  },
  {
    icon: <AiOutlineSwap />,
    title: "Verifikasi Lintas Platform",
    description: "Proses verifikasi identitas sekali input untuk berbagai platform, menghilangkan kebutuhan untuk pengisian data berulang kali."
  },
  {
    icon: <AiOutlineCheckCircle />,
    title: "Dukungan Validator",
    description: "Menyediakan infrastruktur dan panduan bagi organisasi (seperti pemerintah atau bank) untuk menjadi validator tepercaya di jaringan kami."
  },
  {
    icon: <HiOutlineLightBulb />,
    title: "Arsitektur Terdesentralisasi",
    description: "Dibangun di atas Hyperledger Fabric untuk memastikan transparansi, keamanan, dan ketahanan terhadap single-point-of-failure."
  }
];

export default function ServicesPage() {
  return (
    <div className={styles.servicesContainer}>
      <header className={styles.servicesHeader}>
        <h1 className={styles.servicesTitle}>Layanan Kami</h1>
        <p className={styles.servicesDescription}>
          Temukan bagaimana Aethelith Network merevolusi verifikasi identitas digital dengan solusi yang aman, efisien, dan berpusat pada pengguna.
        </p>
      </header>
      <main className={styles.serviceCardsGrid}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={styles.cardIcon}>{service.icon}</div>
            <h2 className={styles.cardTitle}>{service.title}</h2>
            <p className={styles.cardDescription}>{service.description}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
