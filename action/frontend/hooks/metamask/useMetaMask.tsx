"use client";

import { useState, useEffect, useCallback } from "react";

declare global {
  interface EthereumProvider {
    request(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<unknown>;
    on(event: string, handler: (...args: any[]) => void): void;
    removeListener(event: string, handler: (...args: any[]) => void): void;
  }
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export interface MetaMaskState {
  isConnected: boolean;
  accounts: string[];
  chainId: number | null;
  error: string | null;
}

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    accounts: [],
    chainId: null,
    error: null,
  });

  const connect = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setState({
        isConnected: true,
        accounts: accounts as string[],
        chainId: parseInt(chainId as string, 16),
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Connection failed",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      accounts: [],
      chainId: null,
      error: null,
    });
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Chain switch failed",
      }));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) {
      return;
    }

    const ethereum = window.ethereum as EthereumProvider;

    // Check if already connected on mount
    const checkConnection = async () => {
      try {
        const accounts = (await ethereum.request({
          method: "eth_accounts",
        })) as string[];

        if (accounts.length > 0) {
          const chainId = (await ethereum.request({
            method: "eth_chainId",
          })) as string;

          setState({
            isConnected: true,
            accounts: accounts as string[],
            chainId: parseInt(chainId, 16),
            error: null,
          });
        }
      } catch (error) {
        console.error("Failed to check connection:", error);
      }
    };

    checkConnection();

    const handleAccountsChanged = (accounts: string[]) => {
      setState(prev => ({
        ...prev,
        accounts: accounts as string[],
        isConnected: accounts.length > 0,
      }));
    };

    const handleChainChanged = (chainId: string) => {
      setState(prev => ({
        ...prev,
        chainId: parseInt(chainId, 16),
      }));
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    switchChain,
  };
};