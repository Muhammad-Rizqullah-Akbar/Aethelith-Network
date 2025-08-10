'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../components/layout/AuthProvider';

// Buat React Query client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <WagmiProvider config={config}> <-- Hapus baris ini
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
    // </WagmiProvider> <-- Hapus baris ini
  );
}
