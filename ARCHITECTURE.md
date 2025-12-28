# BaseLog Architecture

This document explains the technical architecture of BaseLog.

## System Overview

```
┌─────────────┐
│   User      │
│  (Wallet)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│          Next.js Frontend               │
│  ┌────────────┐  ┌──────────────┐      │
│  │  RainbowKit│  │  Transaction │      │
│  │  (Wagmi)   │  │  Calendar    │      │
│  └────────────┘  └──────────────┘      │
└────┬──────────────────┬────────────┬────┘
     │                  │            │
     │                  │            │
     ▼                  ▼            ▼
┌─────────┐      ┌───────────┐  ┌──────────┐
│  Base   │      │ Covalent  │  │  Pinata  │
│ Network │      │    API    │  │  (IPFS)  │
│         │      │           │  │          │
│ Journal │      │  TX Data  │  │ Metadata │
│Registry │      │           │  │ Storage  │
└─────────┘      └───────────┘  └──────────┘
```

## Component Architecture

### 1. Frontend (Next.js 14)

**App Router Structure:**
```
app/
├── layout.tsx          # Root layout with Web3Provider
├── page.tsx            # Main dashboard
└── globals.css         # Global styles
```

**Components:**
```
components/
├── calendar/
│   ├── TransactionCalendar.tsx   # Monthly calendar view
│   └── DayTransactionsList.tsx   # Day's transactions modal
├── journal/
│   └── JournalModal.tsx          # Create/edit journal entry
├── layout/
│   └── Header.tsx                # App header with wallet connect
├── common/
│   └── AddressDisplay.tsx        # Basename-aware address display
└── providers/
    └── Web3Provider.tsx          # Wagmi + RainbowKit setup
```

**Hooks:**
```
hooks/
├── useBaseTransactions.ts   # Fetch transactions from Covalent
├── useJournalEntry.ts       # Save journal entries
├── useHasJournalEntry.ts    # Check if entry exists
└── useBasename.ts           # Resolve Basenames/ENS
```

### 2. Smart Contract (Solidity)

**Contract:** `JournalRegistry.sol`

**Storage:**
```solidity
mapping(address => mapping(bytes32 => Entry)) public entries;

struct Entry {
    string ipfsCid;      // IPFS hash of metadata
    uint256 timestamp;   // Block timestamp
    address owner;       // Entry creator
}
```

**Key Functions:**
- `logEntry(bytes32 txHash, string memory _cid)`: Create/update entry
- `getEntry(address user, bytes32 txHash)`: Retrieve entry
- `hasEntry(address user, bytes32 txHash)`: Check existence

**Events:**
```solidity
event EntryUpdated(
    address indexed user,
    bytes32 indexed txHash,
    string cid,
    uint256 timestamp
);
```

### 3. Data Layer

**Transaction Fetching (Covalent):**
```typescript
GET /v1/{chainId}/address/{address}/transactions_v2/
```

**IPFS Storage (Pinata):**
```typescript
POST /pinning/pinJSONToIPFS
{
  title: string,
  description: string,
  category?: string,
  tags?: string[],
  timestamp: number,
  txHash: string
}
```

## Data Flow

### Creating a Journal Entry

```
1. User clicks transaction → JournalModal opens
2. User fills title, description, category
3. Click "Save to Blockchain"
   ↓
4. Upload metadata to IPFS (Pinata)
   ↓
5. Receive IPFS CID (e.g., "QmXxx...")
   ↓
6. Call smart contract: logEntry(txHash, cid)
   ↓
7. User signs transaction in wallet
   ↓
8. Transaction confirmed on Base
   ↓
9. Event emitted: EntryUpdated
   ↓
10. UI updates, shows success message
```

### Loading the Calendar

```
1. User connects wallet
   ↓
2. Fetch transactions from Covalent API
   ↓
3. For each transaction:
   - Check JournalRegistry.hasEntry(user, txHash)
   - If true, mark as "hasNote"
   ↓
4. Render calendar with indicators:
   - Gray dot: Transaction exists
   - Gold checkmark: Transaction has journal entry
```

## State Management

**No global state library needed** - using React hooks and Wagmi's built-in caching:

- `useAccount()`: Current wallet state
- `useReadContract()`: Read contract data
- `useWriteContract()`: Write to contract
- `useWaitForTransactionReceipt()`: Wait for confirmation

## API Integration

### Covalent API

**Endpoint:**
```
https://api.covalenthq.com/v1/8453/address/{address}/transactions_v2/
```

**Rate Limits:**
- Free tier: 100,000 credits/month
- ~5 requests/second

**Response:**
```json
{
  "data": {
    "items": [
      {
        "tx_hash": "0x...",
        "block_signed_at": "2024-01-01T12:00:00Z",
        "from_address": "0x...",
        "to_address": "0x...",
        "value": "50000000000000000"
      }
    ]
  }
}
```

### Pinata (IPFS)

**Upload Endpoint:**
```
POST https://api.pinata.cloud/pinning/pinJSONToIPFS
Authorization: Bearer {JWT}
```

**Gateway:**
```
https://gateway.pinata.cloud/ipfs/{CID}
```

## Gas Optimization

The smart contract is optimized for minimal gas usage:

1. **No arrays or loops** - Direct mapping access
2. **Packed structs** - Efficient storage layout
3. **Single SSTORE** - One storage write per entry
4. **No token logic** - No minting/burning overhead

**Estimated Gas Costs:**
- First entry: ~80,000 gas (~$0.02 on Base)
- Subsequent updates: ~40,000 gas (~$0.01 on Base)

## Security Considerations

### Smart Contract

- ✅ No external calls (no reentrancy risk)
- ✅ No owner/admin functions (immutable)
- ✅ No upgradability (what you see is what you get)
- ✅ Verified on Basescan

### Frontend

- ✅ All API keys in environment variables
- ✅ No private keys in frontend
- ✅ User must sign all transactions
- ✅ Read-only operations cached

### IPFS

- ✅ Content-addressed storage (immutable)
- ✅ Metadata is public (by design)
- ✅ Pinned to prevent garbage collection

## Scalability

### Current Limits

- **Transactions per user**: Unlimited
- **Journal entries per user**: Unlimited
- **IPFS storage**: Limited by Pinata plan
- **Covalent requests**: 100,000/month (free tier)

### Scaling Strategy

1. **High traffic**: Upgrade Covalent to paid tier
2. **Large storage**: Upgrade Pinata or use multiple providers
3. **Heavy indexing**: Add The Graph subgraph for complex queries
4. **L1 fees**: Stay on Base (already cheap)

## Future Enhancements

### Planned Features

1. **Search & Filter**
   - Full-text search across journal entries
   - Filter by category, date range, amount

2. **Export**
   - CSV export of all entries
   - PDF report generation

3. **Analytics**
   - Spending breakdown by category
   - Monthly trends visualization

4. **Social**
   - Share specific entries (with privacy controls)
   - Collaborative journals for multisig wallets

5. **Advanced**
   - Automatic categorization using AI
   - Recurring transaction detection
   - Budget alerts

### Technical Debt

- Add comprehensive test suite (Hardhat + Jest)
- Implement error boundaries in React
- Add loading skeletons for better UX
- Set up CI/CD pipeline
- Add E2E tests with Playwright

## Development Workflow

### Local Development

```bash
# Terminal 1: Run Next.js dev server
npm run dev

# Terminal 2: Hardhat node (optional)
cd contracts
npx hardhat node
```

### Testing

```bash
# Test smart contract
cd contracts
npx hardhat test

# Test frontend (not implemented yet)
npm run test
```

### Deployment

```bash
# 1. Deploy contract to Base Sepolia
cd contracts
npm run deploy:base-sepolia

# 2. Update .env with contract address
# 3. Deploy frontend to Vercel
git push origin main
```

## Performance Metrics

### Target Metrics

- **Time to Interactive (TTI)**: < 3s
- **First Contentful Paint (FCP)**: < 1.5s
- **Wallet connect**: < 2s
- **Transaction confirmation**: 2-5s (Base block time)
- **IPFS upload**: < 3s

### Monitoring

Use Vercel Analytics to track:
- Page load times
- Core Web Vitals
- User engagement

## Technology Choices

### Why Next.js 14?
- App Router for better performance
- Server Components for reduced bundle size
- Built-in optimization (images, fonts)
- Easy Vercel deployment

### Why Wagmi v2?
- Type-safe React hooks for Ethereum
- Built-in caching and request deduplication
- RainbowKit integration
- Excellent TypeScript support

### Why Base?
- Low transaction fees (~$0.01)
- Fast confirmations (~2 seconds)
- Ethereum ecosystem compatibility
- Growing adoption

### Why Pinata?
- Simple API
- Generous free tier
- Fast global CDN
- Good developer experience

### Why Covalent?
- Multi-chain support
- Normalized API responses
- Transaction history indexing
- Free tier sufficient for MVP

---

For questions or contributions, see [CONTRIBUTING.md](./CONTRIBUTING.md)
