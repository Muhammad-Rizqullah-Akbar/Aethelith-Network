// apps/web/src/components/layout/CopyButton.tsx
'use client';

import { useState } from 'react';
import { AiOutlineCopy, AiOutlineCheckCircle } from 'react-icons/ai';

interface CopyButtonProps {
  textToCopy: string;
  className?: string; // Menambahkan properti className sebagai opsional
}

export function CopyButton({ textToCopy, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button onClick={handleCopy} className={className}>
      {isCopied ? <AiOutlineCheckCircle /> : <AiOutlineCopy />}
    </button>
  );
}