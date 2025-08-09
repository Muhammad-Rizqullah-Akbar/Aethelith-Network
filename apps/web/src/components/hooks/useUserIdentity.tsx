'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface UserIdentity {
  uid: string;
  email: string | null;
  did: string | null;
}

export function useUserIdentity() {
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await fetch(`/api/user/get-did?uid=${user.uid}`);
          const data = await response.json();
          setUserIdentity({
            uid: user.uid,
            email: user.email,
            did: data.did || null,
          });
          setIsConnected(true);
        } catch (error) {
          console.error("Gagal mengambil DID pengguna", error);
          setUserIdentity({
            uid: user.uid,
            email: user.email,
            did: null,
          });
          setIsConnected(true);
        }
      } else {
        setUserIdentity(null);
        setIsConnected(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return {
    userIdentity,
    userDid: userIdentity?.did ?? null, // Perbaikan di sini
    isConnected,
    logout,
  };
}