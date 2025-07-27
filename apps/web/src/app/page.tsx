// apps/web/src/app/page.tsx
import Link from 'next/link';
import { AiOutlineUser, AiOutlineBank, AiOutlineSearch, AiOutlineCheckCircle } from 'react-icons/ai';

// Komponen Card yang dapat digunakan kembali
const RoleCard = ({ title, description, link, buttonText, icon }: {
  title: string;
  description: string;
  link: string;
  buttonText: string;
  icon: React.ReactNode;
}) => (
  <div className="role-card">
    <div className="card-icon">{icon}</div>
    <h2 className="card-title">{title}</h2>
    <p className="card-description">{description}</p>
    <Link href={link}>
      <button className="card-button">
        {buttonText}
      </button>
    </Link>
  </div>
);

export default function HomePage() {
  return (
    <div className="py-12">
      {/* Bagian Hero */}
      <header className="hero-section">
        <h1 className="hero-title">
          Hi Aetheliters, Nice to Meet You!
        </h1>
        <p className="mx-auto max-w-2xl hero-description">
          Platform terdesentralisasi Anda untuk mengelola identitas digital (DID) dan kredensial terverifikasi (VC) dengan privasi dan keamanan tinggi.
        </p>
      </header>

      {/* Bagian Kartu Peran */}
      <section className="role-cards-section">
        <div className="role-cards-grid">
          {/* Card untuk Holder */}
          <RoleCard
            icon={<AiOutlineUser />}
            title="Sebagai Holder"
            description="Kelola identitas digital Anda, simpan Verifiable Credential (VC), dan bagikan bukti privasi-privasi."
            link="/holder/my-did" // --- PERUBAHAN KUNCI ---
            buttonText="Lihat Dashboard Holder"
          />

          {/* Card untuk Issuer */}
          <RoleCard
            icon={<AiOutlineBank />}
            title="Sebagai Issuer"
            description="Terbitkan Verifiable Credential (VC) ke Holder setelah proses verifikasi KYC yang sukses."
            link="/issuer/dashboard" // --- PERUBAHAN KUNCI ---
            buttonText="Lihat Dashboard Issuer"
          />

          {/* Card untuk Verifier */}
          <RoleCard
            icon={<AiOutlineSearch />}
            title="Sebagai Verifier"
            description="Verifikasi bukti kredensial (Zero-Knowledge Proof) dari Holder untuk memastikan keaslian data."
            link="/verifier/verify-kyc" // --- PERUBAHAN KUNCI ---
            buttonText="Lihat Dashboard Verifier"
          />
        </div>
      </section>
    </div>
  );
}