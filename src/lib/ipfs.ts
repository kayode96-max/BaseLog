import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

const pinataAxios = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    Authorization: `Bearer ${PINATA_JWT}`,
  },
});

/**
 * Upload journal entry metadata to IPFS via Pinata
 * @param metadata The journal entry data to upload
 * @returns The IPFS CID
 */
export async function uploadToIPFS(metadata: any): Promise<string> {
  try {
    const response = await pinataAxios.post('/pinning/pinJSONToIPFS', metadata, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Retrieve metadata from IPFS
 * @param cid The IPFS content identifier
 * @returns The metadata object
 */
export async function fetchFromIPFS(cid: string): Promise<any> {
  try {
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch from IPFS');
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
