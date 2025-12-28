# BaseLog Deployment Guide

This guide walks you through deploying BaseLog to production.

## Prerequisites

- [ ] Base Mainnet ETH for deployment (~0.01 ETH should be enough)
- [ ] All API keys configured (WalletConnect, Covalent, Pinata)
- [ ] GitHub repository set up
- [ ] Vercel account (free tier works)

## Step 1: Deploy Smart Contract

### 1.1 Configure Contract Environment

```bash
cd contracts
cp .env.example .env
```

Edit `contracts/.env`:

```env
# Your deployer wallet private key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Get from https://basescan.org/myapikey
BASESCAN_API_KEY=your_basescan_api_key
```

### 1.2 Fund Your Deployer Wallet

Send ~0.01 ETH to your deployer address on Base Mainnet.

### 1.3 Deploy to Base Mainnet

```bash
npm run deploy:base
```

**Expected output:**
```
🚀 Deploying JournalRegistry to Base...
✅ JournalRegistry deployed to: 0x1234567890abcdef...
📝 Update your .env file with:
NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS=0x1234567890abcdef...
⏳ Waiting for block confirmations...
🔍 Verifying contract on Basescan...
✅ Contract verified successfully!
```

### 1.4 Update Root .env

Copy the deployed address and update your root `.env`:

```env
NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS=0x1234567890abcdef...
```

## Step 2: Test Locally

### 2.1 Run Development Server

```bash
npm run dev
```

### 2.2 Test the Flow

1. Connect your wallet
2. View your transactions
3. Create a journal entry
4. Confirm the transaction saves successfully

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3.3 Add Environment Variables

In Vercel project settings → Environment Variables, add:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_COVALENT_API_KEY=your_covalent_key
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret
PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS=0x...your_deployed_address
```

### 3.4 Deploy

Click "Deploy" and wait for the build to complete.

## Step 4: Verify Deployment

### 4.1 Test Production App

1. Visit your Vercel URL (e.g., `https://baselog.vercel.app`)
2. Connect wallet
3. Create a test journal entry
4. Verify on Basescan that the transaction was recorded

### 4.2 Check Contract on Basescan

Visit: `https://basescan.org/address/YOUR_CONTRACT_ADDRESS`

You should see:
- ✅ Contract verified
- ✅ Transaction history
- ✅ Recent `EntryUpdated` events

## Step 5: Set Up Custom Domain (Optional)

### 5.1 In Vercel

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `baselog.app`)
3. Configure DNS records as instructed

### 5.2 Update DNS

Add the following records to your domain provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Step 6: Ongoing Monitoring

### 6.1 Monitor Contract Events

Use Basescan to monitor `EntryUpdated` events:
```
https://basescan.org/address/YOUR_CONTRACT_ADDRESS#events
```

### 6.2 Monitor IPFS Pins

Check your Pinata dashboard for:
- Total pins
- Storage usage
- Pin health

### 6.3 Analytics (Optional)

Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

// Add to the layout
<Analytics />
```

## Troubleshooting

### Contract Deployment Fails

**Error**: `Insufficient funds`
- **Solution**: Add more ETH to your deployer wallet

**Error**: `Contract already deployed at this address`
- **Solution**: Use a different deployer wallet or change contract code

### IPFS Upload Fails

**Error**: `401 Unauthorized`
- **Solution**: Check your Pinata JWT token is correct

**Error**: `429 Too Many Requests`
- **Solution**: You've hit Pinata's rate limit. Upgrade your plan or wait.

### Transactions Not Loading

**Error**: `Covalent API error`
- **Solution**: Check your Covalent API key is valid and has credits

### Basenames Not Resolving

- **Note**: Basenames resolution requires ENS resolution on mainnet
- Some addresses may not have names registered

## Security Checklist

- [ ] Never commit `.env` files with real keys
- [ ] Private keys should only be in local `.env` (not in version control)
- [ ] All API keys configured in Vercel environment variables
- [ ] Smart contract verified on Basescan
- [ ] Test with small amounts first

## Cost Estimates

### Smart Contract Deployment
- **Base Mainnet**: ~$0.50 - $2.00 (one-time)

### Per Journal Entry
- **IPFS Upload**: Free (Pinata free tier)
- **On-chain transaction**: ~$0.01 - $0.05 per entry

### Monthly Costs (100 users, 1000 entries/month)
- **Vercel Hosting**: $0 (free tier)
- **Pinata IPFS**: $0 - $20/month (depending on storage)
- **Covalent API**: $0 (free tier covers 100k requests)
- **WalletConnect**: $0 (free tier)

**Total estimated monthly cost**: $0 - $20

## Next Steps

After deployment, consider:

1. **Analytics**: Add Vercel Analytics or Plausible
2. **SEO**: Add meta tags and OpenGraph images
3. **PWA**: Make it a Progressive Web App
4. **Notifications**: Add wallet notifications for new entries
5. **Export**: Add CSV/PDF export functionality
6. **Search**: Add full-text search across journal entries

---

🎉 **Congratulations!** Your BaseLog DApp is now live on Base!
