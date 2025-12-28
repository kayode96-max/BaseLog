"use client";

import { Transaction } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, X, ExternalLink } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-surface-dark shadow-2xl border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {format(date, "MMMM d, yyyy")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transactions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              onClick={() => onTransactionClick(tx)}
              className="group w-full p-4 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === "sent"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                      : "bg-green-50 dark:bg-green-900/20 text-green-500"
                  }`}
                >
                  {tx.type === "sent" ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {tx.type === "sent" ? "Sent" : "Received"}
                    </span>
                    <span
                      className={`font-mono font-medium ${
                        tx.type === "sent"
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {tx.type === "sent" ? "-" : "+"}
                      {tx.amount} ETH
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-mono truncate max-w-[120px]">
                      {tx.type === "sent" ? `To: ${tx.to}` : `From: ${tx.from}`}
                    </span>
                    <span>{format(tx.date, "h:mm a")}</span>
                  </div>

                  {tx.hasNote && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs font-medium text-gold">
                      <span className="material-symbols-outlined text-[16px]">
                        book
                      </span>
                      Journal Entry Attached
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
