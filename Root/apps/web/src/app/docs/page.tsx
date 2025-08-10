'use client';

import Link from 'next/link';
import { AiOutlineApi, AiOutlineUser, AiOutlineTeam, AiOutlineCode, AiOutlineCheckCircle, AiOutlineLock } from 'react-icons/ai';
import { IoIosDocument } from "react-icons/io";
import styles from './docs.module.css';

export default function DocsPage() {
  return (
    <div className={styles.docsContainer}>
      <header className={styles.docsHeader}>
        <h1 className={styles.docsTitle}>Dokumentasi Aethelith Network</h1>
        <p className={styles.docsDescription}>Panduan teknis dan operasional untuk mengintegrasikan layanan verifikasi identitas terdesentralisasi kami.</p>
        <div className={styles.ctaButtons}>
          <a href="#dev" className={styles.ctaButton}>
            <span>Untuk Developer</span>
            <AiOutlineCode className={styles.buttonIcon} />
          </a>
          <a href="#user" className={styles.ctaButton}>
            <span>Untuk Pengguna</span>
            <AiOutlineUser className={styles.buttonIcon} />
          </a>
          <a href="#validator" className={styles.ctaButton}>
            <span>Untuk Validator</span>
            <AiOutlineTeam className={styles.buttonIcon} />
          </a>
        </div>
      </header>
      <main className={styles.docsMainContent}>
        <section id="dev" className={styles.docsSection}>
          <h2 className={styles.sectionTitle}>Untuk Developer Integrasi</h2>
          <p className={styles.sectionDescription}>
            Bagian ini ditujukan bagi pengembang dari organisasi eksternal seperti bank, e-commerce, atau layanan publik yang ingin mengintegrasikan layanan verifikasi identitas digital Aethelith ke platform mereka.
          </p>
          <h3 className={styles.subSectionTitle}>Alur Integrasi API</h3>
          <p>
            Integrasi dengan Aethelith Network dilakukan melalui API Gateway kami. Anda akan menerima kunci API unik dan kredensial untuk otentikasi.
          </p>
          <div className={styles.codeBlock}>
            <code>
              {`POST /api/verify`}
              <br />
              {`Content-Type: application/json`}
              <br />
              {`Authorization: Bearer <Your-API-Key>`}
              <br />
              <br />
              {`{`}
              <br />
              {`  "holderDid": "did:aethelith:...",`}
              <br />
              {`  "credentialType": "KYC_Verified",`}
              <br />
              {`  "requestedAttributes": ["age", "nationality"]`}
              <br />
              {`}`}
            </code>
          </div>
          <h3 className={styles.subSectionTitle}>Konsep Kunci</h3>
          <ul className={styles.conceptList}>
            <li>
              <span className={styles.conceptTitle}>Verifiable Credentials (VCs):</span> Kredensial digital yang dikeluarkan oleh entitas tepercaya, yang dapat dibuktikan keasliannya.
            </li>
            <li>
              <span className={styles.conceptTitle}>Decentralized Identifiers (DIDs):</span> Identitas digital unik yang dikelola oleh pengguna, bukan oleh otoritas pusat.
            </li>
            <li>
              <span className={styles.conceptTitle}>Zero-Knowledge Proof (ZKP):</span> Protokol kriptografi yang memungkinkan Verifier untuk memvalidasi informasi tanpa melihat data mentah.
            </li>
          </ul>
        </section>

        <div className={styles.divider} />

        <section id="user" className={styles.docsSection}>
          <h2 className={styles.sectionTitle}>Panduan untuk Pengguna (Holder)</h2>
          <p className={styles.sectionDescription}>
            Panduan ini menjelaskan cara pengguna berinteraksi dengan Aethelith Network untuk mengelola identitas digital mereka dengan aman dan efisien.
          </p>
          <h3 className={styles.subSectionTitle}>Langkah-langkah Penggunaan</h3>
          <ol className={styles.userGuideList}>
            <li>
              <span className={styles.stepTitle}>Pendaftaran Akun:</span> Daftar menggunakan email dan kata sandi. Dompet identitas digital (DID) Anda akan dibuat secara otomatis.
            </li>
            <li>
              <span className={styles.stepTitle}>Pengisian Data KYC:</span> Isi data pribadi Anda. Data ini dienkripsi di perangkat Anda dan disimpan dengan aman.
            </li>
            <li>
              <span className={styles.stepTitle}>Verifikasi Identitas:</span> Pilih layanan verifikasi dari Validator tepercaya. Aethelith akan mengirim data terenkripsi untuk diverifikasi.
            </li>
            <li>
              <span className={styles.stepTitle}>Berbagi Kredensial:</span> Saat Verifier meminta, Anda dapat membagikan Verifiable Credentials dengan aman menggunakan ZKP.
            </li>
          </ol>
        </section>

        <div className={styles.divider} />

        <section id="validator" className={styles.docsSection}>
          <h2 className={styles.sectionTitle}>Untuk Validator (Issuer & Verifier)</h2>
          <p className={styles.sectionDescription}>
            Bagian ini ditujukan bagi organisasi seperti Dukcapil atau lembaga keuangan yang ingin menjadi bagian dari ekosistem Aethelith.
          </p>
          <h3 className={styles.subSectionTitle}>Alur Menjadi Validator</h3>
          <ul className={styles.validatorFlowList}>
            <li>
              <span className={styles.stepTitle}>Pendaftaran Organisasi:</span> Hubungi kami untuk bergabung ke jaringan Hyperledger Fabric kami.
            </li>
            <li>
              <span className={styles.stepTitle}>Integrasi Backend:</span> Siapkan API off-chain yang terhubung dengan database Anda untuk memverifikasi data yang kami kirim.
            </li>
            <li>
              <span className={styles.stepTitle}>Menjalankan Chaincode:</span> Jalankan chaincode kami di peer Anda. Chaincode ini akan menerima data terenkripsi, memvalidasinya, dan mencatat status verifikasi.
            </li>
            <li>
              <span className={styles.stepTitle}>Menerbitkan Kredensial:</span> Setelah verifikasi berhasil, chaincode Anda akan menerbitkan Verifiable Credential yang ditandatangani untuk pengguna.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
