'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BookOpen, Shield, History, Wallet, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live on Base Mainnet
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              Your On-Chain <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                Transaction Diary
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              BaseLog helps you document your Web3 journey. Add permanent, decentralized notes to your transactions and never forget the "why" behind a transfer again.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="custom-connect-button-wrapper">
                <ConnectButton label="Connect Wallet to Start" />
              </div>
              <a 
                href="#features" 
                className="px-6 py-3 rounded-xl bg-white dark:bg-surface-dark text-slate-700 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why use BaseLog?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We combine the permanence of blockchain with the usability of a modern note-taking app.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<History className="w-6 h-6 text-primary" />}
              title="Transaction Context"
              description="Add context to your transaction history. Remember why you bought that NFT or sent those tokens."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="Private & Secure"
              description="Your notes are encrypted and stored on IPFS. Only you can decrypt and read your personal diary entries."
            />
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6 text-primary" />}
              title="Permanent Record"
              description="Built on Base and IPFS, ensuring your transaction diary remains accessible as long as the blockchain exists."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Simple, seamless integration
              </h2>
              <div className="space-y-8">
                <Step 
                  number="01"
                  title="Connect your Wallet"
                  description="Sign in with your Ethereum wallet. We support MetaMask, Coinbase Wallet, Rainbow, and more."
                />
                <Step 
                  number="02"
                  title="Select a Transaction"
                  description="Browse your transaction history on Base. Click on any transaction you want to document."
                />
                <Step 
                  number="03"
                  title="Write & Save"
                  description="Add your notes, tags, and categories. Sign the transaction to save it permanently on-chain."
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
                {/* Abstract UI representation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-blue-500 rounded-lg opacity-20" />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                    <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
                    <div className="h-20 w-full bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-primary shadow-sm">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
