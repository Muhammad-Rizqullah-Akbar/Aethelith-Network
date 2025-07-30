// apps/web/src/app/register/page.tsx
"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Ikon dihapus dari import karena tidak digunakan lagi
// import { UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon, HomeIcon, CalendarIcon } from '@heroicons/react/24/outline';

import { encryptAndStoreData } from '../../lib/indexedDB';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [nik, setNik] = useState('');
    const [alamat, setAlamat] = useState('');
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Langkah 1: Pendaftaran Email & Kata Sandi dengan Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User registered via Firebase:', user);
            alert('Pendaftaran email/kata sandi berhasil! UID: ' + user.uid);

            // Langkah 2: Enkripsi Data Sensitif (NIK, Alamat, Tanggal Lahir) menggunakan AES dari indexedDB.ts
            // Fungsi encryptAndStoreData akan menangani enkripsi internal
            await encryptAndStoreData(
                user.uid,
                fullName, // Nama lengkap tidak dienkripsi di IndexedDB
                nik, // Data asli akan dienkripsi di dalam fungsi encryptAndStoreData
                alamat,
                tanggalLahir
            );
            console.log('Data sensitif terenkripsi disimpan ke IndexedDB.');

            // Langkah 3: Arahkan ke Halaman complete-profile
            // Hanya UID dan Nama Lengkap yang dikirim sebagai query param.
            // Data sensitif lainnya sudah di IndexedDB.
            router.push(`/complete-profile?uid=${user.uid}&fullName=${encodeURIComponent(fullName)}`);

        } catch (err: any) {
            console.error('Error registering user:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-lg shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Daftar Akun Baru
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Isi data diri Anda untuk membuat akun
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-md relative text-sm" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}
                    <div className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label htmlFor="fullName" className="sr-only">Nama Lengkap</label>
                            {/* Menghapus div ikon dan menyesuaikan padding input */}
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Nama Lengkap"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            {/* Menghapus div ikon dan menyesuaikan padding input */}
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Kata Sandi */}
                        <div>
                            <label htmlFor="password" className="sr-only">Kata Sandi</label>
                            {/* Menghapus div ikon dan menyesuaikan padding input */}
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Kata Sandi"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* NIK */}
                        <div>
                            <label htmlFor="nik" className="sr-only">NIK</label>
                            {/* Menghapus div ikon dan menyesuaikan padding input */}
                            <input
                                id="nik"
                                name="nik"
                                type="text"
                                required
                                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Nomor Induk Kependudukan (NIK)"
                                value={nik}
                                onChange={(e) => setNik(e.target.value)}
                            />
                        </div>
                        {/* Alamat */}
                        <div>
                            <label htmlFor="alamat" className="sr-only">Alamat</label>
                            {/* Menghapus div ikon dan menyesuaikan padding input */}
                            <input
                                id="alamat"
                                name="alamat"
                                type="text"
                                required
                                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Alamat Lengkap"
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                            />
                        </div>
                        {/* Tanggal Lahir */}
                        <div>
                            <label htmlFor="tanggalLahir" className="sr-only">Tanggal Lahir</label>
                            {/* Menghapus div ikon dan menyesuaikan padding input */}
                            <input
                                id="tanggalLahir"
                                name="tanggalLahir"
                                type="date"
                                required
                                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Tanggal Lahir"
                                value={tanggalLahir}
                                onChange={(e) => setTanggalLahir(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-300">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors duration-200">
                                Login di sini
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out"
                            disabled={loading}
                        >
                            {loading ? 'Mendaftar...' : 'Daftar Akun'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}