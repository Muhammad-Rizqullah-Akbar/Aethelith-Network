// apps/web/src/app/dev-register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineFileAdd, AiOutlineIdcard } from 'react-icons/ai';
import styles from './dev-register.module.css';

export default function DevRegisterPage() {
  const [instanceName, setInstanceName] = useState('');
  const [npwp, setNpwp] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [sector, setSector] = useState('');
  const [contactName, setContactName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usagePurpose, setUsagePurpose] = useState('');
  const [expectedVolume, setExpectedVolume] = useState('');
  const [integrationMethod, setIntegrationMethod] = useState('');
  const [instanceRole, setInstanceRole] = useState<'validator' | 'verifier'>('validator');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredDetails, setRegisteredDetails] = useState({ id: '', apiKey: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Client-Side Validation
    if (
      !instanceName || !npwp || !address || !website || !sector ||
      !contactName || !position || !email || !phone || !usagePurpose || !expectedVolume || !integrationMethod
    ) {
      setError("Mohon lengkapi semua data yang diperlukan.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Mengirim data ke API Route baru untuk diproses secara aman
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instanceName,
          npwp,
          address,
          website,
          sector,
          contactName,
          position,
          email,
          phone,
          usagePurpose,
          expectedVolume,
          integrationMethod,
          instanceRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Update UI setelah registrasi berhasil dari API Route
        setRegisteredDetails({
          id: data.instanceId,
          apiKey: data.apiKey, // Menerima API Key asli dari server
        });
        setIsRegistered(true);
      } else {
        // 4. Menangani kesalahan dari API Route
        setError(data.error || 'Terjadi kesalahan saat mendaftar.');
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Terjadi kesalahan jaringan atau server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    // navigator.clipboard.writeText(...)
    // ... (logic for copying)
    alert('Kredensial berhasil disalin!');
  };

  if (isRegistered) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.formTitle}>Registrasi Berhasil! 🎉</h1>
          <p className={styles.formDescription}>
            Akun instansi Anda telah berhasil dibuat. Silakan simpan kredensial di bawah ini dengan aman.
          </p>
          <div className={styles.credentialDisplay}>
            <p><strong>ID Instansi:</strong> {registeredDetails.id}</p>
            <p><strong>Kunci API:</strong> {registeredDetails.apiKey}</p>
            <button onClick={() => handleCopy(registeredDetails.apiKey)} className={styles.copyButton}>
              Salin Kunci API
            </button>
          </div>
          <Link href={`/dev-auth?role=${instanceRole}`} className={styles.submitButton}>
            Lanjut ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.headerContainer}>
          <h1 className={styles.formTitle}>Daftarkan Instansi Anda</h1>
          <p className={styles.formDescription}>
            Lengkapi formulir di bawah ini untuk menjadi Validator atau Verifier di jaringan Aethelith.
          </p>
        </div>

        <form onSubmit={handleRegister} className={styles.authForm}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.formGrid}>
            {/* ... (bagian form yang sama) ... */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>1. Informasi Legal & Bisnis</h3>
              <div className={styles.inputGroup}>
                <label htmlFor="instanceName">Nama Resmi Instansi</label>
                <input type="text" id="instanceName" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} className={styles.authInput} placeholder="PT. Bank Sentosa Abadi" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="npwp">Nomor Registrasi Bisnis / NPWP</label>
                <input type="text" id="npwp" value={npwp} onChange={(e) => setNpwp(e.target.value)} className={styles.authInput} placeholder="Contoh: 12.345.678.9-012.345" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="address">Alamat Lengkap Instansi</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className={styles.authInput} placeholder="Jl. Merdeka No. 17" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="website">Website Resmi</label>
                <input type="url" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className={styles.authInput} placeholder="https://www.instansi.com" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="sector">Sektor Industri</label>
                <select id="sector" value={sector} onChange={(e) => setSector(e.target.value)} className={styles.authInput} required>
                  <option value="">Pilih Sektor Industri</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>2. Kontak Penanggung Jawab</h3>
              <div className={styles.inputGroup}>
                <label htmlFor="contactName">Nama Lengkap</label>
                <input type="text" id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} className={styles.authInput} placeholder="John Doe" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="position">Jabatan/Posisi</label>
                <input type="text" id="position" value={position} onChange={(e) => setPosition(e.target.value)} className={styles.authInput} placeholder="CTO" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Perusahaan</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.authInput} placeholder="john.doe@instansi.com" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Nomor Telepon</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.authInput} placeholder="+62 812-3456-7890" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Pilih Peran</label>
                <div className={styles.roleSelectionGrid}>
                  <button type="button" className={`${styles.roleCard} ${instanceRole === 'validator' ? styles.roleCardActive : ''}`} onClick={() => setInstanceRole('validator')}>
                    <AiOutlineFileAdd className={styles.roleIcon} />
                    <span className={styles.roleTitle}>Validator</span>
                    <p className={styles.roleDescription}>Menerbitkan Verifiable Credentials.</p>
                  </button>
                  <button type="button" className={`${styles.roleCard} ${instanceRole === 'verifier' ? styles.roleCardActive : ''}`} onClick={() => setInstanceRole('verifier')}>
                    <AiOutlineIdcard className={styles.roleIcon} />
                    <span className={styles.roleTitle}>Verifier</span>
                    <p className={styles.roleDescription}>Memverifikasi kredensial dari holder.</p>
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>3. Informasi Teknis & Tujuan</h3>
              <div className={styles.inputGroup}>
                <label htmlFor="usagePurpose">Tujuan Penggunaan</label>
                <textarea id="usagePurpose" value={usagePurpose} onChange={(e) => setUsagePurpose(e.target.value)} className={styles.authInput} rows={5} placeholder="Jelaskan kasus penggunaan Anda (misalnya: menerbitkan ijazah digital)." required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="expectedVolume">Perkiraan Volume (per bulan)</label>
                <input type="text" id="expectedVolume" value={expectedVolume} onChange={(e) => setExpectedVolume(e.target.value)} className={styles.authInput} placeholder="Contoh: 1,000 transaksi" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="integrationMethod">Metode Integrasi</label>
                <select id="integrationMethod" value={integrationMethod} onChange={(e) => setIntegrationMethod(e.target.value)} className={styles.authInput} required>
                  <option value="">Pilih metode integrasi</option>
                  <option value="API">API (Extremely Recommended)</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </div>
          </div>
        </form>

        <p className={styles.loginLink}>
          Sudah punya akun developer?{' '}
          <Link href={`/dev-auth?role=${instanceRole}`} className={styles.link}>
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}