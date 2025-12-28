'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Transaction } from '@/types';
import { Check, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface TransactionCalendarProps {
  transactions: Transaction[];
  onDateClick: (date: Date, dayTransactions: Transaction[]) => void;
}

export function TransactionCalendar({ transactions, onDateClick }: TransactionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Organize transactions by date
  const transactionsByDate = new Map<string, Transaction[]>();
  transactions.forEach((tx) => {
    const dateKey = format(tx.date, 'yyyy-MM-dd');
    if (!transactionsByDate.has(dateKey)) {
      transactionsByDate.set(dateKey, []);
    }
    transactionsByDate.get(dateKey)!.push(tx);
  });

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={handlePreviousMonth}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all shadow-sm hover:shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all shadow-sm hover:shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleToday}
          className="px-3 py-1.5 text-sm font-medium text-primary bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2"
        >
          <CalendarIcon className="w-4 h-4" />
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 dark:text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTransactions = transactionsByDate.get(dateKey) || [];
            const hasTransactions = dayTransactions.length > 0;
            const hasNotes = dayTransactions.some((tx) => tx.hasNote);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={dateKey}
                onClick={() => hasTransactions && onDateClick(day, dayTransactions)}
                disabled={!hasTransactions}
                className={`
                  aspect-square rounded-xl relative group transition-all duration-200
                  flex flex-col items-center justify-start pt-3
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${hasTransactions 
                    ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer hover:scale-[1.02] hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700' 
                    : 'cursor-default opacity-50'}
                  ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-primary/30' : ''}
                `}
              >
                <span className={`
                  text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1
                  ${isToday ? 'bg-primary text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}
                `}>
                  {format(day, 'd')}
                </span>
                
                {/* Transaction Indicators */}
                {hasTransactions && (
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="flex items-center gap-0.5">
                      {/* Dots for transaction volume (max 3) */}
                      {Array.from({ length: Math.min(dayTransactions.length, 3) }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1 h-1 rounded-full ${
                            dayTransactions[i]?.type === 'sent' ? 'bg-red-400' : 'bg-green-400'
                          }`} 
                        />
                      ))}
                      {dayTransactions.length > 3 && (
                        <span className="text-[8px] text-gray-400 leading-none">+</span>
                      )}
                    </div>
                    
                    {hasNotes && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-3 h-3 text-gold" strokeWidth={4} />
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
