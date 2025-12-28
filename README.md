# 🗓️ BaseLog - Your On-Chain Transaction Diary

BaseLog is a DApp built on the Base blockchain that allows you to document your Web3 journey by attaching permanent notes and metadata to your transactions. Think of it as a "smart filing cabinet" for your on-chain activity.

![BaseLog Preview](https://img.shields.io/badge/Built%20on-Base-0052FF?style=for-the-badge&logo=ethereum)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- 📅 **Calendar View**: Visualize your transaction history in an intuitive monthly calendar
- 📝 **Journal Entries**: Add titles, descriptions, categories, and tags to any transaction
- 🔗 **On-Chain Registry**: Transaction notes are linked on-chain via smart contract
- 📦 **IPFS Storage**: Metadata stored permanently on IPFS via Pinata
- 🎨 **Beautiful UI**: Clean, Notion-like interface with dark mode support
- 🔐 **Wallet Integration**: Connect with any wallet via RainbowKit
- 🏷️ **Basenames Support**: Resolve addresses to human-readable names (e.g., `brian.base`)
- ⚡ **Base Network**: Fast and low-cost transactions on Base L2

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + Custom Components |
| **Blockchain** | Wagmi v2 + RainbowKit |
| **Network** | Base (Mainnet & Sepolia Testnet) |
| **Indexing** | Covalent API |
| **Storage** | Pinata (IPFS) |
| **Smart Contract** | Solidity 0.8.20 + Hardhat |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia or Base Mainnet ETH for gas fees

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/baselog.git
cd baselog
```

### 2. Install Dependencies

```bash
# Install Next.js dependencies
npm install

# Install contract dependencies
cd contracts
npm install
cd ..
```

### 3. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Get from https://www.covalenthq.com/
NEXT_PUBLIC_COVALENT_API_KEY=your_covalent_key

# Get from https://app.pinata.cloud/
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret
PINATA_JWT=your_pinata_jwt

# Base Network
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS=0x...deployed_address
```

### 4. Deploy the Smart Contract

```bash
cd contracts
cp .env.example .env
# Add your PRIVATE_KEY and BASESCAN_API_KEY to contracts/.env

# Deploy to Base Sepolia (testnet)
npm run deploy:base-sepolia

# Or deploy to Base Mainnet
npm run deploy:base
```

Copy the deployed contract address and update `NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS` in your root `.env` file.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
baselog/
├── contracts/                 # Smart contracts
│   ├── JournalRegistry.sol   # Main registry contract
│   ├── hardhat.config.js     # Hardhat configuration
│   └── scripts/
│       └── deploy.ts         # Deployment script
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── calendar/         # Calendar components
│   │   ├── journal/          # Journal modal
│   │   ├── layout/           # Header, footer, etc.
│   │   └── providers/        # Web3 providers
│   ├── hooks/                # Custom React hooks
│   │   ├── useBaseTransactions.ts
│   │   ├── useJournalEntry.ts
│   │   └── useBasename.ts
│   ├── lib/                  # Utilities
│   │   ├── wagmi.ts          # Wagmi config
│   │   ├── contracts.ts      # Contract ABIs
│   │   └── ipfs.ts           # IPFS functions
│   └── types/                # TypeScript types
└── package.json
```

## 🔧 Smart Contract

### JournalRegistry.sol

The contract is a simple registry that maps:
- **User address** → **Transaction hash** → **IPFS CID**

**Key Functions:**
- `logEntry(bytes32 txHash, string memory _cid)`: Save a journal entry
- `getEntry(address user, bytes32 txHash)`: Retrieve an entry
- `hasEntry(address user, bytes32 txHash)`: Check if entry exists

**No Tokenomics**: This is a pure utility contract with no rewards or tokens.

### Deployment

The contract is deployed on:
- **Base Sepolia** (Testnet): For testing
- **Base Mainnet**: For production

Verify on Basescan after deployment.

## 🎨 Features in Detail

### 1. Transaction Calendar

- Monthly grid view of all your transactions
- **Gray dot**: Transaction without a note
- **Gold checkmark**: Transaction with a journal entry
- Click any day to see transactions for that date

### 2. Journal Modal

- Add a **title** (required) and **description** (optional)
- Select a **category** (Food, Rent, Transport, etc.)
- Metadata is uploaded to IPFS first
- Then the IPFS CID is linked on-chain via the smart contract

### 3. Basenames Resolution

- Automatically resolves addresses like `0x742d...` to `brian.base`
- Makes your transaction history much more readable
- Works with both ENS and Base Names

### 4. Data Flow

```
1. User connects wallet
2. Fetch transactions from Covalent API
3. Check JournalRegistry for existing notes
4. Display in calendar with indicators
5. User creates note → Upload to IPFS → Call smart contract
6. Transaction confirmed → Calendar updates
```

## 🔑 API Keys & Services

### WalletConnect
- **Sign up**: https://cloud.walletconnect.com/
- **Purpose**: Wallet connection UI
- **Free tier**: Yes

### Covalent
- **Sign up**: https://www.covalenthq.com/
- **Purpose**: Fetch transaction history
- **Free tier**: 100,000 credits/month

### Pinata
- **Sign up**: https://app.pinata.cloud/
- **Purpose**: IPFS pinning service
- **Free tier**: 1GB storage

### Basescan (Optional)
- **Sign up**: https://basescan.org/
- **Purpose**: Contract verification
- **Free tier**: Yes

## 🛠️ Development

### Run Tests

```bash
cd contracts
npx hardhat test
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables on Vercel

Make sure to add all variables from `.env.example` in your Vercel project settings.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built on [Base](https://base.org)
- UI inspired by Notion's clean aesthetic
- Icons from [Lucide](https://lucide.dev) and Google Material Symbols

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/baselog/issues)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Discord**: [Join our community](https://discord.gg/yourserver)

---

**Built with ❤️ on Base** 🔵
