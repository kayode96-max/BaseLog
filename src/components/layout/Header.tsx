'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[24px]">
                book
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                BaseLog
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your On-Chain Diary
              </p>
            </div>
          </div>
        </div>

        <ConnectButton
          chainStatus="icon"
          showBalance={false}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
      </div>
    </header>
  );
}
