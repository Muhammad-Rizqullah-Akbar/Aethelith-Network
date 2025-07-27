// apps/web/src/app/holder/my-did/page.tsx
'use client';

import { useAccount } from 'wagmi';
import { AiOutlineIdcard } from 'react-icons/ai';

export default function MyDidPage() {
  const { address, isDisconnected } = useAccount();

  if (isDisconnected) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Hubungkan Dompet Anda</h1>
        <p className="hero-description">Untuk melihat DID Anda, silakan hubungkan dompet.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Identitas Digital (DID) Anda</h1>
        <p className="hero-description mx-0 text-left">
          DID Anda adalah fondasi identitas digital Anda di protokol ini.
        </p>
      </header>

      <section className="role-cards-section">
        <div className="mt-4 role-card">
          <h2 className="card-title text-2xl font-bold">
            Informasi Dasar
          </h2>
          <p className="card-description">
            Alamat DID Anda: <span className="font-mono" style={{wordBreak: 'break-all'}}>{address}</span>
          </p>
          <p className="card-description">
            Status: <span style={{ color: 'var(--accent-color-start)', fontWeight: 'bold' }}>Terdaftar & Aktif</span>
          </p>
        </div>

        <div className="mt-8 role-card">
          <h2 className="card-title text-2xl font-bold">
            Detail Teknis
          </h2>
          <p className="card-description">
            Format DID: `did:ethr:{address}` (Ethereum Registry)
          </p>
          <p className="card-description">
            Kontrak Registry: `DIDRegistry.sol`
          </p>
          <p className="card-description">
            Tanggal Pendaftaran: 25 Juli 2025 (placeholder)
          </p>
        </div>
      </section>
    </div>
  );
}