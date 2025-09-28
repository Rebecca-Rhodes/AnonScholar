"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "./useMetaMask";

export const useMetaMaskEthersSigner = () => {
  const metaMask = useMetaMask();
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const initializeProvider = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setProvider(null);
      setSigner(null);
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signerInstance = await browserProvider.getSigner();
      
      setProvider(browserProvider);
      setSigner(signerInstance);
    } catch (error) {
      console.error("Failed to initialize provider:", error);
      setProvider(null);
      setSigner(null);
    }
  }, []);

  useEffect(() => {
    if (metaMask.isConnected) {
      initializeProvider();
    } else {
      setProvider(null);
      setSigner(null);
    }
  }, [metaMask.isConnected, initializeProvider]);

  return {
    ...metaMask,
    signer,
    provider,
  };
};