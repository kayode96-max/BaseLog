'use client';

import { useBasename } from '@/hooks/useBasename';

interface AddressDisplayProps {
  address: string;
  className?: string;
  showFull?: boolean;
}

export function AddressDisplay({ address, className = '', showFull = false }: AddressDisplayProps) {
  const { displayName, basename, isLoading } = useBasename(address as `0x${string}`);

  if (isLoading) {
    return (
      <span className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
        Loading...
      </span>
    );
  }

  return (
    <span className={className} title={address}>
      {basename ? (
        <span className="text-primary font-medium">{basename}</span>
      ) : showFull ? (
        <span className="font-mono text-xs">{address}</span>
      ) : (
        <span className="font-mono text-xs">{displayName}</span>
      )}
    </span>
  );
}
