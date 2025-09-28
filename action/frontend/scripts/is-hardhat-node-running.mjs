#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking if Hardhat node is running...');

try {
  const response = await fetch('http://127.0.0.1:8545', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_chainId',
      params: [],
      id: 1,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const chainId = parseInt(data.result, 16);
    console.log('✅ Hardhat node is running on http://127.0.0.1:8545');
    console.log(`📊 Chain ID: ${chainId}`);
    process.exit(0);
  } else {
    console.log('❌ Hardhat node is not responding');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Hardhat node is not running');
  console.log('💡 Please start the Hardhat node with: npx hardhat node');
  process.exit(1);
}