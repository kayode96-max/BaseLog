# Changelog

All notable changes to BaseLog will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Full-text search across journal entries
- CSV/PDF export functionality
- Analytics dashboard with spending trends
- Transaction categories auto-detection
- Mobile app (React Native)
- Multi-language support

## [1.0.0] - 2024-01-15

### Added
- 📅 Transaction calendar with monthly view
- ✍️ Journal entry modal for documenting transactions
- 🔗 On-chain registry via JournalRegistry smart contract
- 📦 IPFS storage integration via Pinata
- 🎨 Beautiful UI with dark mode support
- 🔐 Wallet connection via RainbowKit
- 🏷️ Basenames/ENS resolution for addresses
- 📊 Dashboard with transaction statistics
- 🌐 Support for Base Mainnet and Base Sepolia
- 📱 Responsive design for mobile and desktop

### Smart Contract
- Initial JournalRegistry.sol deployment
- Entry struct with IPFS CID, timestamp, and owner
- logEntry function for creating entries
- getEntry and hasEntry view functions
- EntryUpdated event emission
- Verified on Basescan

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Wagmi v2 for blockchain interaction
- React hooks for state management
- Transaction calendar component
- Journal modal component
- Day transactions list component
- Header with wallet connect
- Address display with Basename support

### APIs & Services
- Covalent API integration for transaction history
- Pinata integration for IPFS pinning
- WalletConnect project setup
- Base network configuration

### Documentation
- Comprehensive README with quick start
- Deployment guide (DEPLOYMENT.md)
- API keys guide (API_KEYS.md)
- Architecture documentation (ARCHITECTURE.md)
- Contributing guidelines (CONTRIBUTING.md)
- Environment configuration examples

### Developer Experience
- PowerShell setup script
- VS Code extensions recommendations
- ESLint and Prettier configuration
- TypeScript strict mode
- Hardhat for smart contract development
- Automated deployment scripts

## [0.1.0] - 2024-01-01

### Added
- Initial project structure
- Basic smart contract scaffold
- Frontend boilerplate with Next.js

---

## Version History

### Version 1.0.0 (Current)
Full-featured MVP with:
- Calendar-based transaction viewing
- On-chain journal entries
- IPFS metadata storage
- Wallet integration
- Beautiful UI

### Roadmap to 2.0.0
- Search and filtering
- Export capabilities
- Advanced analytics
- Social features
- Mobile app

---

## Deployment History

### Production (Base Mainnet)
- **Contract Address**: TBD
- **Deployed**: TBD
- **Verifier**: Basescan

### Testnet (Base Sepolia)
- **Contract Address**: TBD
- **Deployed**: TBD
- **Status**: Active for testing

---

## Notes

- All versions are deployed to Base blockchain
- Breaking changes will increment major version
- Security fixes will be released immediately
- Feature releases follow semantic versioning

---

**Latest Release**: v1.0.0  
**Status**: 🚀 Production Ready  
**License**: MIT
