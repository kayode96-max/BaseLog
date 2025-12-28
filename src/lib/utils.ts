/**
 * Utility functions for BaseLog
 */

/**
 * Format an Ethereum address to a short version
 * @param address Full Ethereum address
 * @param chars Number of characters to show on each side (default: 4)
 * @returns Shortened address (e.g., "0x1234...5678")
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a transaction hash
 * @param hash Transaction hash
 * @returns Shortened hash
 */
export function formatTxHash(hash: string): string {
  return formatAddress(hash, 6);
}

/**
 * Format ETH amount with proper decimals
 * @param wei Amount in wei
 * @param decimals Number of decimals to show (default: 4)
 * @returns Formatted ETH amount
 */
export function formatEth(wei: string | bigint, decimals: number = 4): string {
  const ethValue = Number(wei) / 1e18;
  return ethValue.toFixed(decimals);
}

/**
 * Copy text to clipboard
 * @param text Text to copy
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Open transaction on Basescan
 * @param txHash Transaction hash
 * @param isTestnet Whether to use testnet explorer
 */
export function openOnBasescan(txHash: string, isTestnet: boolean = false): void {
  const baseUrl = isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org';
  window.open(`${baseUrl}/tx/${txHash}`, '_blank');
}

/**
 * Open address on Basescan
 * @param address Ethereum address
 * @param isTestnet Whether to use testnet explorer
 */
export function openAddressOnBasescan(address: string, isTestnet: boolean = false): void {
  const baseUrl = isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org';
  window.open(`${baseUrl}/address/${address}`, '_blank');
}

/**
 * Format IPFS CID for display
 * @param cid IPFS content identifier
 * @returns Shortened CID
 */
export function formatIpfsCid(cid: string): string {
  if (!cid) return '';
  return `${cid.slice(0, 10)}...${cid.slice(-8)}`;
}

/**
 * Get IPFS gateway URL
 * @param cid IPFS content identifier
 * @returns Full gateway URL
 */
export function getIpfsUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

/**
 * Validate Ethereum address
 * @param address Address to validate
 * @returns True if valid
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate transaction hash
 * @param hash Transaction hash to validate
 * @returns True if valid
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Truncate text to max length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Format date for display
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date with time
 * @param date Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param date Date to compare
 * @returns Relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
}

/**
 * Calculate completion percentage
 * @param completed Number of completed items
 * @param total Total number of items
 * @returns Percentage (0-100)
 */
export function calculatePercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Group transactions by date
 * @param transactions Array of transactions
 * @returns Map of date string to transactions
 */
export function groupTransactionsByDate<T extends { date: Date }>(
  transactions: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  
  transactions.forEach((tx) => {
    const dateKey = formatDate(tx.date);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(tx);
  });
  
  return grouped;
}

/**
 * Debounce function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
