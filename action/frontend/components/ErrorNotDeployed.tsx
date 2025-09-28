"use client";

import React from "react";

interface ErrorNotDeployedProps {
  chainId: number;
}

export const ErrorNotDeployed: React.FC<ErrorNotDeployedProps> = ({ chainId }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Contract Not Deployed
        </h1>
        
        <p className="text-gray-600 mb-6">
          The AnonScholar contract is not deployed on chain {chainId}.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            Please switch to a supported network (Hardhat localhost or Sepolia testnet) 
            where the contract is deployed.
          </p>
        </div>
      </div>
    </div>
  );
};