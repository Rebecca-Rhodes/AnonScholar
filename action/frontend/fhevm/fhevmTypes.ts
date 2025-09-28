import type { MockFhevmInstance } from "@fhevm/mock-utils";
import type { FhevmInstance } from "@zama-fhe/relayer-sdk/web";

export type FhevmInstanceType = MockFhevmInstance | FhevmInstance;

export interface FhevmConfig {
  chainId: number;
  publicKey: string;
  instance: FhevmInstanceType;
}

export interface FhevmStatus {
  status: 'loading' | 'ready' | 'error';
  error?: string;
  config?: FhevmConfig;
}

export interface DecryptionSignature {
  signature: string;
  publicKey: string;
  timestamp: number;
}

export interface EncryptedData {
  data: string;
  publicKey: string;
}

export interface QuestionData {
  id: number;
  content: string;
  author: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  score: number;
}

export interface AnswerData {
  id: number;
  questionId: number;
  content: string;
  author: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  score: number;
}

export interface VoteData {
  hasVoted: boolean;
  voteType: boolean; // true for upvote, false for downvote
  weight: number;
}