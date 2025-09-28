"use client";

import { useState, useEffect, useCallback } from "react";
import { createFhevmInstance } from "./internal/fhevm";
import { InMemoryStringStorage } from "./GenericStringStorage";
import type { FhevmStatus, FhevmConfig } from "./fhevmTypes";

export const useFhevm = (chainId: number | undefined) => {
  const [fhevmStatus, setFhevmStatus] = useState<FhevmStatus>({
    status: "loading",
  });

  const [storage] = useState(() => new InMemoryStringStorage());

  const initializeFhevm = useCallback(async () => {
    if (!chainId) {
      setFhevmStatus({ status: "loading" });
      return;
    }

    try {
      setFhevmStatus({ status: "loading" });
      console.log("🔄 Initializing FHEVM for chain:", chainId);

      const config = await createFhevmInstance(chainId);
      
      setFhevmStatus({
        status: "ready",
        config,
      });
      
      console.log("✅ FHEVM initialized successfully");
    } catch (error) {
      console.error("❌ FHEVM initialization failed:", error);
      setFhevmStatus({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [chainId]);

  const refreshFhevm = useCallback(() => {
    initializeFhevm();
  }, [initializeFhevm]);

  useEffect(() => {
    initializeFhevm();
  }, [initializeFhevm]);

  return {
    fhevmStatus,
    refreshFhevm,
    storage,
  };
};