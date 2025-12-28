export interface Transaction {
  hash: string;
  date: Date;
  amount: string;
  from: string;
  to: string;
  type: 'sent' | 'received';
  hasNote: boolean;
  existingCid?: string;
  gasUsed?: string;
  value?: string;
}

export interface JournalEntry {
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  timestamp: number;
  txHash: string;
}

export interface IPFSMetadata {
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  timestamp: number;
  txHash: string;
  amount?: string;
  from?: string;
  to?: string;
}
