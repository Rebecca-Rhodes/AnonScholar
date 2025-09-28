import { ethers } from "ethers";
import type { DecryptionSignature } from "./fhevmTypes";

export class FhevmDecryptionSignature {
  private static readonly DOMAIN = {
    name: "FHEVM",
    version: "1",
  };

  private static readonly TYPES = {
    Reencrypt: [
      { name: "publicKey", type: "bytes" },
      { name: "ciphertext", type: "bytes" },
    ],
  };

  static async createDecryptionSignature(
    signer: ethers.Signer,
    publicKey: string,
    ciphertext: string
  ): Promise<DecryptionSignature> {
    const message = {
      publicKey,
      ciphertext,
    };

    const signature = await signer.signTypedData(
      FhevmDecryptionSignature.DOMAIN,
      FhevmDecryptionSignature.TYPES,
      message
    );

    return {
      signature,
      publicKey,
      timestamp: Date.now(),
    };
  }

  static async loadDecryptionSignature(
    storage: any,
    publicKey: string
  ): Promise<DecryptionSignature | null> {
    try {
      const stored = await storage.getItem(`decryption_signature_${publicKey}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load decryption signature:", error);
    }
    return null;
  }

  static async saveDecryptionSignature(
    storage: any,
    signature: DecryptionSignature
  ): Promise<void> {
    try {
      await storage.setItem(
        `decryption_signature_${signature.publicKey}`,
        JSON.stringify(signature)
      );
    } catch (error) {
      console.error("Failed to save decryption signature:", error);
    }
  }

  static isSignatureValid(signature: DecryptionSignature): boolean {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return now - signature.timestamp < maxAge;
  }
}