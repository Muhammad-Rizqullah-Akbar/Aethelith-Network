// apps/web/src/components/layout/NavbarControls.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProfileButton } from './ProfileButton';
import { ConnectButton } from '../auth/ConnectWalletButton';

export function NavbarControls() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="navbar-controls">
      <ProfileButton />
      <ConnectButton />
    </div>
  );
}