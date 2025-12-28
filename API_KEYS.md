# How to Get API Keys for BaseLog

This guide shows you how to obtain all the necessary API keys for BaseLog.

## 1. WalletConnect Project ID

**Purpose**: Powers the wallet connection UI via RainbowKit

### Steps:

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Click "Create New Project"
4. Enter project details:
   - **Name**: BaseLog
   - **Description**: On-chain transaction diary
5. Copy your **Project ID**
6. Add to `.env`:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

**Free Tier**: Yes (100,000 requests/month)

---

## 2. Covalent API Key

**Purpose**: Fetch transaction history for any wallet on Base

### Steps:

1. Go to [covalenthq.com](https://www.covalenthq.com/)
2. Click "Get Your Free API Key"
3. Sign up with email or GitHub
4. Verify your email
5. Go to dashboard → API Keys
6. Copy your API key
7. Add to `.env`:
   ```env
   NEXT_PUBLIC_COVALENT_API_KEY=cqt_your_key_here
   ```

**Free Tier**: 100,000 credits/month (enough for ~10,000 users)

**Alternative**: If you prefer, you can use [Goldsky](https://goldsky.com/) instead.

---

## 3. Pinata API Keys

**Purpose**: Upload and pin journal entries to IPFS

### Steps:

1. Go to [app.pinata.cloud](https://app.pinata.cloud/)
2. Sign up with email
3. Verify your email
4. Go to "API Keys" in the sidebar
5. Click "New Key"
6. Configure permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
   - ✅ `unpin`
7. Name it "BaseLog Production"
8. Click "Create Key"
9. **Important**: Copy all three values immediately (they won't be shown again):
   - API Key
   - API Secret
   - JWT

10. Add to `.env`:
    ```env
    NEXT_PUBLIC_PINATA_API_KEY=your_api_key
    NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
    PINATA_JWT=your_jwt_token
    ```

**Free Tier**: 1GB storage + 100 requests/month

---

## 4. Basescan API Key (Optional)

**Purpose**: Verify smart contracts on Basescan (optional but recommended)

### Steps:

1. Go to [basescan.org](https://basescan.org/)
2. Create an account
3. Go to "My Profile" → "API Keys"
4. Click "Add" to create a new API key
5. Name it "BaseLog Contract Verification"
6. Copy the API key
7. Add to `contracts/.env`:
   ```env
   BASESCAN_API_KEY=your_basescan_api_key
   ```

**Free Tier**: Yes (5 requests/second)

---

## 5. Private Key for Deployment

**Purpose**: Deploy the JournalRegistry smart contract

### Steps:

1. Open your wallet (MetaMask, Coinbase Wallet, etc.)
2. Export your private key:
   - **MetaMask**: Account Details → Export Private Key
   - **Coinbase Wallet**: Settings → Show Private Key
3. **⚠️ CRITICAL SECURITY WARNING ⚠️**:
   - Use a dedicated deployer wallet
   - Never use your main wallet
   - Never commit this key to Git
   - Add `contracts/.env` to `.gitignore`

4. Add to `contracts/.env`:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```

**Recommended**: Create a new wallet specifically for contract deployment.

---

## Summary Checklist

After obtaining all keys, your files should look like:

### Root `.env`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxxxx
NEXT_PUBLIC_COVALENT_API_KEY=cqt_xxxxx
NEXT_PUBLIC_PINATA_API_KEY=xxxxx
NEXT_PUBLIC_PINATA_SECRET_KEY=xxxxx
PINATA_JWT=xxxxx
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS=0x...
```

### `contracts/.env`:
```env
PRIVATE_KEY=xxxxx
BASESCAN_API_KEY=xxxxx
```

---

## Security Best Practices

✅ **DO**:
- Use environment variables
- Add `.env` to `.gitignore`
- Use separate API keys for dev/prod
- Rotate keys regularly
- Use Vercel's environment variables for production

❌ **DON'T**:
- Commit keys to Git
- Share keys publicly
- Use personal wallet for deployment
- Use the same key across projects

---

## Testing Your Keys

### Test WalletConnect:
```bash
npm run dev
# Try connecting a wallet
```

### Test Covalent:
```bash
curl "https://api.covalenthq.com/v1/8453/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0/transactions_v2/?key=YOUR_KEY"
```

### Test Pinata:
```bash
curl -X POST "https://api.pinata.cloud/data/testAuthentication" \
  -H "Authorization: Bearer YOUR_JWT"
```

Expected response: `{"message":"Congratulations! You are communicating with the Pinata API!"}`

---

## Troubleshooting

### "Invalid API Key" Error
- **Solution**: Double-check you copied the entire key (no spaces)

### "Rate Limit Exceeded"
- **Solution**: You're on a free tier and hit the limit. Wait or upgrade.

### "Unauthorized" from Pinata
- **Solution**: Use the JWT token, not the API key/secret for most requests

### Contract Deployment Fails
- **Solution**: Ensure your deployer wallet has Base ETH

---

Need help? Check the [README](./README.md) or open an issue!
