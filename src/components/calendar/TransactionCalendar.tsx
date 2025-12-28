'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { Transaction } from '@/types';
import { Check, Circle } from 'lucide-react';

interface TransactionCalendarProps {
  transactions: Transaction[];
  onDateClick: (date: Date, dayTransactions: Transaction[]) => void;
}

export function TransactionCalendar({ transactions, onDateClick }: TransactionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = monthStart.getDay();

  // Organize transactions by date
  const transactionsByDate = new Map<string, Transaction[]>();
  transactions.forEach((tx) => {
    const dateKey = format(tx.date, 'yyyy-MM-dd');
    if (!transactionsByDate.has(dateKey)) {
      transactionsByDate.set(dateKey, []);
    }
    transactionsByDate.get(dateKey)!.push(tx);
  });

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderDay = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTransactions = transactionsByDate.get(dateKey) || [];
    const hasTransactions = dayTransactions.length > 0;
    const hasNotes = dayTransactions.some((tx) => tx.hasNote);

    return (
      <button
        key={dateKey}
        onClick={() => hasTransactions && onDateClick(day, dayTransactions)}
        className={`
          aspect-square p-2 rounded-lg relative
          transition-all duration-200
          ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}
          ${hasTransactions ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' : 'cursor-default'}
          ${isSameDay(day, new Date()) ? 'ring-2 ring-primary' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className={`text-sm font-medium ${
            isSameDay(day, new Date()) ? 'text-primary font-bold' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {format(day, 'd')}
          </span>
          
          {/* Transaction indicator */}
          {hasTransactions && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
              {hasNotes ? (
                <Check className="w-4 h-4 text-gold" strokeWidth={3} />
              ) : (
                <Circle className="w-2 h-2 text-gray-400 fill-gray-400" />
              )}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-soft p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
              chevron_left
            </span>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Actual days */}
        {daysInMonth.map(renderDay)}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <Circle className="w-2 h-2 text-gray-400 fill-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Has transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-gold" strokeWidth={3} />
          <span className="text-gray-600 dark:text-gray-400">Has notes</span>
        </div>
      </div>
    </div>
  );
}
