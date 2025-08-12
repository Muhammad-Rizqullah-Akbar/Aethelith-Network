// apps/web/src/app/login/page.tsx

import AuthLayout from '../../components/auth/AuthLayout';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense>
      <AuthLayout type="login" />
    </Suspense>
  );
}
