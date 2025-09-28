const { ethers } = require('./frontend/node_modules/ethers');
const { MockFhevmInstance } = require('./frontend/node_modules/@fhevm/mock-utils');
const anonScholarArtifact = require('./fhevm-hardhat-template/artifacts/contracts/AnonScholar.sol/AnonScholar.json');
const AnonScholarABI = anonScholarArtifact.abi;

async function testContractCall() {
  try {
    console.log('🔧 Testing contract call...');
    
    // Create provider and signer
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
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
    
    // Create contract instance
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = new ethers.Contract(contractAddress, AnonScholarABI, signer);
    console.log('📋 Contract instance created');
    
    // Test encryption
    const userAddress = await signer.getAddress();
    
    // Encrypt content
    console.log('🔐 Encrypting content...');
    const contentInput = instance.createEncryptedInput(contractAddress, userAddress);
    const testData = "测试问题内容";
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(testData));
    const dataAsHex = dataHash.slice(2, 34);
    const dataAsNumber = BigInt("0x" + dataAsHex);
    const maxUint128 = BigInt("0xffffffffffffffffffffffffffffffff");
    const clampedValue = dataAsNumber & maxUint128;
    contentInput.add128(clampedValue);
    const { handles: contentHandles, inputProof: contentProof } = await contentInput.encrypt();
    
    // Encrypt asker address
    console.log('🔐 Encrypting asker address...');
    const askerInput = instance.createEncryptedInput(contractAddress, userAddress);
    askerInput.addAddress(userAddress);
    const { handles: askerHandles, inputProof: askerProof } = await askerInput.encrypt();
    
    console.log('📊 Calling contract with parameters:');
    console.log('  Content handle:', contentHandles[0]);
    console.log('  Content proof length:', contentProof.length);
    console.log('  Asker handle:', askerHandles[0]);
    console.log('  Asker proof length:', askerProof.length);
    
    // Try to estimate gas first
    console.log('⛽ Estimating gas...');
    try {
      const gasEstimate = await contract.postQuestion.estimateGas(
        contentHandles[0],
        ethers.hexlify(contentProof),
        askerHandles[0],
        ethers.hexlify(askerProof)
      );
      console.log('⛽ Gas estimate:', gasEstimate.toString());
    } catch (gasError) {
      console.error('❌ Gas estimation failed:', gasError.message);
      console.error('❌ Gas error data:', gasError.data);
      return;
    }
    
    // Call the contract
    console.log('📞 Calling postQuestion...');
    const tx = await contract.postQuestion(
      contentHandles[0],
      ethers.hexlify(contentProof),
      askerHandles[0],
      ethers.hexlify(askerProof)
    );
    
    console.log('⏳ Waiting for transaction...');
    const receipt = await tx.wait();
    console.log('✅ Transaction successful!');
    console.log('📋 Transaction hash:', receipt.hash);
    
  } catch (error) {
    console.error('❌ Contract call test failed:', error.message);
    if (error.data) {
      console.error('❌ Error data:', error.data);
    }
    console.error('❌ Stack:', error.stack);
  }
}

testContractCall();
