'use client';

import { useState, useEffect } from 'react';
import { normalize } from 'viem/ens';
import { useEnsName, useEnsAddress } from 'wagmi';
import { mainnet } from 'wagmi/chains';

/**
 * Hook to resolve an address to a Basename or ENS name
 * Base Names are built on top of ENS, so we can use the same resolution
 */
export function useBasename(address: `0x${string}` | undefined) {
  const { data: ensName, isLoading } = useEnsName({
    address,
    chainId: mainnet.id, // ENS lives on mainnet
  });

  // Format the name if it exists
  const basename = ensName ? ensName : null;
  const displayName = basename || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '');

  return {
    basename,
    displayName,
    isLoading,
  };
}

/**
 * Hook to resolve a Basename to an address
 */
export function useBasenameAddress(name: string | undefined) {
  const { data: address, isLoading } = useEnsAddress({
    name: name ? normalize(name) : undefined,
    chainId: mainnet.id,
  });

  return {
    address,
    isLoading,
  };
}

/**
 * Utility function to check if a string looks like a Basename
 */
export function isBasename(str: string): boolean {
  return str.endsWith('.base.eth') || str.endsWith('.eth');
}

/**
 * Format an address with Basename support
 */
export function formatAddressWithBasename(
  address: string,
  basename: string | null
): string {
  if (basename) {
    return basename;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
