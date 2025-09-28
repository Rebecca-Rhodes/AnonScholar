"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { ErrorNotDeployed } from "../components/ErrorNotDeployed";

export default function Home() {
  const { isConnected, chainId, connect, error } = useMetaMaskEthersSigner();
  const router = useRouter();

  // Show error page for unsupported networks
  if (chainId && ![31337, 11155111].includes(chainId)) {
    return <ErrorNotDeployed chainId={chainId} />;
  }

  // No automatic redirect - let user choose

  // Show connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <div className="float-animation mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl glow-effect">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Welcome to AnonScholar
          </h1>
          
          <p className="text-gray-300 mb-8">
            Connect your MetaMask wallet to start asking and answering questions anonymously
          </p>
          
          <button
            onClick={connect}
            className="gradient-button text-lg px-8 py-4 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect MetaMask
          </button>
          
          {error && (
            <div className="status-error p-4 rounded-xl border-2 mt-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="mt-8 text-sm text-gray-400">
            <p>Supported Networks:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <span className="encrypted-badge">Hardhat (31337)</span>
              <span className="encrypted-badge">Sepolia (11155111)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome page when connected
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="float-animation mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center shadow-2xl glow-effect">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold gradient-text mb-4">
          Welcome to AnonScholar
        </h1>
        
        <p className="text-gray-300 mb-8">
          Your wallet is connected! Ready to start asking and answering questions anonymously.
        </p>
        
        <div className="space-y-3 w-full">
          <button
            onClick={() => router.push('/ask')}
            className="gradient-button text-lg px-8 py-4 w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ask a Question
          </button>
          <button
            onClick={() => router.push('/questions')}
            className="w-full px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-colors text-white"
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Browse Questions
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-400">
          <p>Connected to: {chainId === 31337 ? 'Hardhat Local' : `Chain ${chainId}`}</p>
        </div>
      </div>
    </div>
  );
}
