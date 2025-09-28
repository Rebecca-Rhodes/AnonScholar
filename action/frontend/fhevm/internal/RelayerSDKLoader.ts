import { FHEVM_SDK_CDN_URL } from "./constants";

export interface RelayerSDK {
  createInstance: (config: any) => Promise<any>;
}

declare global {
  interface Window {
    FhevmInstance?: RelayerSDK;
  }
}

export const loadRelayerSDK = async (): Promise<RelayerSDK> => {
  if (typeof window === "undefined") {
    throw new Error("RelayerSDK can only be loaded in browser environment");
  }

  if (window.FhevmInstance) {
    return window.FhevmInstance;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = FHEVM_SDK_CDN_URL;
    script.async = true;
    script.onload = () => {
      if (window.FhevmInstance) {
        resolve(window.FhevmInstance);
      } else {
        reject(new Error("Failed to load FhevmInstance from CDN"));
      }
    };
    script.onerror = () => {
      reject(new Error(`Failed to load script from ${FHEVM_SDK_CDN_URL}`));
    };
    document.head.appendChild(script);
  });
};