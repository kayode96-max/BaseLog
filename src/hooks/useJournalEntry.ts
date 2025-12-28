'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { JOURNAL_REGISTRY_ABI, JOURNAL_REGISTRY_ADDRESS } from '@/lib/contracts';
import { uploadToIPFS } from '@/lib/ipfs';
import { IPFSMetadata } from '@/types';
import { keccak256, toBytes } from 'viem';

export function useJournalEntry() {
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  async function saveJournalEntry(metadata: IPFSMetadata) {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Step 1: Upload to IPFS
      const cid = await uploadToIPFS(metadata);
      
      // Step 2: Convert transaction hash to bytes32
      const txHashBytes = metadata.txHash as `0x${string}`;

      // Step 3: Call smart contract
      writeContract({
        address: JOURNAL_REGISTRY_ADDRESS,
        abi: JOURNAL_REGISTRY_ABI,
        functionName: 'logEntry',
        args: [txHashBytes, cid],
      });

      setIsUploading(false);
      return cid;
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      setUploadError(error.message || 'Failed to save journal entry');
      setIsUploading(false);
      throw error;
    }
  }

  return {
    saveJournalEntry,
    isUploading,
    isPending,
    isConfirming,
    isSuccess,
    error: uploadError || writeError?.message,
    hash,
  };
}
