// apps/web/src/app/holder/my-vcs/page.tsx
'use client';

import { useAccount } from 'wagmi';
import { AiOutlineIdcard, AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';

// --- Definisi Tipe Data (Diperbarui) ---
interface VcCardProps {
  id: number; // --- BARIS BARU DI SINI ---
  title: string;
  status: 'Active' | 'Revoked';
  issuer: string;
  issueDate: string;
  description: string;
}

// Komponen Card VC
const VcCard = ({ id, title, status, issuer, issueDate, description }: VcCardProps) => (
  <div className="vc-card">
    <div className="vc-header">
      <div className="vc-icon">
        {status === 'Active' ? <AiOutlineCheckCircle style={{ color: 'var(--accent-color-start)' }} /> : <AiOutlineInfoCircle style={{ color: '#FCD34D' }} />}
      </div>
      <div>
        <h3 className="vc-title">{title}</h3>
        <p className="vc-issuer">Issued by: {issuer}</p>
      </div>
    </div>
    <p className="vc-description">{description}</p>
    <div className="vc-footer">
      <span className={`vc-status vc-status-${status.toLowerCase()}`}>{status}</span>
      <span className="vc-issue-date">Issued on: {issueDate}</span>
    </div>
  </div>
);

export default function MyVcsPage() {
  const { isDisconnected } = useAccount();

  const dummyVCs: VcCardProps[] = [
    { id: 1, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-07-21', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
    { id: 2, title: 'Accredited Investor', status: 'Revoked', issuer: 'Issuer Beta', issueDate: '2025-07-15', description: 'This credential certifies you as an accredited investor.' },
    { id: 3, title: 'Age Verified (18+)', status: 'Active', issuer: 'Issuer Gamma', issueDate: '2025-07-10', description: 'This credential verifies that you are above 18 years of age.' },
    { id: 4, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-07-05', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
    { id: 5, title: 'Accredited Investor', status: 'Active', issuer: 'Issuer Beta', issueDate: '2025-06-28', description: 'This credential certifies you as an accredited investor.' },
    { id: 6, title: 'Age Verified (18+)', status: 'Active', issuer: 'Issuer Gamma', issueDate: '2025-06-25', description: 'This credential verifies that you are above 18 years of age.' },
    { id: 7, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-06-20', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
    { id: 8, title: 'Accredited Investor', status: 'Revoked', issuer: 'Issuer Beta', issueDate: '2025-06-18', description: 'This credential certifies you as an accredited investor.' },
    { id: 9, title: 'Age Verified (18+)', status: 'Active', issuer: 'Issuer Gamma', issueDate: '2025-06-12', description: 'This credential verifies that you are above 18 years of age.' },
    { id: 10, title: 'KYC Verified', status: 'Active', issuer: 'Issuer Alpha', issueDate: '2025-06-08', description: 'This credential confirms that your identity has been verified successfully by Issuer Alpha.' },
  ];

  if (isDisconnected) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Hubungkan Dompet Anda</h1>
        <p className="hero-description">Untuk melihat Verifiable Credentials Anda, silakan hubungkan dompet.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Verifiable Credentials (VCs) Anda</h1>
        <p className="hero-description mx-0 text-left">
          Berikut adalah daftar Verifiable Credentials yang telah Anda terima.
        </p>
      </header>

      <section className="role-cards-section">
        <h2 className="card-title text-2xl font-bold mb-8">
          <AiOutlineIdcard className="inline-block mr-2" /> Daftar VCs
        </h2>
        <div className="vc-grid">
          {dummyVCs.map(vc => (
            <VcCard
              key={vc.id}
              id={vc.id} // Perbaiki di sini
              title={vc.title}
              status={vc.status}
              issuer={vc.issuer}
              issueDate={vc.issueDate}
              description={vc.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}