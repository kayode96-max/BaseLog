"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Header } from "@/components/layout/Header";
import { TransactionCalendar } from "@/components/calendar/TransactionCalendar";
import { DayTransactionsList } from "@/components/calendar/DayTransactionsList";
import { JournalModal } from "@/components/journal/JournalModal";
import { useBaseTransactions } from "@/hooks/useBaseTransactions";
import { Transaction } from "@/types";
import { TrendingUp, BookOpen, Calendar, Loader2 } from "lucide-react";
import { LandingPage } from "@/components/landing/LandingPage";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { transactions, isLoading, refetch } = useBaseTransactions();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayTransactions, setDayTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleDateClick = (date: Date, txs: Transaction[]) => {
    setSelectedDate(date);
    setDayTransactions(txs);
  };

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedDate(null);
    setSelectedTransaction(tx);
  };

  const handleJournalSuccess = () => {
    refetch();
  };

  // Calculate stats
  const totalTransactions = transactions.length;
  const transactionsWithNotes = transactions.filter((tx) => tx.hasNote).length;
  const completionRate =
    totalTransactions > 0
      ? Math.round((transactionsWithNotes / totalTransactions) * 100)
      : 0;

  if (!isConnected) {
    return (
      <>
        <Header />
        <LandingPage />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-4 pb-24">
        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Transactions
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalTransactions}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Journal Entries
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {transactionsWithNotes}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gold" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completion Rate
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {completionRate}%
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </section>

        {/* Calendar */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <TransactionCalendar
            transactions={transactions}
            onDateClick={handleDateClick}
          />
        )}

        {/* Recent Activity */}
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-soft overflow-hidden">
            {transactions.slice(0, 5).map((tx) => (
              <button
                key={tx.hash}
                onClick={() => setSelectedTransaction(tx)}
                className="w-full p-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        tx.type === "sent"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-green-50 dark:bg-green-900/20"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          tx.type === "sent" ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {tx.type === "sent"
                          ? "arrow_outward"
                          : "arrow_downward"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {tx.type === "sent" ? "Sent" : "Received"} {tx.amount}{" "}
                        ETH
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {tx.type === "sent" ? tx.to : tx.from}
                      </p>
                    </div>
                  </div>
                  {tx.hasNote && (
                    <span className="material-symbols-outlined text-gold">
                      check_circle
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      {selectedDate && (
        <DayTransactionsList
          date={selectedDate}
          transactions={dayTransactions}
          onTransactionClick={handleTransactionClick}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {selectedTransaction && (
        <JournalModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onSuccess={handleJournalSuccess}
        />
      )}
    </>
  );
}
