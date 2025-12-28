'use client';

import { useState } from 'react';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { useJournalEntry } from '@/hooks/useJournalEntry';

interface JournalModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Income', 'Gift', 'Other'];

export function JournalModal({ transaction, onClose, onSuccess }: JournalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const { saveJournalEntry, isUploading, isPending, isConfirming, isSuccess, error, currentStep } =
    useJournalEntry();

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      await saveJournalEntry({
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory || undefined,
        tags,
        timestamp: Date.now(),
        txHash: transaction.hash,
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to,
      });

      // Success! Close modal after a brief delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to save journal entry:', err);
    }
  };

  const isSaving = isUploading || isPending || isConfirming;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-[420px] bg-white dark:bg-[#1a202c] rounded-2xl shadow-soft flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 relative bg-white dark:bg-[#1a202c]">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="flex items-start gap-4 pr-6">
            {/* Status Indicator Icon */}
            <div className="relative shrink-0 mt-1">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'sent'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'bg-green-50 dark:bg-green-900/20'
                }`}
              >
                {transaction.type === 'sent' ? (
                  <ArrowUpRight className="w-5 h-5 text-red-500" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[#1a202c] ${
                  transaction.type === 'sent' ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <p className="text-gray-900 dark:text-white text-[15px] font-semibold leading-snug">
                {transaction.type === 'sent' ? 'Sent' : 'Received'} {transaction.amount} ETH{' '}
                {transaction.type === 'sent' ? 'to' : 'from'}{' '}
                <span className="font-mono text-gray-500 dark:text-gray-400 font-medium">
                  {transaction.type === 'sent'
                    ? `${transaction.to.slice(0, 6)}...${transaction.to.slice(-4)}`
                    : `${transaction.from.slice(0, 6)}...${transaction.from.slice(-4)}`}
                </span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1">
                {format(transaction.date, 'MMM dd, yyyy • h:mm a')}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col px-6 py-6 gap-6 bg-white dark:bg-[#1a202c]">
          {/* Title Input */}
          <div className="w-full">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 border-none p-0 focus:ring-0 bg-transparent"
              placeholder="What was this for?"
              disabled={isSaving}
            />
          </div>

          {/* Category Chips */}
          <div className="w-full overflow-x-auto hide-scrollbar -mx-6 px-6">
            <div className="flex gap-2 min-w-max pb-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category ? null : category)
                  }
                  disabled={isSaving}
                  className={`h-8 px-4 rounded-full border transition-colors flex items-center text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="w-full">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 resize-none"
              placeholder="Add any notes or context..."
              disabled={isSaving}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                check_circle
              </span>
              <p className="text-sm text-green-600 dark:text-green-400">
                Journal entry saved successfully!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="w-full h-12 bg-primary hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {currentStep === 'uploading' && 'Uploading to IPFS...'}
                {currentStep === 'signing' && 'Waiting for signature...'}
                {currentStep === 'confirming' && 'Confirming on Base...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save to Blockchain
              </>
            )}
          </button>
          
          {/* Progress Indicator */}
          {isSaving && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${currentStep === 'uploading' ? 'bg-primary animate-pulse' : currentStep !== 'idle' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === 'signing' ? 'bg-primary animate-pulse' : currentStep === 'confirming' || currentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === 'confirming' ? 'bg-primary animate-pulse' : currentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Your note will be permanently stored on IPFS and linked on Base
          </p>
        </div>
      </div>
    </div>
  );
}
