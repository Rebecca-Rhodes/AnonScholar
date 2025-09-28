import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnonScholar - Anonymous Q&A Platform",
  description: "Ask and answer questions with complete privacy using FHEVM technology",
  keywords: ["anonymous", "Q&A", "privacy", "FHEVM", "blockchain", "encryption"],
  authors: [{ name: "AnonScholar Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased bg-black text-white">
        <Providers>
          <div className="min-h-screen">
            <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold gradient-text">AnonScholar</h1>
                      <p className="text-xs text-gray-400">Anonymous Q&A Platform</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        FHEVM Powered
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Privacy First
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1">
              {children}
            </main>

            <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold gradient-text">AnonScholar</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      A privacy-first Q&A platform powered by FHEVM technology. 
                      Ask and answer questions with complete anonymity.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-4">Technology</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>FHEVM (Fully Homomorphic Encryption)</li>
                      <li>Ethereum Blockchain</li>
                      <li>Zero-Knowledge Privacy</li>
                      <li>Decentralized Architecture</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-4">Features</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>Anonymous Questioning</li>
                      <li>Encrypted Answers</li>
                      <li>Privacy-Preserving Voting</li>
                      <li>Decentralized Storage</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                  <p className="text-sm text-gray-400">
                    © 2024 AnonScholar. Built with privacy and security in mind.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
