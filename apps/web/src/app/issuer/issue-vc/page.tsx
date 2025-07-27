// apps/web/src/app/issuer/issue-vc/page.tsx
'use client';

import React, { useState } from 'react'; // Impor React di sini
import { useAccount } from 'wagmi';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export default function IssueVcPage() {
  const { address, isDisconnected } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [kycStatus, setKycStatus] = useState('Verified');

  if (isDisconnected) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Hubungkan Dompet Anda</h1>
        <p className="hero-description">Anda harus menghubungkan dompet untuk menerbitkan VC.</p>
      </div>
    );
  }
  
  const handleIssueVC = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder untuk logika interaksi smart contract
    console.log(`Menerbitkan VC untuk ${recipientAddress} dengan status KYC: ${kycStatus}`);
    alert(`VC akan diterbitkan untuk ${recipientAddress}`);
  };

  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Terbitkan Verifiable Credential (VC)</h1>
        <p className="hero-description mx-0 text-left">
          Gunakan formulir di bawah ini untuk menerbitkan VC baru ke Holder.
        </p>
      </header>

      <section className="role-cards-section mt-8">
        <h2 className="card-title text-2xl font-bold mb-8">
          <AiOutlinePlusCircle className="inline-block mr-2" /> Formulir Penerbitan
        </h2>
        <form onSubmit={handleIssueVC} className="role-card">
          <label className="form-label">Alamat Penerima (Holder)</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="form-input"
            required
          />

          <label className="form-label mt-4">Status KYC</label>
          <select
            value={kycStatus}
            onChange={(e) => setKycStatus(e.target.value)}
            className="form-input"
          >
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
          </select>

          <button type="submit" className="card-button mt-6">
            Terbitkan VC
          </button>
        </form>
      </section>
    </div>
  );
}