// FHEVM SDK CDN URL
export const FHEVM_SDK_CDN_URL = "https://unpkg.com/@zama-fhe/relayer-sdk@latest/dist/browser.js";

// Hardhat relayer metadata endpoint
export const HARDHAT_RELAYER_METADATA_ENDPOINT = "http://127.0.0.1:8545/fhevm/relayer-metadata";

// Default mock chains
export const DEFAULT_MOCK_CHAINS = [
  {
    id: 31337,
    name: "Hardhat",
    network: "hardhat",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      default: { http: ["http://127.0.0.1:8545"] },
      public: { http: ["http://127.0.0.1:8545"] },
    },
  },
];

// Encryption types
export const ENCRYPTION_TYPES = {
  EUINT32: "euint32",
  EUINT128: "euint128",
  EADDRESS: "eaddress",
  EBOOL: "ebool",
} as const;

// UI Messages
export const UI_MESSAGES = {
  CONNECT_WALLET: "Connect MetaMask Wallet",
  CONNECTING: "Connecting...",
  CONNECTED: "Connected",
  DISCONNECTED: "Disconnected",
  LOADING: "Loading...",
  ERROR: "Error",
  SUCCESS: "Success",
  WARNING: "Warning",
  INFO: "Info",
  POST_QUESTION: "Post Question",
  POST_ANSWER: "Post Answer",
  VOTE_UP: "Vote Up",
  VOTE_DOWN: "Vote Down",
  DECRYPT: "Decrypt",
  ENCRYPT: "Encrypt",
  SUBMIT: "Submit",
  CANCEL: "Cancel",
  CONFIRM: "Confirm",
  RETRY: "Retry",
  REFRESH: "Refresh",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Wallet not connected",
  WRONG_NETWORK: "Wrong network",
  FHEVM_NOT_READY: "FHEVM not ready",
  CONTRACT_NOT_DEPLOYED: "Contract not deployed",
  ENCRYPTION_FAILED: "Encryption failed",
  DECRYPTION_FAILED: "Decryption failed",
  TRANSACTION_FAILED: "Transaction failed",
  NETWORK_ERROR: "Network error",
  UNKNOWN_ERROR: "Unknown error",
} as const;