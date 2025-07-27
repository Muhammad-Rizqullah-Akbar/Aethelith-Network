// apps/web/src/app/profile/page.tsx
'use client';

import { useAccount } from 'wagmi';
import { AiOutlineUser, AiOutlineIdcard, AiOutlineTrophy, AiOutlineCheckCircle } from 'react-icons/ai';

export default function ProfilePage() {
  const { address, isDisconnected } = useAccount();
  
  if (isDisconnected) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Hubungkan Dompet Anda</h1>
        <p className="hero-description">Untuk melihat profil Anda, silakan hubungkan dompet.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Profil Pengguna</h1>
        <p className="hero-description mx-0 text-left">
          Informasi lengkap terkait identitas digital dan status kredensial Anda.
        </p>
      </header>

      <section className="role-cards-section mt-8">
        <h2 className="card-title text-2xl font-bold mb-8">
          <AiOutlineUser className="inline-block mr-2" /> Informasi Dasar
        </h2>
        <div className="role-card role-card-profile-header">
          {/* --- Perubahan Kunci: Tambah Avatar --- */}
          <div className="avatar-container">
            <AiOutlineUser className="avatar-icon" />
          </div>
          <div className="user-info-container">
            <p className="card-description">
              Alamat Dompet (DID): <span className="font-mono">{address}</span>
            </p>
            <p className="card-description">
              Status: <span style={{ color: 'var(--accent-color-start)', fontWeight: 'bold' }}>Terhubung</span>
            </p>
            <p className="card-description">
              Nama Profil: <span style={{ color: 'var(--accent-color-start)', fontWeight: 'bold' }}>Pengguna Anonim</span>
            </p>
          </div>
          {/* --- Akhir Perubahan Kunci --- */}
        </div>
      </section>

      <section className="role-cards-section mt-8">
        <h2 className="card-title text-2xl font-bold mb-8">
          <AiOutlineIdcard className="inline-block mr-2" /> Status Kredensial
        </h2>
        <div className="role-cards-grid">
          <div className="role-card">
            <div className="card-icon"><AiOutlineTrophy /></div>
            <h3 className="card-title text-xl">Total VC Dimiliki</h3>
            <p className="card-description text-3xl font-extrabold" style={{ color: 'var(--accent-color-start)' }}>
              3
            </p>
          </div>

          <div className="role-card">
            <div className="card-icon"><AiOutlineCheckCircle /></div>
            <h3 className="card-title text-xl">VC Aktif</h3>
            <p className="card-description text-3xl font-extrabold" style={{ color: 'var(--accent-color-start)' }}>
              2
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}