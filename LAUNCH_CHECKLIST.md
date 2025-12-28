# 🚀 BaseLog Launch Checklist

Use this checklist to track your progress from setup to production deployment.

## Phase 1: Setup & Configuration ⚙️

### Local Development Setup
- [ ] Clone/download the project
- [ ] Install Node.js 18+ (check with `node --version`)
- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in `contracts/` directory
- [ ] Verify all dependencies installed successfully

### Get API Keys
- [ ] **WalletConnect Project ID**
  - Sign up at cloud.walletconnect.com
  - Create new project
  - Copy Project ID
  - Resource: [API_KEYS.md](./API_KEYS.md#1-walletconnect-project-id)

- [ ] **Covalent API Key**
  - Sign up at covalenthq.com
  - Get API key from dashboard
  - Resource: [API_KEYS.md](./API_KEYS.md#2-covalent-api-key)

- [ ] **Pinata API Keys**
  - Sign up at app.pinata.cloud
  - Create API key with pinning permissions
  - Copy API Key, Secret, and JWT
  - Resource: [API_KEYS.md](./API_KEYS.md#3-pinata-api-keys)

- [ ] **Basescan API Key** (optional but recommended)
  - Sign up at basescan.org
  - Create API key
  - Resource: [API_KEYS.md](./API_KEYS.md#4-basescan-api-key-optional)

### Configure Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Add WalletConnect Project ID
- [ ] Add Covalent API Key
- [ ] Add Pinata credentials (API Key, Secret, JWT)
- [ ] Copy `contracts/.env.example` to `contracts/.env`
- [ ] Add deployer wallet private key to `contracts/.env`
- [ ] Add Basescan API key to `contracts/.env`

---

## Phase 2: Smart Contract Deployment 📜

### Testnet Deployment (Recommended First)
- [ ] Fund deployer wallet with Base Sepolia ETH
  - Get free testnet ETH from Base Sepolia faucet
  - Need ~0.01 ETH for deployment

- [ ] Deploy to Base Sepolia
  ```bash
  cd contracts
  npm run deploy:base-sepolia
  ```

- [ ] Verify contract on Basescan
  - Should happen automatically
  - Check output for contract address

- [ ] Copy deployed contract address
- [ ] Update `NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS` in root `.env`

### Mainnet Deployment (When Ready)
- [ ] Fund deployer wallet with Base Mainnet ETH
  - Need ~0.01 ETH for deployment

- [ ] Deploy to Base Mainnet
  ```bash
  cd contracts
  npm run deploy:base
  ```

- [ ] Verify contract verified on Basescan
- [ ] Update `NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS` in `.env`
- [ ] Test on mainnet with small amount first

---

## Phase 3: Local Testing 🧪

### Run Development Server
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:3000 in browser
- [ ] Verify app loads without errors
- [ ] Check console for any warnings

### Test Wallet Connection
- [ ] Click "Connect Wallet" button
- [ ] Connect with MetaMask/Coinbase Wallet
- [ ] Verify wallet address displays correctly
- [ ] Disconnect and reconnect (should work smoothly)

### Test Transaction Viewing
- [ ] View transactions in calendar
- [ ] Click on a date with transactions
- [ ] Verify transaction list modal opens
- [ ] Check that transaction details are correct
- [ ] Close modal

### Test Journal Entry Creation
- [ ] Click on a transaction
- [ ] Verify JournalModal opens
- [ ] Fill in:
  - [ ] Title (required)
  - [ ] Description (optional)
  - [ ] Category (optional)
- [ ] Click "Save to Blockchain"
- [ ] Sign transaction in wallet
- [ ] Wait for confirmation
- [ ] Verify success message appears
- [ ] Check calendar shows gold checkmark on that transaction

### Test IPFS & Contract
- [ ] After saving entry, check Pinata dashboard
  - [ ] Verify new pin was created
  - [ ] Note the IPFS CID

- [ ] Check Basescan
  - [ ] Go to contract page
  - [ ] Check "Events" tab
  - [ ] Verify `EntryUpdated` event was emitted

---

## Phase 4: Production Deployment 🌐

### Prepare for Production
- [ ] Create GitHub repository
- [ ] Push all code to GitHub
  ```bash
  git init
  git add .
  git commit -m "Initial commit - BaseLog v1.0"
  git remote add origin YOUR_REPO_URL
  git push -u origin main
  ```

- [ ] Verify `.gitignore` is working
  - [ ] `.env` should NOT be in repo
  - [ ] `contracts/.env` should NOT be in repo

### Deploy to Vercel
- [ ] Sign up/login to vercel.com
- [ ] Click "Add New Project"
- [ ] Import your GitHub repository
- [ ] Configure build settings:
  - [ ] Framework: Next.js
  - [ ] Root Directory: `./`
  - [ ] Build Command: `npm run build`

- [ ] Add all environment variables in Vercel:
  - [ ] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_COVALENT_API_KEY`
  - [ ] `NEXT_PUBLIC_PINATA_API_KEY`
  - [ ] `NEXT_PUBLIC_PINATA_SECRET_KEY`
  - [ ] `PINATA_JWT`
  - [ ] `NEXT_PUBLIC_BASE_CHAIN_ID=8453`
  - [ ] `NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS`

- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Verify deployment successful

### Post-Deployment Testing
- [ ] Visit your Vercel URL
- [ ] Test wallet connection
- [ ] Create a test journal entry
- [ ] Verify transaction on Basescan
- [ ] Check IPFS storage on Pinata
- [ ] Test on mobile device
- [ ] Test with different wallets

### Optional: Custom Domain
- [ ] Purchase domain (e.g., baselog.app)
- [ ] Add domain in Vercel settings
- [ ] Configure DNS records
- [ ] Verify SSL certificate is active
- [ ] Test custom domain

---

## Phase 5: Monitoring & Maintenance 📊

### Set Up Monitoring
- [ ] Add Vercel Analytics
  ```bash
  npm install @vercel/analytics
  ```
- [ ] Monitor contract events on Basescan
- [ ] Check Pinata storage usage
- [ ] Monitor Covalent API usage

### Documentation
- [ ] Add screenshots to README
- [ ] Update CHANGELOG.md with production info
- [ ] Write blog post about launch
- [ ] Create demo video
- [ ] Share on social media

### Community
- [ ] Share on Twitter/X
- [ ] Post in Base Discord
- [ ] Submit to Base ecosystem directory
- [ ] Create GitHub discussions for feedback

---

## Troubleshooting Checklist 🔧

If something isn't working:

### Wallet Not Connecting
- [ ] Check WalletConnect Project ID is correct
- [ ] Verify you're on the right network (Base/Base Sepolia)
- [ ] Clear browser cache and try again

### Transactions Not Loading
- [ ] Verify Covalent API key is valid
- [ ] Check API key has available credits
- [ ] Check browser console for errors
- [ ] Try with a different wallet address

### IPFS Upload Failing
- [ ] Check Pinata JWT token is correct
- [ ] Verify Pinata account has storage space
- [ ] Check internet connection
- [ ] Try re-generating Pinata API key

### Smart Contract Error
- [ ] Verify contract address is correct
- [ ] Check you're on the right network
- [ ] Ensure wallet has enough ETH for gas
- [ ] Check contract is verified on Basescan

### Build Failing
- [ ] Run `npm install` again
- [ ] Delete `node_modules` and `.next` folders
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Check Node.js version is 18+

---

## Success Criteria ✅

Your BaseLog deployment is successful when:

- ✅ Smart contract deployed and verified
- ✅ Frontend deployed to Vercel
- ✅ Users can connect wallets
- ✅ Transactions display in calendar
- ✅ Journal entries save to IPFS
- ✅ Entries link on-chain via contract
- ✅ App works on mobile and desktop
- ✅ No console errors in production

---

## Next Steps After Launch 🚀

Once you're live:

1. **Gather Feedback**
   - Share with friends and community
   - Ask for feature requests
   - Monitor for bugs

2. **Plan v2.0**
   - Add search functionality
   - Implement CSV export
   - Build analytics dashboard
   - Add more categories

3. **Marketing**
   - Submit to Base showcase
   - Write technical blog post
   - Create tutorial video
   - Engage with Web3 community

4. **Scale**
   - Monitor API usage
   - Upgrade services as needed
   - Optimize for performance
   - Add more features

---

**Congratulations on shipping BaseLog! 🎉**

Need help? Check the documentation or open an issue on GitHub.
