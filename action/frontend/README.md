# AnonScholar Frontend

A beautiful, modern frontend for the AnonScholar anonymous Q&A platform built with Next.js, React, and FHEVM technology.

## Features

- 🎨 **Beautiful UI**: Modern, minimalist design with glass morphism effects
- 🔒 **Privacy First**: Complete anonymity using FHEVM encryption
- ⚡ **Fast & Responsive**: Built with Next.js and optimized for performance
- 🌐 **Web3 Integration**: Seamless MetaMask integration
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Web3**: ethers.js v6, MetaMask integration
- **Encryption**: FHEVM (Fully Homomorphic Encryption Virtual Machine)
- **Development**: Hot reload, TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+ 
- MetaMask browser extension
- Hardhat node running locally (for development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev:mock
```

This will:
- Check if Hardhat node is running
- Clean previous builds
- Generate ABI files from deployed contracts
- Start the Next.js development server

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:mock` - Start with mock FHEVM (recommended for local development)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts
- `npm run genabi` - Generate ABI files from contracts
- `npm run ishhrunning` - Check if Hardhat node is running

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # React providers
├── components/            # React components
│   ├── AnonScholarDemo.tsx # Main demo component
│   └── ErrorNotDeployed.tsx # Error component
├── hooks/                 # Custom React hooks
│   ├── metamask/          # MetaMask integration hooks
│   ├── useAnonScholar.tsx # Main business logic hook
│   └── useInMemoryStorage.tsx # Storage hook
├── fhevm/                 # FHEVM integration
│   ├── internal/          # Internal FHEVM utilities
│   ├── fhevmTypes.ts      # TypeScript types
│   ├── useFhevm.tsx       # FHEVM hook
│   └── ...                # Other FHEVM utilities
├── abi/                   # Contract ABIs (auto-generated)
├── scripts/               # Build scripts
└── public/                # Static assets
```

## UI Design

The frontend features a modern, privacy-focused design with:

- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Gradient Animations**: Smooth color transitions and hover effects
- **Status Indicators**: Clear visual feedback for system status
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Dark/Light Theme**: Automatic theme detection with custom CSS variables

## FHEVM Integration

The frontend integrates with FHEVM for:

- **Local Development**: Uses `@fhevm/mock-utils` for local testing
- **Production**: Uses `@zama-fhe/relayer-sdk` for real encryption
- **Automatic Detection**: Switches between mock and production based on network
- **Error Handling**: Comprehensive error handling and user feedback

## Development Workflow

1. **Start Hardhat Node**: `cd ../fhevm-hardhat-template && npx hardhat node`
2. **Deploy Contracts**: `npx hardhat deploy --network localhost`
3. **Start Frontend**: `npm run dev:mock`
4. **Connect MetaMask**: Connect to localhost:8545
5. **Test Features**: Use the demo interface to test all functionality

## Troubleshooting

### Common Issues

1. **Hardhat Node Not Running**
   - Error: "Hardhat node is not running"
   - Solution: Start Hardhat node with `npx hardhat node`

2. **Contract Not Deployed**
   - Error: "Contract not deployed"
   - Solution: Deploy contracts with `npx hardhat deploy`

3. **MetaMask Connection Issues**
   - Error: "MetaMask not connected"
   - Solution: Install MetaMask and connect to localhost:8545

4. **FHEVM Initialization Failed**
   - Error: "FHEVM not ready"
   - Solution: Check Hardhat node is running and FHEVM plugin is enabled

### Debug Mode

Enable debug logging by opening browser console. All FHEVM operations are logged with emojis for easy identification.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

