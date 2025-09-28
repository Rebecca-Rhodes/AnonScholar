"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ethers } from "ethers";
import { useFhevm } from "../fhevm/useFhevm";
import { FhevmDecryptionSignature } from "../fhevm/FhevmDecryptionSignature";
import type { QuestionData, AnswerData, VoteData } from "../fhevm/fhevmTypes";

// Contract ABI and address will be imported from generated files
import { AnonScholarABI } from "../abi/AnonScholarABI";
import { AnonScholarAddresses } from "../abi/AnonScholarAddresses";

export const useAnonScholar = (signer: ethers.Signer | null, chainId: number | null) => {
  const { fhevmStatus, storage } = useFhevm(chainId ?? undefined);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<Map<number, AnswerData[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const operationRef = useRef(false);

  const anonScholar = useMemo(() => {
    if (!signer || !chainId || fhevmStatus.status !== "ready") {
      return null;
    }

    const key = chainId as unknown as keyof typeof AnonScholarAddresses;
    const address = (AnonScholarAddresses as Record<keyof typeof AnonScholarAddresses, string>)[key];
    if (!address) {
      return null;
    }

    return new ethers.Contract(address, AnonScholarABI, signer);
  }, [signer, chainId, fhevmStatus.status]);

  const encryptData = useCallback(async (data: string): Promise<{handle: string, proof: string}> => {
    if (fhevmStatus.status !== "ready" || !fhevmStatus.config || !signer) {
      throw new Error("FHEVM not ready");
    }

    try {
      // Get contract address from AnonScholarAddresses
      const contractAddress = AnonScholarAddresses[31337];
      if (!contractAddress) {
        throw new Error("Contract address not found");
      }

      // Get user address
      const userAddress = await signer.getAddress();

      console.log("🔍 Encryption debug info:");
      console.log("Contract address:", contractAddress);
      console.log("User address:", userAddress);
      console.log("Data to encrypt:", data);

      // Create encrypted input buffer
      const encryptedInput = fhevmStatus.config.instance.createEncryptedInput(
        contractAddress,
        userAddress
      );

      // Convert content to a hash for storage (following the pattern from useConfDiary)
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes(data));
      const contentHashBigInt = BigInt(contentHash);
      
      // Ensure the value fits within uint128 range (max: 2^128 - 1)
      const maxUint128 = (BigInt(2) ** BigInt(128)) - BigInt(1);
      const clampedValue = contentHashBigInt % (maxUint128 + BigInt(1));
      
      console.log("🔍 Content:", data);
      console.log("🔍 Content hash:", contentHash);
      console.log("🔍 Content hash BigInt:", contentHashBigInt.toString());
      console.log("🔍 Max uint128:", maxUint128.toString());
      console.log("🔍 Clamped value:", clampedValue.toString());

      // Add the clamped hash value to the encrypted input (using add128 as required by contract)
      encryptedInput.add128(clampedValue);
      
      // Let browser repaint before CPU-intensive encryption (following useConfDiary pattern)
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Encrypt the data
      const encrypted = await encryptedInput.encrypt();

      const handleHex = typeof encrypted.handles[0] === "string"
        ? (encrypted.handles[0] as string)
        : ethers.hexlify(encrypted.handles[0] as Uint8Array);
      const proofStr = String(encrypted.inputProof);

      console.log("✅ Encryption successful");
      console.log("Handle:", handleHex);
      console.log("Proof:", proofStr);

      return {
        handle: handleHex,
        proof: proofStr
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Encryption failed");
    }
  }, [fhevmStatus, signer]);

  const encryptAddress = useCallback(async (address: string): Promise<{handle: string, proof: string}> => {
    if (fhevmStatus.status !== "ready" || !fhevmStatus.config || !signer) {
      throw new Error("FHEVM not ready");
    }

    try {
      // Get contract address from AnonScholarAddresses
      const contractAddress = AnonScholarAddresses[31337];
      if (!contractAddress) {
        throw new Error("Contract address not found");
      }

      // Get user address
      const userAddress = await signer.getAddress();

      console.log("🔍 Address encryption debug info:");
      console.log("Contract address:", contractAddress);
      console.log("User address:", userAddress);
      console.log("Address to encrypt:", address);

      // Create encrypted input buffer
      const encryptedInput = fhevmStatus.config.instance.createEncryptedInput(
        contractAddress,
        userAddress
      );

      // Add the address to the encrypted input using addAddress for externalEaddress
      encryptedInput.addAddress(address);
      
      // Let browser repaint before CPU-intensive encryption
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Encrypt the address
      const encrypted = await encryptedInput.encrypt();

      const handleHex = typeof encrypted.handles[0] === "string"
        ? (encrypted.handles[0] as string)
        : ethers.hexlify(encrypted.handles[0] as Uint8Array);
      const proofStr = String(encrypted.inputProof);

      console.log("✅ Address encryption successful");
      console.log("Handle:", handleHex);
      console.log("Proof:", proofStr);

      return {
        handle: handleHex,
        proof: proofStr
      };
    } catch (error) {
      console.error("Address encryption failed:", error);
      throw new Error("Address encryption failed");
    }
  }, [fhevmStatus, signer]);

  const encryptUint32 = useCallback(async (value: number): Promise<{handle: string, proof: string}> => {
    if (fhevmStatus.status !== "ready" || !fhevmStatus.config || !signer) {
      throw new Error("FHEVM not ready");
    }

    try {
      // Get contract address from AnonScholarAddresses
      const contractAddress = AnonScholarAddresses[31337];
      if (!contractAddress) {
        throw new Error("Contract address not found");
      }

      // Get user address
      const userAddress = await signer.getAddress();

      console.log("🔍 Uint32 encryption debug info:");
      console.log("Contract address:", contractAddress);
      console.log("User address:", userAddress);
      console.log("Value to encrypt:", value);

      // Create encrypted input buffer
      const encryptedInput = fhevmStatus.config.instance.createEncryptedInput(
        contractAddress,
        userAddress
      );

      // Add the uint32 value to the encrypted input using add32 for externalEuint32
      encryptedInput.add32(value);
      
      // Let browser repaint before CPU-intensive encryption
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Encrypt the data
      const encrypted = await encryptedInput.encrypt();

      const handleHex = typeof encrypted.handles[0] === "string"
        ? (encrypted.handles[0] as string)
        : ethers.hexlify(encrypted.handles[0] as Uint8Array);
      const proofStr = String(encrypted.inputProof);

      console.log("✅ Uint32 encryption successful");
      console.log("Handle:", handleHex);
      console.log("Proof:", proofStr);

      return {
        handle: handleHex,
        proof: proofStr
      };
    } catch (error) {
      console.error("Uint32 encryption failed:", error);
      throw new Error("Uint32 encryption failed");
    }
  }, [fhevmStatus, signer]);

  const decryptData = useCallback(async (encryptedData: string): Promise<string> => {
    if (fhevmStatus.status !== "ready" || !fhevmStatus.config || !signer) {
      throw new Error("FHEVM not ready or signer not available");
    }

    try {
             // Check if we're in mock environment
             if (fhevmStatus.config.chainId === 31337) {
               // For mock environment, simulate decryption with signature
               console.log("🔓 Mock decryption with signature for:", encryptedData);
               
               // Create decryption signature (this will still require user signature)
               const signature = await FhevmDecryptionSignature.createDecryptionSignature(
                 signer,
                 fhevmStatus.config.publicKey,
                 encryptedData
               );
               
               console.log("✅ Mock decryption signature created:", signature.signature);
               
               // For mock environment, we can't actually decrypt the content
               // but we can return a placeholder that indicates the content was encrypted
               return "🔒 [问题内容已加密 - 本地测试环境] - 问题ID: " + encryptedData.slice(-4);
             }

      // For production environment, use real decryption
      const signature = await FhevmDecryptionSignature.createDecryptionSignature(
        signer,
        fhevmStatus.config.publicKey,
        encryptedData
      );

      // Try different possible method names for decrypt
      const instanceAny = fhevmStatus.config.instance as any;
      let decrypted;
      if (typeof instanceAny.decrypt === 'function') {
        decrypted = await instanceAny.decrypt(
          encryptedData,
          signature.signature
        );
      } else if (typeof instanceAny.reencrypt === 'function') {
        decrypted = await instanceAny.reencrypt(
          encryptedData,
          signature.signature
        );
      } else {
        throw new Error("No decrypt method found on FHEVM instance");
      }

      return decrypted;
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Decryption failed");
    }
  }, [fhevmStatus, signer]);

  const postQuestion = useCallback(async (content: string): Promise<void> => {
    if (!anonScholar || operationRef.current) return;

    try {
      operationRef.current = true;
      setLoading(true);
      setError(null);

      // Encrypt content and asker address
      const encryptedContentData = await encryptData(content);
      const encryptedAskerData = await encryptAddress(await signer!.getAddress());
      
      // Debug logging
      console.log("🔍 Debug - Contract call parameters:");
      console.log("Contract address:", AnonScholarAddresses[31337]);
      console.log("Encrypted content handle:", encryptedContentData.handle);
      console.log("Content proof:", encryptedContentData.proof);
      console.log("Encrypted asker handle:", encryptedAskerData.handle);
      console.log("Asker proof:", encryptedAskerData.proof);
      console.log("From address:", await signer!.getAddress());
      
      // Debug the encrypted data before sending
      console.log("🔍 Final contract call parameters:");
      console.log("Content handle type:", typeof encryptedContentData.handle);
      console.log("Content handle length:", encryptedContentData.handle?.length);
      console.log("Content proof type:", typeof encryptedContentData.proof);
      console.log("Content proof length:", encryptedContentData.proof?.length);
      console.log("Asker handle type:", typeof encryptedAskerData.handle);
      console.log("Asker handle length:", encryptedAskerData.handle?.length);
      console.log("Asker proof type:", typeof encryptedAskerData.proof);
      console.log("Asker proof length:", encryptedAskerData.proof?.length);
      
      const tx = await anonScholar.postQuestion(
        encryptedContentData.handle, // externalEuint128
        encryptedContentData.proof,  // contentProof
        encryptedAskerData.handle,   // externalEaddress
        encryptedAskerData.proof     // askerProof
      );
      await tx.wait();

      // Refresh questions by calling the loadQuestions function
      console.log("🔄 Refreshing questions after posting...");
      await loadQuestions();
    } catch (error) {
      console.error("Failed to post question:", error);
      setError(error instanceof Error ? error.message : "Failed to post question");
    } finally {
      setLoading(false);
      operationRef.current = false;
    }
  }, [anonScholar, encryptData, encryptAddress, signer]);

  const postAnswer = useCallback(async (questionId: number, content: string): Promise<void> => {
    if (!anonScholar || operationRef.current) return;

    try {
      operationRef.current = true;
      setLoading(true);
      setError(null);

      // Encrypt content and answerer address
      const encryptedContentData = await encryptData(content);
      const encryptedAnswererData = await encryptAddress(await signer!.getAddress());
      
      const tx = await anonScholar.postAnswer(
        questionId,
        encryptedContentData.handle, // externalEuint128
        encryptedContentData.proof,  // contentProof
        encryptedAnswererData.handle, // externalEaddress
        encryptedAnswererData.proof   // answererProof
      );
      await tx.wait();

      // Refresh answers for this question
      await loadAnswers(questionId);
    } catch (error) {
      console.error("Failed to post answer:", error);
      setError(error instanceof Error ? error.message : "Failed to post answer");
    } finally {
      setLoading(false);
      operationRef.current = false;
    }
  }, [anonScholar, encryptData, encryptAddress, signer]);

  const voteAnswer = useCallback(async (questionId: number, answerId: number, isUpvote: boolean): Promise<void> => {
    if (!anonScholar || operationRef.current) return;

    try {
      operationRef.current = true;
      setLoading(true);
      setError(null);

      // Encrypt vote type and weight using uint32 encryption
      const encryptedVoteType = await encryptUint32(isUpvote ? 1 : 0);
      const encryptedWeight = await encryptUint32(1); // Default weight of 1
      
      console.log("🔍 Vote debug info:");
      console.log("Answer ID:", answerId);
      console.log("Is upvote:", isUpvote);
      console.log("Vote type handle:", encryptedVoteType.handle);
      console.log("Weight handle:", encryptedWeight.handle);
      
      const tx = await anonScholar.castVote(
        answerId, // targetId
        false,    // isQuestion (false for answer)
        encryptedVoteType.handle, // externalEuint32 encryptedVoteType
        encryptedVoteType.proof,  // voteTypeProof
        encryptedWeight.handle,   // externalEuint32 encryptedWeight
        encryptedWeight.proof     // weightProof
      );
      await tx.wait();

      // Refresh answers for this question
      await loadAnswers(questionId);
    } catch (error) {
      console.error("Failed to vote:", error);
      setError(error instanceof Error ? error.message : "Failed to vote");
    } finally {
      setLoading(false);
      operationRef.current = false;
    }
  }, [anonScholar, encryptUint32]);

  const loadQuestions = useCallback(async (): Promise<void> => {
    if (!anonScholar) return;

    try {
      console.log("🔄 Loading questions...");
      
      // First check the question counter
      const questionCounter = await anonScholar.questionCounter();
      console.log("📊 Question counter:", questionCounter.toString());
      console.log("📊 Question counter type:", typeof questionCounter);
      console.log("📊 Question counter value:", questionCounter);
      
      if (questionCounter.toString() === "0") {
        console.log("ℹ️ No questions found in contract");
        setQuestions([]);
        return;
      }
      
      const questionList = await anonScholar.getRecentQuestions(10); // Get recent 10 questions
      console.log("📋 Question list from contract:", questionList);
      console.log("📋 Question list length:", questionList.length);
      console.log("📋 Question list type:", typeof questionList);
      
      const questionData: QuestionData[] = [];

      for (const questionId of questionList) {
        console.log("🔍 Loading question ID:", questionId.toString());
        console.log("🔍 Question ID type:", typeof questionId);
        const question = await anonScholar.getQuestion(questionId);
        console.log("📄 Question data:", question);
        
        const questionItem = {
          id: Number(questionId),
          content: "Encrypted content", // Will be decrypted on demand
          author: "Anonymous",
          timestamp: Number(question.timestamp),
          upvotes: 0, // Will be decrypted on demand
          downvotes: 0,
          score: 0,
        };
        
        console.log("📝 Adding question item:", questionItem);
        questionData.push(questionItem);
      }

      console.log("✅ Loaded questions:", questionData);
      setQuestions(questionData);
    } catch (error) {
      console.error("❌ Failed to load questions:", error);
      setError(error instanceof Error ? error.message : "Failed to load questions");
    }
  }, [anonScholar]);

  const loadAnswers = useCallback(async (questionId: number): Promise<void> => {
    if (!anonScholar) return;

    try {
      const answerList = await anonScholar.getQuestionAnswers(questionId);
      const answerData: AnswerData[] = [];

      for (const answerId of answerList) {
        const answer = await anonScholar.getAnswer(answerId);
        answerData.push({
          id: Number(answerId),
          questionId,
          content: "Encrypted content", // Will be decrypted on demand
          author: "Anonymous",
          timestamp: Number(answer.timestamp),
          upvotes: 0, // Will be decrypted on demand
          downvotes: 0,
          score: 0,
        });
      }

      setAnswers(prev => new Map(prev.set(questionId, answerData)));
    } catch (error) {
      console.error("Failed to load answers:", error);
      setError(error instanceof Error ? error.message : "Failed to load answers");
    }
  }, [anonScholar]);

  const decryptQuestion = useCallback(async (questionId: number): Promise<QuestionData | null> => {
    if (!anonScholar) return null;

    try {
      const question = await anonScholar.getQuestion(questionId);
      const decryptedContent = await decryptData(question.encryptedContent);
      
      return {
        id: questionId,
        content: decryptedContent,
        author: "Anonymous", // Author is encrypted and not decrypted for privacy
        timestamp: Number(question.timestamp),
        upvotes: 0, // Vote counts are encrypted and not decrypted for privacy
        downvotes: 0,
        score: 0,
      };
    } catch (error) {
      console.error("Failed to decrypt question:", error);
      return null;
    }
  }, [anonScholar, decryptData]);

  const decryptAnswer = useCallback(async (answerId: number): Promise<AnswerData | null> => {
    if (!anonScholar) return null;

    try {
      const answer = await anonScholar.getAnswer(answerId);
      const decryptedContent = await decryptData(answer.encryptedContent);
      
      return {
        id: answerId,
        questionId: Number(answer.questionId),
        content: decryptedContent,
        author: "Anonymous", // Author is encrypted and not decrypted for privacy
        timestamp: Number(answer.timestamp),
        upvotes: 0, // Vote counts are encrypted and not decrypted for privacy
        downvotes: 0,
        score: 0,
      };
    } catch (error) {
      console.error("Failed to decrypt answer:", error);
      return null;
    }
  }, [anonScholar, decryptData]);

  useEffect(() => {
    if (anonScholar) {
      console.log("🔄 useEffect: Loading questions on component mount");
      loadQuestions();
    }
  }, [anonScholar, loadQuestions]);


  return {
    anonScholar,
    questions,
    answers,
    loading,
    error,
    postQuestion,
    postAnswer,
    voteAnswer,
    loadQuestions,
    loadAnswers,
    decryptQuestion,
    decryptAnswer,
    fhevmStatus,
  };
};