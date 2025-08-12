// apps/web/src/app/dev-auth/layout.tsx
'use client';

import { AuthProviderDev } from './AuthProvider-Dev';

export default function DevAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderDev>
      {children}
    </AuthProviderDev>
  );
}