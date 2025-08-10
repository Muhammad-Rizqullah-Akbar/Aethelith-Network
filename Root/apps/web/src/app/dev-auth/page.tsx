"use client";
// apps/web/src/app/dev-auth/page.tsx
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './dev-auth.module.css';
import { AiOutlineIdcard, AiOutlineFileDone } from 'react-icons/ai';

function DevAuthContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');
  const [activeTab, setActiveTab] = useState<'validator' | 'verifier'>(
    initialRole === 'verifier' ? 'verifier' : 'validator'
  );
  const [instanceId, setInstanceId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (instanceId && apiKey) {
      console.log(`Mencoba login sebagai ${activeTab} dengan ID: ${instanceId}`);
      if (activeTab === 'validator') {
        console.log('Login berhasil! Mengarahkan ke Dashboard Validator...');
      } else {
        console.log('Login berhasil! Mengarahkan ke Dashboard Verifier...');
      }
    } else {
      setError('Instance ID dan API Key harus diisi.');
    }
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'validator' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('validator')}
        >
          <AiOutlineIdcard className={styles.tabIcon} />
          Login sebagai Validator
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'verifier' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('verifier')}
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
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Login
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