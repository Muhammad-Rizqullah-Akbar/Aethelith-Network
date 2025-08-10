// apps/web/src/components/layout/AuthProvider-Dev.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  roles: ('validator' | 'verifier')[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  loginDeveloper: (credentials: any) => Promise<boolean>;
  logout: () => void;
}

const defaultAuthContextValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  loading: false,
  loginDeveloper: async () => false,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export function AuthProviderDev({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Data dummy yang sama
  const dummyRegisteredDevelopers: Record<string, any> = {
    'inst-val-123': { email: 'validator@demo.com', apiKey: 'key-val-abc', roles: ['validator'] },
    'inst-ver-456': { email: 'verifier@demo.com', apiKey: 'key-ver-xyz', roles: ['verifier'] },
  };

  useEffect(() => {
    // Abaikan otentikasi dari localStorage untuk demo
  }, []);

  // Fungsi ini tidak akan pernah dipanggil dalam demo ini, tetapi tetap ada
  const loginDeveloper = async (credentials: any) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('dummyUser');
    router.push('/dev-auth');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, loginDeveloper, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthDev = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthDev must be used within an AuthProviderDev');
  }
  return context;
};