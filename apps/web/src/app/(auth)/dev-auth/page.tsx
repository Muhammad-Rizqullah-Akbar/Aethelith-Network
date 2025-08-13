// apps/web/src/app/dev-auth/page.tsx
'use client';
//hai nigg

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './dev-auth.module.css';
import { AiOutlineIdcard, AiOutlineFileDone } from 'react-icons/ai';

function DevAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRole = searchParams.get('role');
  const [activeTab, setActiveTab] = useState<'validator' | 'verifier'>(
    initialRole === 'verifier' ? 'verifier' : 'validator'
  );
  const [instanceId, setInstanceId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!instanceId || !apiKey) {
      setError('Instance ID dan Kunci API harus diisi.');
      setIsLoading(false);
      return;
    }

    try {
      // Call your Next.js API route
      const response = await fetch('/api/dev-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instanceId, apiKey, activeTab }),
      });

      const data = await response.json();

      if (response.ok) { // Check if the response status is 2xx
        console.log(data.message);
        // Login successful!
        if (activeTab === 'validator') {
          router.push('/validator');
        } else {
          router.push('/verifier');
        }
      } else {
        // Handle errors returned from the API route
        setError(data.message || 'Kredensial tidak valid atau peran salah. Silakan periksa kembali.');
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError('Terjadi kesalahan jaringan atau server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'validator' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('validator')}
          disabled={isLoading}
        >
          <AiOutlineIdcard className={styles.tabIcon} />
          Login sebagai Validator
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'verifier' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('verifier')}
          disabled={isLoading}
        >
          <AiOutlineFileDone className={styles.tabIcon} />
          Login sebagai Verifier
        </button>
      </div>
      <h1 className={styles.formTitle}>
        {activeTab === 'validator' ? 'Masuk sebagai Validator' : 'Masuk sebagai Verifier'}
      </h1>
      <p className={styles.formDescription}>
        Gunakan kredensial instansi yang telah Anda terima.
      </p>
      <form onSubmit={handleLogin} className={styles.authForm}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="instanceId">ID Instansi</label>
          <input
            type="text"
            id="instanceId"
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            className={styles.authInput}
            placeholder="Masukkan ID Instansi Anda"
            required
            disabled={isLoading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="apiKey">Kunci API</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={styles.authInput}
            placeholder="Masukkan Kunci API Anda"
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Memverifikasi...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default function DevAuthPage() {
  return (
    <div className={styles.authContainer}>
      <Suspense>
        <DevAuthContent />
      </Suspense>
    </div>
  );
}