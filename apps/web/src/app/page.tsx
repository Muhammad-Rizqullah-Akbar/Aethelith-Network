// apps/web/src/app/page.tsx
"use client";

import Link from 'next/link';
import { AiOutlineUser, AiOutlineBank, AiOutlineSearch } from 'react-icons/ai';

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
    <div className="relative py-12 min-h-screen">
      <div className="absolute top-4 right-4 flex gap-4 z-10">
        <Link href="/login">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors">
            Register
          </button>
        </Link>
      </div>

      <header className="hero-section">
        <h1 className="hero-title">
          Hi Aetheliters, Nice to Meet You!
        </h1>
        <p className="mx-auto max-w-2xl hero-description">
          Platform terdesentralisasi Anda untuk mengelola identitas digital (DID) dan kredensial terverifikasi (VC) dengan privasi dan keamanan tinggi.
        </p>
      </header>

      <section className="text-center mt-8 mb-12">
        <h2 className="text-3xl font-bold mb-4">Mulai Sekarang</h2>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <button className="card-button primary-button">Login</button>
          </Link>
          <Link href="/register">
            <button className="card-button secondary-button">Daftar Akun Baru</button>
          </Link>
        </div>
      </section>

      <section className="role-cards-section">
        <div className="role-cards-grid">
          <RoleCard
            icon={<AiOutlineUser />}
            title="Sebagai Holder"
            description="Kelola identitas digital Anda, simpan Verifiable Credential (VC), dan bagikan bukti privasi-privasi."
            link="/holder/my-did"
            buttonText="Lihat Dashboard Holder"
          />

          <RoleCard
            icon={<AiOutlineBank />}
            title="Sebagai Issuer"
            description="Terbitkan Verifiable Credential (VC) ke Holder setelah proses verifikasi KYC yang sukses."
            link="/issuer/dashboard"
            buttonText="Lihat Dashboard Issuer"
          />

          <RoleCard
            icon={<AiOutlineSearch />}
            title="Sebagai Verifier"
            description="Verifikasi bukti kredensial (Zero-Knowledge Proof) dari Holder untuk memastikan keaslian data."
            link="/verifier/verify-kyc"
            buttonText="Lihat Dashboard Verifier"
          />
        </div>
      </section>
    </div>
  );
}