'use client';

import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface DayTransactionsListProps {
  date: Date;
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
  onClose: () => void;
}

export function DayTransactionsList({
  date,
  transactions,
  onTransactionClick,
  onClose,
}: DayTransactionsListProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-soft border border-gray-200 dark:border-gray-800 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {format(date, 'MMMM d, yyyy')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Transactions list */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {transactions.map((tx) => (
            <button
              key={tx.hash}
              onClick={() => onTransactionClick(tx)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'sent'
                      ? 'bg-red-50 dark:bg-red-900/20'
                      : 'bg-green-50 dark:bg-green-900/20'
                  }`}
                >
                  {tx.type === 'sent' ? (
                    <ArrowUpRight className="w-5 h-5 text-red-500" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-green-500" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {tx.type === 'sent' ? 'Sent' : 'Received'} {tx.amount} ETH
                    </p>
                    {tx.hasNote && (
                      <span className="material-symbols-outlined text-gold text-[18px]">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate mt-1">
                    {tx.type === 'sent' ? 'To' : 'From'}: {tx.type === 'sent' ? tx.to : tx.from}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {format(tx.date, 'h:mm a')}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
