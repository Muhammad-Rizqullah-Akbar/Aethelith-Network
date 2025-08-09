// apps/web/src/app/issuer/dashboard/page.tsx
'use client';

import { AiOutlineBank, AiOutlineCheckSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import { useAuth } from '../../../components/layout/AuthProvider';

export default function IssuerDashboardPage() {
  const { userDid, isConnected } = useAuth();

  // Tampilan loading
  if (userDid === undefined) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Memuat...</h1>
      </div>
    );
  }

  // Tampilan jika pengguna belum login
  if (!isConnected) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Akses Ditolak</h1>
        <p className="hero-description">Untuk mengakses dashboard Issuer, Anda perlu login terlebih dahulu.</p>
      </div>
    );
  }

  // Tampilan jika pengguna sudah login
  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Dashboard Issuer</h1>
        <p className="hero-description mx-0 text-left">
          Selamat datang kembali, {userDid?.substring(0, 6)}...{userDid?.substring(userDid.length - 4)}. Berikut adalah ringkasan aktivitas penerbitan Verifiable Credentials Anda.
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