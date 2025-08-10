'use client';

import Link from 'next/link';
import { AiOutlineTeam, AiOutlineBulb, AiOutlineUser, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import styles from './about.module.css';

const teamMembers = [
  {
    name: "Muhammad Rizqullah Akbar Adlan",
    role: "Co-Founder & CEO",
    description: "Memimpin visi strategis dan inovasi teknologi di Aethelith Network.",
  },
  {
    name: "Mutiah Arinil Fayza Nusar",
    role: "Co-Founder & Head of Operations",
    description: "Mengelola operasional harian dan kemitraan strategis dengan organisasi eksternal.",
  },
  {
    name: "Amrullah",
    role: "Co-Founder & CTO",
    description: "Bertanggung jawab atas arsitektur teknis dan pengembangan sistem inti blockchain.",
  }
];

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.aboutHeader}>
        <h1 className={styles.aboutTitle}>Tentang Kami</h1>
        <p className={styles.aboutDescription}>
          Kami adalah tim di balik Aethelith Network, sebuah solusi inovatif untuk verifikasi identitas digital yang aman dan berpusat pada pengguna.
        </p>
      </header>
      
      <main className={styles.aboutMainContent}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <AiOutlineBulb className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Misi dan Visi</h2>
          </div>
          <p className={styles.sectionText}>
            **Misi Kami:** Membangun ekosistem verifikasi identitas digital yang terdesentralisasi, efisien, dan mengutamakan privasi pengguna.
          </p>
          <p className={styles.sectionText}>
            **Visi Kami:** Menjadi fondasi infrastruktur digital global yang dipercaya, di mana setiap individu memiliki kendali penuh atas identitasnya.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <AiOutlineTeam className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Tim Kami</h2>
          </div>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.avatar}>
                  <AiOutlineUser className={styles.avatarIcon} />
                </div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamDescription}>{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <AiOutlineMail className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Hubungi Kami</h2>
          </div>
          <p className={styles.sectionText}>
            Jika Anda memiliki pertanyaan lebih lanjut atau ingin berkolaborasi, jangan ragu untuk menghubungi kami.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <AiOutlineMail className={styles.contactIcon} />
              <p className={styles.contactText}>support@aethelith.net</p>
            </div>
            <div className={styles.contactItem}>
              <AiOutlinePhone className={styles.contactIcon} />
              <p className={styles.contactText}>+62 812-3456-7890</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
