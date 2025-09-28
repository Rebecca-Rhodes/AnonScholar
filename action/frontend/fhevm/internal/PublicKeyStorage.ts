import { openDB, DBSchema, IDBPDatabase } from "idb";

interface FhevmDB extends DBSchema {
  publicKeys: {
    key: string;
    value: {
      chainId: string;
      publicKey: string;
      timestamp: number;
    };
  };
}

export class PublicKeyStorage {
  private db: IDBPDatabase<FhevmDB> | null = null;

  async init(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      this.db = await openDB<FhevmDB>("fhevm-storage", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("publicKeys")) {
            db.createObjectStore("publicKeys", { keyPath: "chainId" });
          }
        },
      });
    } catch (error) {
      console.error("Failed to initialize IndexedDB:", error);
    }
  }

  async storePublicKey(chainId: number, publicKey: string): Promise<void> {
    if (!this.db) {
      console.log("📝 PublicKeyStorage: Database not initialized, skipping storage");
      return;
    }

    try {
      await this.db.put("publicKeys", {
        chainId: chainId.toString(),
        publicKey,
        timestamp: Date.now(),
      });
      console.log("✅ PublicKeyStorage: Successfully stored public key for chain", chainId);
    } catch (error) {
      console.warn("⚠️ PublicKeyStorage: Failed to store public key (non-critical):", error);
      // This is non-critical for local development, so we don't throw
    }
  }

  async getPublicKey(chainId: number): Promise<string | null> {
    if (!this.db) return null;

    try {
      const result = await this.db.get("publicKeys", chainId.toString());
      return result?.publicKey || null;
    } catch (error) {
      console.error("Failed to get public key:", error);
      return null;
    }
  }

  async clearPublicKey(chainId: number): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.delete("publicKeys", chainId.toString());
    } catch (error) {
      console.error("Failed to clear public key:", error);
    }
  }
}