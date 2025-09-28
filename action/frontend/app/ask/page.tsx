"use client";

import React, { useState, useCallback } from "react";
import { useMetaMaskEthersSigner } from "../../hooks/metamask/useMetaMaskEthersSigner";
import { useAnonScholar } from "../../hooks/useAnonScholar";
import { Navigation } from "../../components/Navigation";

export default function AskPage() {
  const { isConnected, accounts, chainId, signer } = useMetaMaskEthersSigner();
  const anonScholar = useAnonScholar(signer, chainId);
  
  const [newQuestion, setNewQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostQuestion = useCallback(async () => {
    if (!newQuestion.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await anonScholar.postQuestion(newQuestion);
      setNewQuestion("");
      // 可以添加成功提示
      alert("问题发布成功！");
    } catch (error) {
      console.error("Failed to post question:", error);
      alert("发布问题失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  }, [newQuestion, anonScholar, isSubmitting]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300">Please connect your MetaMask wallet to ask questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Ask a Question</h1>
          <p className="text-gray-300 text-lg">
            Share your question anonymously with the community
          </p>
        </div>

        {/* Question Form */}
        <div className="glass-card p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
              Your Question
            </label>
            <textarea
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="What would you like to ask? Be specific and clear..."
              className="modern-textarea w-full h-32 resize-none"
              rows={6}
            />
            <p className="text-xs text-gray-400 mt-2">
              Your question will be encrypted and posted anonymously
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {newQuestion.length} characters
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setNewQuestion("")}
                disabled={!newQuestion.trim() || isSubmitting}
                className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                onClick={handlePostQuestion}
                disabled={!newQuestion.trim() || isSubmitting}
                className="gradient-button px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner mr-2" />
                    Posting...
                  </>
                ) : (
                  "Post Question"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="glass-card p-6 max-w-2xl mx-auto mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tips for Good Questions</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Be specific and clear about what you're asking</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Provide context when necessary</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Use proper grammar and spelling</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Keep questions focused on a single topic</span>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <a
            href="/questions"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Browse Questions
          </a>
        </div>
      </div>
    </div>
  );
}
