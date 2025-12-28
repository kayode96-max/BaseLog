# IPFS Integration Guide

BaseLog uses IPFS (InterPlanetary File System) to store journal entries in a decentralized, permanent way. The smart contract on Base blockchain only stores references (CIDs) to the IPFS content, keeping gas costs low while ensuring data persistence.

## How It Works

1. **User writes journal entry** - Title, description, category, and tags
2. **Upload to IPFS** - Data is uploaded to IPFS via Pinata
3. **Get CID** - IPFS returns a unique Content Identifier (CID)
4. **Store on Blockchain** - The CID is linked to the transaction hash in the JournalRegistry contract
5. **Retrieve later** - Use the CID to fetch the journal entry from IPFS

## Setup Pinata (Recommended IPFS Provider)

### 1. Create a Pinata Account

Visit [https://app.pinata.cloud/](https://app.pinata.cloud/) and sign up for a free account.

### 2. Get Your JWT Token

1. Go to **API Keys** in the Pinata dashboard
2. Click **New Key**
3. Select these permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
   - ✅ `unpin`
4. Name it something like "BaseLog Production"
5. Click **Create Key**
6. **IMPORTANT**: Copy the JWT token immediately (you won't see it again!)

### 3. Add to Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_PINATA_JWT=your_jwt_token_here
```

## Testing IPFS Connection

You can test your IPFS connection by running this in the browser console:

```javascript
import { testIPFSConnection } from "@/lib/ipfs";

testIPFSConnection().then((result) => {
  console.log("IPFS Connected:", result);
});
```

## Data Structure

Journal entries are stored as JSON with this structure:

```json
{
  "version": "1.0.0",
  "createdAt": "2025-12-28T10:30:00.000Z",
  "data": {
    "title": "Bought morning coffee",
    "description": "Grabbed a latte at the local cafe",
    "category": "Food",
    "tags": ["coffee", "daily"],
    "timestamp": 1703760600000,
    "txHash": "0x123...",
    "amount": "0.0025",
    "from": "0xABC...",
    "to": "0xDEF..."
  }
}
```

## IPFS Gateways

The app uses multiple IPFS gateways for redundancy:

1. **Pinata Gateway** (primary) - `https://gateway.pinata.cloud/ipfs/{cid}`
2. **IPFS.io** (fallback) - `https://ipfs.io/ipfs/{cid}`
3. **Cloudflare** (fallback) - `https://cloudflare-ipfs.com/ipfs/{cid}`

## Troubleshooting

### "IPFS service not configured" error

- Make sure `NEXT_PUBLIC_PINATA_JWT` is set in your `.env.local` file
- Restart your development server after adding environment variables

### "IPFS authentication failed" error

- Your JWT token may be invalid or expired
- Generate a new API key in Pinata dashboard

### "Rate limit exceeded" error

- Pinata free tier has limits (1GB storage, 100GB bandwidth/month)
- Consider upgrading to a paid plan or implementing request throttling

### Uploads are slow

- IPFS uploads can take 5-15 seconds depending on network conditions
- The UI shows progress indicators during the upload process

## Cost & Limits

### Pinata Free Tier

- 1 GB total storage
- 100 GB bandwidth per month
- Unlimited pins
- Perfect for development and small-scale production

### Pinata Paid Plans

- Picnic Plan: $20/month - 100GB storage, 1TB bandwidth
- Submarine Plan: $100/month - 1TB storage, 10TB bandwidth

## Alternative IPFS Providers

If you want to use a different IPFS service, you'll need to modify `src/lib/ipfs.ts`:

### Web3.Storage

```typescript
import { Web3Storage } from "web3.storage";

const client = new Web3Storage({
  token: process.env.WEB3_STORAGE_TOKEN,
});
```

### Infura IPFS

```typescript
const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
```

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use different keys** for development and production
3. **Rotate API keys** periodically (every 90 days recommended)
4. **Monitor usage** in Pinata dashboard to detect abuse
5. **Consider encryption** for sensitive journal entries (future feature)

## Learn More

- [IPFS Documentation](https://docs.ipfs.tech/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Best Practices](https://docs.ipfs.tech/how-to/best-practices-for-nft-data/)
