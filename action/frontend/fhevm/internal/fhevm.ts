import { createMockFhevmInstance } from "./mock/fhevmMock";
import { loadRelayerSDK } from "./RelayerSDKLoader";
import { PublicKeyStorage } from "./PublicKeyStorage";
import { HARDHAT_RELAYER_METADATA_ENDPOINT } from "./constants";
import type { FhevmInstanceType, FhevmConfig } from "../fhevmTypes";

export const createFhevmInstance = async (chainId: number): Promise<FhevmConfig> => {
  console.log("🚀 Creating FHEVM instance for chain:", chainId);
  
  const publicKeyStorage = new PublicKeyStorage();
  await publicKeyStorage.init();

  // Check if we're in a mock environment (local development)
  const isMockEnvironment = chainId === 31337; // Hardhat chain ID

  if (isMockEnvironment) {
    console.log("🔧 Using Mock FHEVM instance for local development");
    
    try {
      // Use a valid hex public key for local development
      // This is a mock 32-byte public key in hex format
      const mockPublicKey = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      
      // Create mock instance
      const instance = await createMockFhevmInstance();
      
      const config: FhevmConfig = {
        chainId,
        publicKey: mockPublicKey,
        instance,
      };
      
      // Store public key for future use
      await publicKeyStorage.storePublicKey(chainId, mockPublicKey);
      
      console.log("✅ Mock FHEVM instance created successfully");
      return config;
    } catch (error) {
      console.error("❌ Failed to create Mock FHEVM instance:", error);
      throw new Error(`FHEVM_RELAYER_METADATA_ERROR: ${error}`);
    }
  } else {
    console.log("🌐 Using Relayer SDK for production");
    
    try {
      // Load Relayer SDK from CDN
      const relayerSDK = await loadRelayerSDK();
      
      // Get stored public key or fetch from network
      let publicKey = await publicKeyStorage.getPublicKey(chainId);
      
      if (!publicKey) {
        // In production, you would fetch the public key from the relayer
        // For now, we'll use a valid hex placeholder
        publicKey = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
        await publicKeyStorage.storePublicKey(chainId, publicKey);
      }
      
      // Create production instance
      const instance = await relayerSDK.createInstance({
        chainId,
        publicKey,
      });
      
      const config: FhevmConfig = {
        chainId,
        publicKey,
        instance,
      };
      
      console.log("✅ Relayer SDK instance created successfully");
      return config;
    } catch (error) {
      console.error("❌ Failed to create Relayer SDK instance:", error);
      throw new Error(`FHEVM_RELAYER_SDK_ERROR: ${error}`);
    }
  }
};