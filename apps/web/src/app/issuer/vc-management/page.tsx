// apps/web/src/app/issuer/vc-management/page.tsx
'use client';

import { useAccount } from 'wagmi';
import { AiOutlineTable } from 'react-icons/ai';
import { CopyButton } from '../../../components/layout/CopyButton'; // Sesuaikan path

interface IssuedVC {
  id: number;
  vcId: string;
  recipient: string;
  status: 'Active' | 'Revoked';
  issueDate: string;
}

export default function VcManagementPage() {
  const { isDisconnected } = useAccount();

  const dummyIssuedVCs: IssuedVC[] = [
    { id: 1, vcId: '0x1a2b3c4d...', recipient: '0xabc123...', status: 'Active', issueDate: '2025-07-21' },
    { id: 2, vcId: '0x5e6f7g8h...', recipient: '0xdef456...', status: 'Active', issueDate: '2025-07-15' },
    { id: 3, vcId: '0x9i0j1k2l...', recipient: '0xghi789...', status: 'Revoked', issueDate: '2025-07-10' },
    { id: 4, vcId: '0x3m4n5o6p...', recipient: '0xjkl012...', status: 'Active', issueDate: '2025-07-05' },
  ];

  if (isDisconnected) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">Hubungkan Dompet Anda</h1>
        <p className="hero-description">Anda harus menghubungkan dompet untuk melihat VC yang Anda terbitkan.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="hero-section text-left">
        <h1 className="hero-title">Manajemen Verifiable Credential</h1>
        <p className="hero-description mx-0 text-left">
          Berikut adalah daftar semua VC yang telah Anda terbitkan.
        </p>
      </header>

      <section className="role-cards-section mt-8">
        <h2 className="card-title text-2xl font-bold mb-8">
          <AiOutlineTable className="inline-block mr-2" /> Daftar VC
        </h2>
        <div className="vc-management-table-container">
          <div className="vc-management-table-header">
            <span>VC ID</span>
            <span>Penerima</span>
            <span>Status</span>
            <span>Tanggal Terbit</span>
          </div>
          {dummyIssuedVCs.map((vc) => (
            <div key={vc.id} className="vc-management-table-row">
              <span className="flex items-center gap-2">
                {vc.vcId}
                <CopyButton textToCopy={vc.vcId} />
              </span>
              <span className="flex items-center gap-2">
                {vc.recipient}
                <CopyButton textToCopy={vc.recipient} />
              </span>
              <span className={`vc-status vc-status-${vc.status.toLowerCase()}`}>{vc.status}</span>
              <span>{vc.issueDate}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}