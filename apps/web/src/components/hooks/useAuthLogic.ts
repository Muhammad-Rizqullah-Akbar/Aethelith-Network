'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { encryptAndStoreData } from '../../lib/indexedDB';

export function useAuthLogic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect ke dashboard setelah login sukses
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, nik: string, alamat: string, tanggalLahir: string) => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Dapatkan ID Token pengguna
      const idToken = await getIdToken(user);

      // Gunakan ID Token sebagai keyMaterial untuk enkripsi
      await encryptAndStoreData(user.uid, idToken, name, nik, alamat, tanggalLahir);

      // Arahkan ke halaman profil setelah pendaftaran sukses
      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
    setError,
  };
}