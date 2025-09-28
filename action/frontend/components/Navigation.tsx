"use client";

import { useRouter, usePathname } from "next/navigation";

export const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">AnonScholar</h1>
                <p className="text-xs text-gray-300">Anonymous Q&A Platform</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="/ask"
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                pathname === "/ask" 
                  ? "bg-white/30 text-white" 
                  : "bg-white/20 hover:bg-white/30 text-gray-200"
              }`}
            >
              Ask Question
            </a>
            <a
              href="/questions"
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                pathname === "/questions" 
                  ? "bg-white/30 text-white" 
                  : "bg-white/20 hover:bg-white/30 text-gray-200"
              }`}
            >
              Browse Questions
            </a>
            <button
              onClick={handleBackToHome}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm text-gray-200"
            >
              ← Home
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
