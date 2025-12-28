'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { JOURNAL_REGISTRY_ABI, JOURNAL_REGISTRY_ADDRESS } from '@/lib/contracts';
import { Transaction } from '@/types';
import axios from 'axios';

const COVALENT_API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
const BASE_CHAIN_ID = 8453; // Base Mainnet

/**
 * Hook to fetch Base transactions for the connected wallet
 * Integrates with Covalent API and checks the JournalRegistry for existing notes
 */
export function useBaseTransactions() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      return;
    }

    fetchTransactions();
  }, [address]);

  async function fetchTransactions() {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch transactions from Covalent
      const response = await axios.get(
        `https://api.covalenthq.com/v1/${BASE_CHAIN_ID}/address/${address}/transactions_v2/`,
        {
          params: {
            'quote-currency': 'USD',
            'page-size': 100,
            key: COVALENT_API_KEY,
          },
        }
      );

      const items = response.data.data.items || [];

      // Transform Covalent data to our Transaction type
      const formattedTransactions: Transaction[] = items.map((tx: any) => ({
        hash: tx.tx_hash,
        date: new Date(tx.block_signed_at),
        amount: (parseInt(tx.value) / 1e18).toFixed(4),
        from: tx.from_address,
        to: tx.to_address,
        type: tx.from_address.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
        hasNote: false, // Will be updated below
        gasUsed: tx.gas_spent?.toString(),
        value: tx.value,
      }));

      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
      
      // Use mock data for development
      setTransactions(getMockTransactions(address));
    } finally {
      setIsLoading(false);
    }
  }

  const { data: hasEntriesData } = useReadContracts({
    contracts: transactions.map((tx) => ({
      address: JOURNAL_REGISTRY_ADDRESS,
      abi: JOURNAL_REGISTRY_ABI,
      functionName: 'hasEntry',
      args: [address as `0x${string}`, tx.hash as `0x${string}`],
    })),
    query: {
      enabled: transactions.length > 0 && !!address,
    }
  });

  // Merge data
  const transactionsWithNotes = transactions.map((tx, index) => ({
    ...tx,
    hasNote: (hasEntriesData?.[index]?.result as unknown as boolean) || false,
  }));

  return { transactions: transactionsWithNotes, isLoading, error, refetch: fetchTransactions };
}

/**
 * Hook to check if a specific transaction has a journal entry
 */
export function useHasJournalEntry(txHash: string) {
  const { address } = useAccount();

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: JOURNAL_REGISTRY_ADDRESS,
        abi: JOURNAL_REGISTRY_ABI,
        functionName: 'hasEntry',
        args: [address as `0x${string}`, txHash as `0x${string}`],
      },
      {
        address: JOURNAL_REGISTRY_ADDRESS,
        abi: JOURNAL_REGISTRY_ABI,
        functionName: 'getEntry',
        args: [address as `0x${string}`, txHash as `0x${string}`],
      },
    ],
  });

  const hasEntry = data?.[0]?.result as boolean;
  const entry = data?.[1]?.result as any;

  return {
    hasEntry: hasEntry || false,
    ipfsCid: entry?.[0] || null,
    timestamp: entry?.[1] ? Number(entry[1]) : null,
    isLoading,
  };
}

/**
 * Mock data for development/testing
 */
function getMockTransactions(address: string): Transaction[] {
  const now = new Date();
  return [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      amount: '0.05',
      from: address,
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      type: 'sent',
      hasNote: false,
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      amount: '0.1',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      to: address,
      type: 'received',
      hasNote: false,
    },
    {
      hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      amount: '0.025',
      from: address,
      to: '0x1234567890abcdef1234567890abcdef12345678',
      type: 'sent',
      hasNote: false,
    },
  ];
}
