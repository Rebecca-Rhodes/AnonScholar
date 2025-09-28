"use client";

import React, { useState, useCallback } from "react";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useAnonScholar } from "../hooks/useAnonScholar";
import type { QuestionData, AnswerData } from "../fhevm/fhevmTypes";

export const AnonScholarDemo: React.FC = () => {
  const { isConnected, accounts, chainId, signer } = useMetaMaskEthersSigner();
  const anonScholar = useAnonScholar(signer, chainId);
  
  const [showAskForm, setShowAskForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [decryptedQuestions, setDecryptedQuestions] = useState<Map<number, QuestionData>>(new Map());
  const [decryptedAnswers, setDecryptedAnswers] = useState<Map<number, AnswerData>>(new Map());

  const handlePostQuestion = useCallback(async () => {
    if (!newQuestion.trim()) return;
    
    await anonScholar.postQuestion(newQuestion);
    setNewQuestion("");
    setShowAskForm(false);
  }, [newQuestion, anonScholar]);

  const handlePostAnswer = useCallback(async (questionId: number) => {
    if (!newAnswer.trim()) return;
    
    await anonScholar.postAnswer(questionId, newAnswer);
    setNewAnswer("");
    setShowAnswerForm(null);
  }, [newAnswer, anonScholar]);

  const handleDecryptQuestion = useCallback(async (questionId: number) => {
    const decrypted = await anonScholar.decryptQuestion(questionId);
    if (decrypted) {
      setDecryptedQuestions(prev => new Map(prev.set(questionId, decrypted)));
      setSelectedQuestion(decrypted);
      // 解密问题后自动加载该问题的答案
      await anonScholar.loadAnswers(questionId);
    }
  }, [anonScholar]);

  const handleDecryptAnswer = useCallback(async (answerId: number) => {
    const decrypted = await anonScholar.decryptAnswer(answerId);
    if (decrypted) {
      setDecryptedAnswers(prev => new Map(prev.set(answerId, decrypted)));
    }
  }, [anonScholar]);

  const handleVote = useCallback(async (questionId: number, answerId: number, isUpvote: boolean) => {
    await anonScholar.voteAnswer(questionId, answerId, isUpvote);
  }, [anonScholar]);

  const renderStatus = () => (
    <div className="glass-card p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        System Status
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border-2 ${isConnected ? 'status-success' : 'status-error'}`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">MetaMask</span>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <p className="text-sm mt-1">
            {isConnected ? `Connected: ${accounts[0]?.slice(0, 6)}...${accounts[0]?.slice(-4)}` : 'Not Connected'}
          </p>
        </div>

        <div className="status-info p-4 rounded-xl border-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Chain ID</span>
            <span className="encrypted-badge">{chainId || 'Unknown'}</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border-2 ${
          anonScholar.fhevmStatus.status === 'ready' ? 'status-success' :
          anonScholar.fhevmStatus.status === 'loading' ? 'status-warning' :
          anonScholar.fhevmStatus.status === 'error' ? 'status-error' : 'status-info'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">FHEVM</span>
            <div className={`w-3 h-3 rounded-full ${
              anonScholar.fhevmStatus.status === 'ready' ? 'bg-green-500' :
              anonScholar.fhevmStatus.status === 'loading' ? 'bg-yellow-500' :
              anonScholar.fhevmStatus.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
          </div>
          <p className="text-sm mt-1 capitalize">{anonScholar.fhevmStatus.status}</p>
        </div>

        <div className={`p-4 rounded-xl border-2 ${anonScholar.anonScholar ? 'status-success' : 'status-warning'}`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Contract</span>
            <div className={`w-3 h-3 rounded-full ${anonScholar.anonScholar ? 'bg-green-500' : 'bg-yellow-500'}`} />
          </div>
          <p className="text-sm mt-1">
            {anonScholar.anonScholar ? 'Deployed' : 'Not Available'}
          </p>
        </div>
      </div>

      {anonScholar.error && (
        <div className="status-error p-4 rounded-xl border-2 mt-4">
          <h4 className="font-medium mb-2">Error:</h4>
          <p className="text-sm">{anonScholar.error}</p>
        </div>
      )}
    </div>
  );

  const renderQuestionCard = (question: QuestionData) => {
    const isDecrypted = decryptedQuestions.has(question.id);
    const decryptedQuestion = decryptedQuestions.get(question.id);
    const isExpanded = selectedQuestion?.id === question.id;

    return (
      <div
        key={question.id}
        className="question-card fade-in"
      >
        <div 
          className="cursor-pointer"
          onClick={() => {
            if (!isDecrypted) {
              handleDecryptQuestion(question.id);
            } else {
              // 如果已解密，点击展开/收起答案
              setSelectedQuestion(isExpanded ? null : decryptedQuestion || question);
            }
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {isDecrypted ? decryptedQuestion?.content : "🔒 Encrypted Question"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isDecrypted ? 
                    (isExpanded ? "Click to collapse answers" : "Click to view answers") : 
                    "Click to decrypt"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                #{question.id}
              </span>
              {isDecrypted && (
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Anonymous</span>
              <span>•</span>
              <span>{new Date(question.timestamp * 1000).toLocaleDateString()}</span>
            </div>
            {isDecrypted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnswerForm(question.id);
                }}
                className="gradient-button text-sm px-4 py-2"
              >
                Answer
              </button>
            )}
          </div>
        </div>

        {/* 展开的答案区域 */}
        {isDecrypted && isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Answers</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnswerForm(question.id);
                }}
                className="gradient-button text-sm px-4 py-2"
              >
                Add Answer
              </button>
            </div>
            
            <div className="space-y-4">
              {anonScholar.answers.get(question.id)?.map(renderAnswerCard) || (
                <div className="glass-card p-6 text-center text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p>No answers yet. Be the first to answer!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnswerCard = (answer: AnswerData) => {
    const isDecrypted = decryptedAnswers.has(answer.id);
    const decryptedAnswer = decryptedAnswers.get(answer.id);

    return (
      <div key={answer.id} className="answer-card fade-in">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-800">
                {isDecrypted ? decryptedAnswer?.content : "🔒 Encrypted Answer"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isDecrypted ? "Decrypted" : "Click to decrypt"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Anonymous</span>
            <span>•</span>
            <span>{new Date(answer.timestamp * 1000).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => !isDecrypted && handleDecryptAnswer(answer.id)}
              className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              {isDecrypted ? "Decrypted" : "Decrypt"}
            </button>
            <button
              onClick={() => handleVote(answer.questionId, answer.id, true)}
              className="vote-button vote-up"
            >
              ↑
            </button>
            <button
              onClick={() => handleVote(answer.questionId, answer.id, false)}
              className="vote-button vote-down"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAskForm = () => (
    <div className="glass-card p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Ask a Question</h2>
      <textarea
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="What would you like to ask anonymously?"
        className="modern-textarea mb-4"
        rows={4}
      />
      <div className="flex space-x-3">
        <button
          onClick={handlePostQuestion}
          disabled={!newQuestion.trim() || anonScholar.loading}
          className="gradient-button"
        >
          {anonScholar.loading ? (
            <>
              <div className="loading-spinner mr-2" />
              Posting...
            </>
          ) : (
            "Post Question"
          )}
        </button>
        <button
          onClick={() => setShowAskForm(false)}
          className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderAnswerForm = (questionId: number) => (
    <div className="glass-card p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Answer Question</h2>
      <textarea
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        placeholder="Share your knowledge anonymously..."
        className="modern-textarea mb-4"
        rows={4}
      />
      <div className="flex space-x-3">
        <button
          onClick={() => handlePostAnswer(questionId)}
          disabled={!newAnswer.trim() || anonScholar.loading}
          className="gradient-button"
        >
          {anonScholar.loading ? (
            <>
              <div className="loading-spinner mr-2" />
              Posting...
            </>
          ) : (
            "Post Answer"
          )}
        </button>
        <button
          onClick={() => setShowAnswerForm(null)}
          className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-300">Please connect your MetaMask wallet to use AnonScholar</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStatus()}

      {showAskForm && renderAskForm()}

      {showAnswerForm && renderAnswerForm(showAnswerForm)}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Questions</h2>
        <button
          onClick={() => setShowAskForm(true)}
          className="gradient-button"
        >
          Ask Question
        </button>
      </div>

      <div className="space-y-4">
        {anonScholar.questions.map(renderQuestionCard)}
      </div>
    </div>
  );
};
