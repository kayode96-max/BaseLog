import axios from 'axios';
import { IPFSMetadata } from '@/types';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

if (!PINATA_JWT) {
  console.warn('⚠️ PINATA_JWT is not set. IPFS uploads will fail.');
}

const pinataAxios = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    Authorization: `Bearer ${PINATA_JWT}`,
  },
  timeout: 30000, // 30 second timeout
});

/**
 * Upload journal entry metadata to IPFS via Pinata
 * @param metadata The journal entry data to upload
 * @returns The IPFS CID
 */
export async function uploadToIPFS(metadata: IPFSMetadata): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error('IPFS service not configured. Please set PINATA_JWT environment variable.');
  }

  try {
    // Add versioning and metadata for better tracking
    const enrichedMetadata = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      data: metadata,
    };

    const response = await pinataAxios.post('/pinning/pinJSONToIPFS', {
      pinataContent: enrichedMetadata,
      pinataMetadata: {
        name: `BaseLog-${metadata.txHash.slice(0, 10)}-${Date.now()}`,
        keyvalues: {
          txHash: metadata.txHash,
          timestamp: metadata.timestamp.toString(),
          category: metadata.category || 'uncategorized',
        },
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    const cid = response.data.IpfsHash;
    console.log(`✅ Successfully uploaded to IPFS: ${cid}`);
    
    return cid;
  } catch (error: any) {
    console.error('❌ Error uploading to IPFS:', error);
    
    if (error.response) {
      // Pinata API error
      const status = error.response.status;
      const message = error.response.data?.error || error.response.statusText;
      
      if (status === 401) {
        throw new Error('IPFS authentication failed. Please check your Pinata API key.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`IPFS upload failed: ${message}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error(error.message || 'Failed to upload to IPFS');
    }
  }
}

/**
 * Retrieve metadata from IPFS
 * @param cid The IPFS content identifier
 * @returns The metadata object
 */
export async function fetchFromIPFS(cid: string): Promise<IPFSMetadata> {
  if (!cid) {
    throw new Error('No CID provided');
  }

  try {
    // Try multiple gateways for redundancy
    const gateways = [
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      `https://ipfs.io/ipfs/${cid}`,
      `https://cloudflare-ipfs.com/ipfs/${cid}`,
    ];

    let lastError: Error | null = null;

    for (const gateway of gateways) {
      try {
        const response = await axios.get(gateway, {
          timeout: 10000, // 10 second timeout per gateway
        });

        // Handle both versioned and unversioned data
        const data = response.data.data || response.data;
        console.log(`✅ Successfully fetched from IPFS: ${cid}`);
        return data;
      } catch (err: any) {
        lastError = err;
        console.warn(`Failed to fetch from ${gateway}, trying next gateway...`);
        continue;
      }
    }

    throw lastError || new Error('All IPFS gateways failed');
  } catch (error: any) {
    console.error('❌ Error fetching from IPFS:', error);
    throw new Error(`Failed to fetch from IPFS: ${error.message}`);
  }
}

/**
 * Test IPFS connection and authentication
 */
export async function testIPFSConnection(): Promise<boolean> {
  if (!PINATA_JWT) {
    return false;
  }

  try {
    const response = await pinataAxios.get('/data/testAuthentication');
    return response.status === 200;
  } catch (error) {
    console.error('IPFS connection test failed:', error);
    return false;
  }
}

/**
 * Pin an existing IPFS hash to Pinata (optional utility)
 */
export async function pinByCID(cid: string, name?: string): Promise<void> {
  try {
    await pinataAxios.post('/pinning/pinByHash', {
      hashToPin: cid,
      pinataMetadata: {
        name: name || `BaseLog-${cid}`,
      },
    });
  } catch (error) {
    console.error('Error pinning by CID:', error);
    throw new Error('Failed to pin by CID');
  }
}
