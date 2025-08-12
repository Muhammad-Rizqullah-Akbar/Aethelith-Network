'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUserIdentity } from '../hooks/useUserIdentity';

// Definisikan tipe untuk context
interface AuthContextType {
  userIdentity: { uid: string; email: string | null; did: string | null } | null;
  userDid: string | null;
  isConnected: boolean;
  logout: () => Promise<void>;
}

// Berikan nilai awal yang sesuai dengan tipenya
const defaultAuthContextValue: AuthContextType = {
  userIdentity: null,
  userDid: null,
  isConnected: false,
  logout: async () => {
    // Tambahkan log agar tidak empty function
    console.log('User logged out (default context)');
  },
};

// Buat konteks untuk autentikasi dengan nilai awal yang sudah didefinisikan
const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

// Buat provider yang akan membungkus aplikasi Anda
export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useUserIdentity();
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

// Buat hook kustom untuk memudahkan akses ke context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;