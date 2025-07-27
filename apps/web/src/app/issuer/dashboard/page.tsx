// apps/web/src/app/issuer/dashboard/page.tsx
'use client';

import { useAccount } from 'wagmi';
import { AiOutlineBank, AiOutlineCheckSquare, AiOutlinePlusSquare } from 'react-icons/ai';

export default function IssuerDashboardPage() {
  const { address, isDisconnected } = useAccount();

  if (isDisconnected) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Hubungkan Dompet Anda</h1>
        <p className="hero-description">Untuk mengakses dashboard Issuer, Anda perlu menghubungkan dompet kripto Anda.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Dashboard Issuer</h1>
        <p className="hero-description mx-0 text-left">
          Selamat datang kembali, {address?.substring(0, 6)}...{address?.substring(address.length - 4)}. Berikut adalah ringkasan aktivitas penerbitan Verifiable Credentials Anda.
        </p>
      </header>

      <section className="role-cards-section mt-8">
        <h2 className="card-title text-2xl font-bold mb-8">
          <AiOutlineBank className="inline-block mr-2" /> Ringkasan Aktivitas
        </h2>
        <div className="role-cards-grid">
          {/* Card Placeholder: Total VC Issued */}
          <div className="role-card">
            <div className="card-icon"><AiOutlineCheckSquare /></div>
            <h3 className="card-title text-xl">VCs Telah Diterbitkan</h3>
            <p className="card-description text-3xl font-extrabold" style={{ color: 'var(--accent-color-start)' }}>
              150
            </p>
            <p className="card-description">vc.management.issuer.address</p>
          </div>

          {/* Card Placeholder: VC Pending */}
          <div className="role-card">
            <div className="card-icon"><AiOutlinePlusSquare /></div>
            <h3 className="card-title text-xl">Permintaan Pending</h3>
            <p className="card-description text-3xl font-extrabold" style={{ color: '#FEE2E2', textShadow: '0 0 5px #EF4444' }}>
              5
            </p>
            <p className="card-description">vc.management.issuer.address</p>
          </div>
        </div>
      </section>
    </div>
  );
}