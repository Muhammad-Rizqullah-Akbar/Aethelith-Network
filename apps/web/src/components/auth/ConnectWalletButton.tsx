// apps/web/src/components/layout/ConnectButton.tsx
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';

export function ConnectButton() {
  const [hasMounted, setHasMounted] = useState(false);
  const { address } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  // Tampilan ketika dompet terhubung
  if (address) {
    return (
      <div className="connected-wallet-container">
        <p className="connected-wallet-address">
          {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </p>
        <button onClick={() => disconnect()} className="disconnect-button">
          Disconnect
        </button>
      </div>
    );
  }

  // Tampilan ketika dompet belum terhubung
  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="connect-button"
          disabled={isPending}
        >
          {isPending ? 'Connecting...' : `Connect Wallet`}
        </button>
      ))}
    </div>
  );
}