#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const ABI_DIR = path.join(FRONTEND_ROOT, 'abi');
const CONTRACT_ARTIFACTS_DIR = path.resolve(FRONTEND_ROOT, '../fhevm-hardhat-template/artifacts/contracts');

// Ensure abi directory exists
if (!fs.existsSync(ABI_DIR)) {
  fs.mkdirSync(ABI_DIR, { recursive: true });
}

console.log('🔧 Generating ABI files for AnonScholar...');

// Process AnonScholar contract
const anonScholarArtifactPath = path.join(CONTRACT_ARTIFACTS_DIR, 'AnonScholar.sol', 'AnonScholar.json');

if (fs.existsSync(anonScholarArtifactPath)) {
  console.log('📄 Processing AnonScholar...');
  
  const artifact = JSON.parse(fs.readFileSync(anonScholarArtifactPath, 'utf8'));
  
  // Generate ABI file
  const abiContent = `// Auto-generated ABI file for AnonScholar contract
export const AnonScholarABI = ${JSON.stringify(artifact.abi, null, 2)} as const;
`;
  
  const abiFilePath = path.join(ABI_DIR, 'AnonScholarABI.ts');
  fs.writeFileSync(abiFilePath, abiContent);
  console.log(`✅ Generated: ${abiFilePath}`);
  
  // Generate addresses file
  const deploymentsDir = path.resolve(FRONTEND_ROOT, '../fhevm-hardhat-template/deployments');
  const localhostDir = path.join(deploymentsDir, 'localhost');
  
  let contractAddress = null;
  if (fs.existsSync(localhostDir)) {
    const deploymentFiles = fs.readdirSync(localhostDir).filter(file => file.endsWith('.json'));
    
    for (const file of deploymentFiles) {
      if (file === 'AnonScholar.json') {
        const deploymentPath = path.join(localhostDir, file);
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
        
        if (deployment.address) {
          contractAddress = deployment.address;
          break;
        }
      }
    }
  }
  
  const addressesContent = `// Auto-generated addresses file for AnonScholar contract
export const AnonScholarAddresses = {
  ${contractAddress ? `31337: "${contractAddress}",` : '// No deployment found'}
  // Add other network addresses as needed
} as const;
`;
  
  const addressesFilePath = path.join(ABI_DIR, 'AnonScholarAddresses.ts');
  fs.writeFileSync(addressesFilePath, addressesContent);
  console.log(`📍 Found deployment address: ${contractAddress || 'None'}`);
  console.log(`✅ Generated: ${addressesFilePath}`);
} else {
  console.log('❌ AnonScholar artifact not found. Please compile the contract first.');
}

// Generate index file
const indexContent = `// Auto-generated index file for ABI exports
export * from './AnonScholarABI';
export * from './AnonScholarAddresses';
`;

const indexFilePath = path.join(ABI_DIR, 'index.ts');
fs.writeFileSync(indexFilePath, indexContent);
console.log(`✅ Generated: ${indexFilePath}`);

console.log('🎉 ABI generation completed!');