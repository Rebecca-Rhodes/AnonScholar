const { ethers } = require('./frontend/node_modules/ethers');
const { MockFhevmInstance } = require('./frontend/node_modules/@fhevm/mock-utils');

async function testEncryption() {
  try {
    console.log('🔧 Testing encryption process...');
    
    // Create provider
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Get signer
    const signer = await provider.getSigner(0);
    console.log('👤 Signer address:', await signer.getAddress());
    
    // Create mock instance
    const instance = await MockFhevmInstance.create(provider, provider, {
      aclContractAddress: "0x50157CFfD6bBFA2DECe204a89ec419c23ef5755D",
      chainId: 31337,
      gatewayChainId: 55815,
      inputVerifierContractAddress: "0x901F8942346f7AB3a01F6D7613119Bca447Bb030",
      kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
      verifyingContractAddressDecryption: "0x5ffdaAB0373E62E2ea2944776209aEf29E631A64",
      verifyingContractAddressInputVerification: "0x812b06e1CDCE800494b79fFE4f925A504a9A9810",
    });
    
    console.log('✅ Mock FHEVM instance created');
    
    // Test encryption
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const userAddress = await signer.getAddress();
    
    console.log('📝 Creating encrypted input...');
    const encryptedInput = instance.createEncryptedInput(contractAddress, userAddress);
    
    console.log('🔢 Adding test data...');
    const testData = "测试问题内容";
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(testData));
    const dataAsHex = dataHash.slice(2, 34);
    const dataAsNumber = BigInt("0x" + dataAsHex);
    const maxUint128 = BigInt("0xffffffffffffffffffffffffffffffff");
    const clampedValue = dataAsNumber & maxUint128;
    
    console.log('📊 Data to encrypt:', clampedValue.toString());
    encryptedInput.add128(clampedValue);
    
    console.log('📍 Adding address...');
    encryptedInput.addAddress(userAddress);
    
    console.log('🔐 Encrypting...');
    const { handles, inputProof } = await encryptedInput.encrypt();
    
    console.log('✅ Encryption successful!');
    console.log('🔑 Handles:', handles);
    console.log('📋 Proof length:', inputProof.length);
    
  } catch (error) {
    console.error('❌ Encryption test failed:', error);
    console.error('Stack:', error.stack);
  }
}

testEncryption();
