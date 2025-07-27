// apps/web/src/components/layout/navbar.tsx
'use client';

import { NavbarControls } from './NavbarControls';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Aethelith Network
      </div>
      <NavbarControls />
    </nav>
  );
}