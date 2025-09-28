# AnonScholar - Anonymous Q&A Platform

<div align="center">
  <img src="https://img.shields.io/badge/FHEVM-v0.8-blue" alt="FHEVM Version" />
  <img src="https://img.shields.io/badge/React-19.1-61dafb" alt="React Version" />
  <img src="https://img.shields.io/badge/Next.js-15.4-black" alt="Next.js Version" />
  <img src="https://img.shields.io/badge/Solidity-0.8.27-363636" alt="Solidity Version" />
  <img src="https://img.shields.io/badge/License-BSD--3--Clause-green" alt="License" />
</div>

<div align="center">
  <h3>🔐 Privacy-preserving Q&A platform powered by FHEVM technology</h3>
  <p>Ask and answer questions while keeping your identity completely anonymous through fully homomorphic encryption.</p>
</div>

---

## 🌟 Features

- **🔒 Complete Anonymity**: Questions and answers are encrypted on-chain using FHEVM
- **🗳️ Private Voting**: Cast encrypted votes on answers without revealing preferences  
- **🔍 Selective Decryption**: Only authorized users can decrypt content they have permission to view
- **⚡ Real-time Updates**: Live feed of encrypted questions with smooth user experience
- **🎯 Advanced FHE Operations**: Utilizes random numbers, conditional logic, and encrypted computations
- **🌐 Multi-chain Support**: Designed for Sepolia testnet and localhost development

## 🏗️ Architecture

### Smart Contract Layer (FHEVM)
- **AnonScholar.sol**: Main contract implementing anonymous Q&A logic
- **Advanced FHE Features**: Random seed generation, encrypted voting, conditional operations
- **ACL Management**: Granular access control for decryption permissions
- **Gas Optimized**: Efficient use of encrypted data types

### Frontend Application (Next.js + React)
- **FHEVM Integration**: Seamless encryption/decryption using MockFhevmInstance for development
- **MetaMask Integration**: Web3 wallet connection with ethers.js v6
- **Modern UI/UX**: Dark theme with glassmorphism effects and smooth animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Development Environment
- **Local FHEVM Node**: Hardhat-based development environment
- **Automated Deployment**: One-command setup and deployment
- **Type Safety**: Full TypeScript integration with auto-generated contract types

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 7+
- MetaMask browser extension

### 1. Clone and Setup

```bash
git clone <repository-url>
cd action

# Setup backend (Smart Contracts)
cd fhevm-hardhat-template
npm install

# Setup frontend
cd ../frontend  
npm install
```

### 2. Start Local FHEVM Node

```bash
cd fhevm-hardhat-template
npm run node
```

Keep this terminal running. In a new terminal:

### 3. Deploy Contracts

```bash
cd fhevm-hardhat-template
npm run deploy
```

### 4. Start Frontend

```bash
cd frontend
npm run dev:mock
```

### 5. Open Application

Visit [http://localhost:3000](http://localhost:3000) and connect your MetaMask wallet.

## 🔧 Development

### Project Structure

```
action/
├── fhevm-hardhat-template/          # Smart contracts & deployment
│   ├── contracts/
│   │   └── AnonScholar.sol          # Main anonymous Q&A contract
│   ├── deploy/
│   │   └── deploy-anonscholar.ts    # Deployment script
│   ├── tasks/
│   │   └── AnonScholar.ts           # Contract interaction tasks
│   └── fhevmTemp/
│       └── precompiled-fhevm-core-contracts-addresses.json
│
└── frontend/                        # Next.js React application
    ├── app/
    │   ├── page.tsx                 # Main application page
    │   ├── layout.tsx               # App layout with providers
    │   └── providers.tsx            # Context providers setup
    ├── fhevm/                       # FHEVM integration layer
    │   ├── useFhevm.tsx            # Main FHEVM hook
    │   ├── internal/
    │   │   ├── fhevm.ts            # Core FHEVM instance creation
    │   │   ├── mock/
    │   │   │   └── fhevmMock.ts    # MockFhevmInstance integration
    │   │   └── RelayerSDKLoader.ts # Dynamic SDK loading
    │   └── FhevmDecryptionSignature.ts # EIP-712 signature management
    ├── hooks/
    │   ├── useAnonScholar.tsx       # Business logic hook
    │   └── metamask/                # MetaMask integration hooks
    ├── components/
    │   └── AnonScholarDemo.tsx      # Main demo component
    └── scripts/
        ├── genabi.mjs               # ABI generation script
        └── is-hardhat-node-running.mjs # Node status checker
```

### Smart Contract Features

The `AnonScholar.sol` contract demonstrates advanced FHEVM capabilities:

#### 🎲 Random Number Generation
```solidity
// Generate random seed for anonymous ordering
euint32 randomSeed = FHE.randEuint32();
euint32 randomRank = FHE.randEuint32();
```

#### 🔀 Conditional Logic
```solidity
// Conditional vote counting using FHE.select
euint32 upvoteIncrement = FHE.select(voteType, weight, FHE.asEuint32(0));
euint32 downvoteIncrement = FHE.select(voteType, FHE.asEuint32(0), weight);
```

#### 🔢 Encrypted Arithmetic
```solidity
// Update encrypted counters and scores
answer.encryptedUpvotes = FHE.add(answer.encryptedUpvotes, upvoteIncrement);
answer.encryptedScore = FHE.sub(answer.encryptedUpvotes, answer.encryptedDownvotes);
```

#### 🔐 Access Control
```solidity
// Granular ACL permissions for encrypted data
FHE.allowThis(content);
FHE.allow(content, msg.sender);
FHE.allowTransient(tempData, user);
```

### Frontend Integration

The frontend uses `MockFhevmInstance` for local development:

```typescript
// Development environment detection and MockFhevmInstance usage
if (isMock) {
  const fhevmMock = await import("./mock/fhevmMock");
  const mockInstance = await fhevmMock.fhevmMockCreateInstance({
    rpcUrl,
    chainId,
    metadata: fhevmRelayerMetadata,
  });
  return mockInstance;
}
```

### Available Scripts

#### Backend (fhevm-hardhat-template)
```bash
npm run compile      # Compile smart contracts
npm run deploy       # Deploy to localhost
npm run node         # Start Hardhat node
npm run test         # Run contract tests
npm run typechain    # Generate TypeScript types
```

#### Frontend
```bash
npm run dev:mock     # Development with mock FHEVM
npm run dev          # Standard development mode
npm run build        # Production build
npm run genabi       # Generate contract ABIs
```

### Contract Interaction Examples

#### Post a Question
```bash
cd fhevm-hardhat-template
npx hardhat task:postTestQuestion --contract <CONTRACT_ADDRESS> --network localhost
```

#### Post an Answer
```bash
npx hardhat task:postTestAnswer --contract <CONTRACT_ADDRESS> --questionid 0 --network localhost
```

#### View Recent Questions
```bash
npx hardhat task:getRecentQuestions --contract <CONTRACT_ADDRESS> --count 5 --network localhost
```

## 🔬 FHEVM Technology Deep Dive

### Encryption Types Used
- `euint128`: Question/answer content hashes
- `eaddress`: Anonymous user addresses  
- `euint32`: Vote counts, view counts, scores
- `ebool`: Status flags (active, visible, voted)

### Key Innovation Points

1. **Anonymous Ordering**: Uses encrypted random seeds to shuffle content without revealing patterns
2. **Encrypted Voting**: Vote weights and types are encrypted, preventing vote manipulation
3. **Selective Visibility**: Content visibility controlled through encrypted boolean flags
4. **Privacy-Preserving Statistics**: Platform metrics are encrypted but still computable

### Security Features

- **Zero-Knowledge Proofs**: All inputs verified cryptographically
- **EIP-712 Signatures**: Secure decryption authorization
- **ACL-based Access**: Granular permission system for encrypted data
- **Frontend Privacy**: MockFhevmInstance ensures local development privacy

## 🌐 Deployment

### Localhost Development
Already covered in Quick Start section.

### Sepolia Testnet
```bash
# Backend deployment
cd fhevm-hardhat-template
npm run deploy:sepolia

# Frontend configuration
# Update frontend/abi/ files with new contract addresses
cd ../frontend
npm run genabi
npm run build
```

### Production Considerations
- Replace MockFhevmInstance with production FHEVM SDK
- Configure proper RPC endpoints and Relayer URLs
- Set up monitoring and analytics
- Implement proper error handling and fallbacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for smart contracts
- Ensure mobile responsiveness
- Maintain privacy-first principles
- Document FHEVM usage patterns

## 📝 License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For the groundbreaking FHEVM technology
- **FHEVM Team**: For comprehensive documentation and examples
- **Hardhat**: For excellent development tooling
- **Next.js & React**: For modern frontend framework
- **Tailwind CSS**: For beautiful, responsive styling

## 📞 Support

- 📚 **Documentation**: Check the `/docs` folder for detailed guides
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Discussions**: Join community discussions
- 📧 **Contact**: Reach out to the development team

---

<div align="center">
  <p><strong>Built with ❤️ and 🔐 for a more private internet</strong></p>
  <p>AnonScholar - Where knowledge meets privacy</p>
</div>


