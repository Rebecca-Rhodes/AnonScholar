//////////////////////////////////////////////////////////////////////////
//
// WARNING!!
// ALWAY USE DYNAMICALLY IMPORT THIS FILE TO AVOID INCLUDING THE ENTIRE 
// FHEVM MOCK LIB IN THE FINAL PRODUCTION BUNDLE!!
//
//////////////////////////////////////////////////////////////////////////

import { JsonRpcProvider } from "ethers";
import { MockFhevmInstance } from "@fhevm/mock-utils";
import type { FhevmInstanceType } from "../../fhevmTypes";

export const fhevmMockCreateInstance = async (parameters: {
  rpcUrl: string;
  chainId: number;
  metadata: {
    ACLAddress: `0x${string}`;
    InputVerifierAddress: `0x${string}`;
    KMSVerifierAddress: `0x${string}`;
  };
}): Promise<FhevmInstanceType> => {
  console.log("🔧 Creating Mock FHEVM instance with parameters:", parameters);
  
  try {
    const provider = new JsonRpcProvider(parameters.rpcUrl);
    const instance = await MockFhevmInstance.create(provider, provider, {
      aclContractAddress: parameters.metadata.ACLAddress,
      chainId: parameters.chainId,
      gatewayChainId: 55815,
      inputVerifierContractAddress: parameters.metadata.InputVerifierAddress,
      kmsContractAddress: parameters.metadata.KMSVerifierAddress,
      verifyingContractAddressDecryption: "0x5ffdaAB0373E62E2ea2944776209aEf29E631A64",
      verifyingContractAddressInputVerification: "0x812b06e1CDCE800494b79fFE4f925A504a9A9810",
    });
    
    console.log("✅ Mock FHEVM instance created successfully");
    return instance;
  } catch (error) {
    console.error("❌ Failed to create Mock FHEVM instance:", error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const createMockFhevmInstance = async (): Promise<FhevmInstanceType> => {
  console.log("🔧 Creating Mock FHEVM instance with hardcoded metadata...");
  
  try {
    // Use hardcoded contract addresses for local development
    const metadata = {
      ACLAddress: "0x50157CFfD6bBFA2DECe204a89ec419c23ef5755D" as `0x${string}`,
      InputVerifierAddress: "0x901F8942346f7AB3a01F6D7613119Bca447Bb030" as `0x${string}`,
      KMSVerifierAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC" as `0x${string}`,
    };
    
    return await fhevmMockCreateInstance({
      rpcUrl: "http://127.0.0.1:8545",
      chainId: 31337,
      metadata,
    });
  } catch (error) {
    console.error("❌ Failed to create Mock FHEVM instance:", error);
    throw error;
  }
};
