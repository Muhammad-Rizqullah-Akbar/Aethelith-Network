// hooks/useAuthLogic.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { encryptAndStoreData } from '../../lib/indexedDB';

// Definisi interface untuk data pengguna yang akan disimpan
interface UserDataToStore {
  name: string;
  nik: string;
  alamat: string;
  tanggalLahir: string;
}

export function useAuthLogic() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful, redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unknown login error occurred.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleRegister = useCallback(async (
    email: string,
    password: string,
    userData: UserDataToStore // Menerima objek userData
  ): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user: User = userCredential.user;

      await encryptAndStoreData(
        user.uid,
        password, // <-- Menggunakan password sebagai keyMaterial
        userData.name,
        userData.nik,
        userData.alamat,
        userData.tanggalLahir
      );
      console.log('User data successfully stored in IndexedDB with password-derived key.');

      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An unknown registration error occurred.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    loading,
    error,
    handleLogin,
    handleRegister, // <--- KEMBALIKAN KE handleRegister
    setError,
  };
}