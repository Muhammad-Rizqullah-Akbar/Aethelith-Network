// apps/web/src/app/verifier/verify-kyc/page.tsx
'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { AiOutlineSearch, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

export default function VerifyKycPage() {
  const { isDisconnected } = useAccount();
  const [holderAddress, setHolderAddress] = useState('');
  const [verificationResult, setVerificationResult] = useState<'verified' | 'failed' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyVC = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    // Placeholder untuk logika interaksi smart contract ZKP
    console.log(`Memverifikasi VC untuk alamat: ${holderAddress}`);

    // Simulasikan verifikasi asinkron
    setTimeout(() => {
      const isVerified = Math.random() > 0.5; // Ganti dengan hasil dari smart contract
      setVerificationResult(isVerified ? 'verified' : 'failed');
      setIsVerifying(false);
    }, 2000);
  };

  const getResultClass = () => {
    if (verificationResult === 'verified') return 'text-green-500';
    if (verificationResult === 'failed') return 'text-red-500';
    return '';
  };

  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Verifikasi KYC Holder</h1>
        <p className="hero-description mx-0 text-left">
          Gunakan antarmuka ini untuk memverifikasi Verifiable Credential dari Holder. Proses ini menggunakan Zero-Knowledge Proof untuk memastikan privasi data.
        </p>
      </header>

      <section className="role-cards-section mt-8">
        <h2 className="card-title text-2xl font-bold mb-8">
          <AiOutlineSearch className="inline-block mr-2" /> Formulir Verifikasi
        </h2>
        <form onSubmit={handleVerifyVC} className="role-card">
          <label className="form-label">Alamat Holder</label>
          <input
            type="text"
            value={holderAddress}
            onChange={(e) => setHolderAddress(e.target.value)}
            placeholder="Masukkan alamat dompet Holder"
            className="form-input"
            required
          />

          <button type="submit" className="card-button mt-6" disabled={isVerifying}>
            {isVerifying ? 'Memverifikasi...' : 'Verifikasi VC'}
          </button>

          {verificationResult && (
            <div className={`mt-6 text-center ${getResultClass()}`}>
              {verificationResult === 'verified' ? (
                <p className="text-xl font-bold"><AiOutlineCheckCircle className="inline-block mr-2" /> Verifikasi Berhasil!</p>
              ) : (
                <p className="text-xl font-bold"><AiOutlineCloseCircle className="inline-block mr-2" /> Verifikasi Gagal.</p>
              )}
            </div>
          )}
        </form>
      </section>
    </div>
  );
}