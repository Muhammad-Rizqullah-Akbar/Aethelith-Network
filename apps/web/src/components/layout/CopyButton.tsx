// apps/web/src/components/layout/CopyButton.tsx
'use client';

import { useState } from 'react';
import { AiOutlineCopy, AiOutlineCheckCircle } from 'react-icons/ai';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
}

export function CopyButton({ textToCopy, label }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset setelah 2 detik
  };

  return (
    <button onClick={handleCopy} className="copy-button">
      <span className="copy-label">{label}</span>
      {isCopied ? (
        <AiOutlineCheckCircle className="copy-icon text-green-500" />
      ) : (
        <AiOutlineCopy className="copy-icon" />
      )}
    </button>
  );
}