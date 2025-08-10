// apps/web/src/app/register/page.tsx

import AuthLayout from '../../components/auth/AuthLayout';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <Suspense>
      <AuthLayout type="register" />
    </Suspense>
  );
}
