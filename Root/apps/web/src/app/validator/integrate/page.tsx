// apps/web/src/app/validator/integrate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineKey, AiOutlineApi, AiOutlineFileText, AiOutlineCode, AiOutlineCopy, AiOutlineLink, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import styles from './validator-integrate.module.css';

// Komponen Navigasi Dokumentasi (Aside)
const DocAside = () => {
  const [activeId, setActiveId] = useState('api-key');

  const navItems = [
    { name: 'Kunci API', id: 'api-key', icon: <AiOutlineKey /> },
    { name: 'Endpoints API', id: 'api-endpoints', icon: <AiOutlineApi /> },
    { name: 'Penerbitan Kredensial', id: 'issue-credential', icon: <AiOutlineFileText /> },
    { name: 'Pencabutan Kredensial', id: 'revoke-credential', icon: <AiOutlineCloseCircle /> },
    { name: 'Status Kredensial', id: 'credential-status', icon: <AiOutlineCheckCircle /> },
    { name: 'Webhooks', id: 'webhooks', icon: <AiOutlineLink /> },
    { name: 'Contoh Kode', id: 'code-examples', icon: <AiOutlineCode /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id)).filter(el => el);
      const currentScrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= currentScrollPos) {
          setActiveId(section.id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className={styles.docAside}>
      <h2 className={styles.asideTitle}>Integrasi</h2>
      <nav className={styles.asideNav}>
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => handleNavClick(item.id)} 
            className={`${styles.asideLink} ${item.id === activeId ? styles.active : ''}`}
          >
            <span className={styles.asideIcon}>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// Komponen Halaman Integrasi
export default function ValidatorIntegratePage() {
  const [apiKey, setApiKey] = useState('key-dev-123456-abcde');
  const [isCopied, setIsCopied] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  return (
    <div className={styles.integratePage}>
      <DocAside />
      <main className={styles.docMainContent}>
        <div className={styles.docHeader}>
          <h1 className={styles.docTitle}>Panduan Integrasi API</h1>
          <p className={styles.docDescription}>
            Dokumentasi lengkap untuk membantu developer mengintegrasikan aplikasi Anda dengan jaringan Aethelith.
          </p>
        </div>

        {/* --- Bagian 1: Kunci API --- */}
        <section id="api-key" className={styles.docSection}>
          <h2 className={styles.sectionHeading}>
            <AiOutlineKey /> Kunci API
          </h2>
          <p>Kunci API ini digunakan untuk mengautentikasi setiap permintaan ke API jaringan. Simpan kunci ini dengan aman dan jangan bagikan kepada pihak yang tidak berwenang.</p>
          <div className={styles.apiKeyDisplay}>
            <code>{isKeyVisible ? apiKey : '********************************'}</code>
            <button onClick={() => handleCopy(apiKey)} className={styles.copyButton}>
              {isCopied ? 'Tersalin!' : 'Salin'}
              <AiOutlineCopy />
            </button>
            <button onClick={toggleKeyVisibility} className={styles.visibilityButton}>
              {isKeyVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          <button className={styles.regenerateButton}>Buat Kunci Baru</button>
        </section>

        {/* --- Bagian 2: Endpoints API --- */}
        <section id="api-endpoints" className={styles.docSection}>
          <h2 className={styles.sectionHeading}>
            <AiOutlineApi /> Endpoints API
          </h2>
          <p>Semua permintaan harus menggunakan endpoint dasar berikut, dengan otentikasi melalui header <code>Authorization</code>.</p>
          <div className={styles.codeBlock}>
            <code>https://api.aethelith.network/v1/</code>
          </div>
        </section>

        {/* --- Bagian 3: Penerbitan Kredensial --- */}
        <section id="issue-credential" className={styles.docSection}>
          <h3 className={styles.sectionSubheading}>Penerbitan Kredensial</h3>
          <p>Endpoint ini digunakan untuk menerbitkan kredensial baru. Body permintaan harus berupa JSON.</p>
          <div className={styles.endpoint}>
            <span className={styles.httpMethod}>POST</span> <code>/issue-credential</code>
          </div>
          <p><strong>Body Permintaan:</strong></p>
          <pre className={styles.codeBlock}>
            {`{
  "subjectDid": "did:ethr:0x123abc...",
  "type": "Sertifikasi Profesi",
  "claims": {
    "name": "Budi Santoso",
    "profesi": "Web Developer",
    "tanggalLulus": "2024-01-01"
  }
}`}
          </pre>
        </section>

        {/* --- Bagian 4: Pencabutan Kredensial --- */}
        <section id="revoke-credential" className={styles.docSection}>
          <h3 className={styles.sectionSubheading}>Pencabutan Kredensial</h3>
          <p>Endpoint untuk mencabut kredensial yang sudah tidak valid. Body permintaan harus berisi ID kredensial yang akan dicabut.</p>
          <div className={styles.endpoint}>
            <span className={styles.httpMethod}>POST</span> <code>/revoke-credential</code>
          </div>
          <p><strong>Body Permintaan:</strong></p>
          <pre className={styles.codeBlock}>
            {`{
  "credentialId": "vc-001",
  "reason": "Kredensial kedaluwarsa"
}`}
          </pre>
        </section>
        
        {/* --- Bagian 5: Status Kredensial --- */}
        <section id="credential-status" className={styles.docSection}>
          <h3 className={styles.sectionSubheading}>Status Kredensial</h3>
          <p>Periksa status kredensial saat ini (valid, dicabut, atau kedaluwarsa).</p>
          <div className={styles.endpoint}>
            <span className={styles.httpMethod}>GET</span> <code>/credential-status/:credentialId</code>
          </div>
          <p><strong>Contoh Respons Sukses:</strong></p>
          <pre className={styles.codeBlock}>
            {`{
  "status": "valid",
  "credentialId": "vc-003",
  "message": "Kredensial aktif dan valid."
}`}
          </pre>
        </section>

        {/* --- Bagian 6: Webhooks --- */}
        <section id="webhooks" className={styles.docSection}>
          <h3 className={styles.sectionSubheading}>Webhooks</h3>
          <p>Dapatkan notifikasi real-time tentang status kredensial. Anda harus mendaftarkan URL webhook di pengaturan instansi Anda.</p>
          <p><strong>Contoh Payload Webhook:</strong></p>
          <pre className={styles.codeBlock}>
            {`{
  "event": "credential.revoked",
  "timestamp": "2025-07-27T10:00:00Z",
  "payload": {
    "credentialId": "vc-002",
    "reason": "Kredensial kedaluwarsa"
  }
}`}
          </pre>
        </section>

        {/* --- Bagian 7: Contoh Kode --- */}
        <section id="code-examples" className={styles.docSection}>
          <h2 className={styles.sectionHeading}>
            <AiOutlineCode /> Contoh Kode
          </h2>
          <p>Berikut adalah contoh kode JavaScript untuk melakukan penerbitan kredensial:</p>
          <pre className={styles.codeBlock}>
            {`const apiKey = "key-dev-123456-abcde";

const issueCredential = async (credentialData) => {
  const response = await fetch('https://api.aethelith.network/v1/issue-credential', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: JSON.stringify(credentialData)
  });

  if (!response.ok) {
    throw new Error('Gagal menerbitkan kredensial');
  }

  return response.json();
};

const myCredential = {
  subjectDid: "did:ethr:0x123abc...",
  type: "Sertifikasi Profesi",
  claims: {
    "name": "Budi Santoso",
    "profesi": "Web Developer"
  }
};

issueCredential(myCredential)
  .then(data => {/* ...existing code... */})
  .catch(error => console.error(error));`}
          </pre>
        </section>
      </main>
    </div>
  );
}