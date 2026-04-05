import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { getFilteredTransactions } from '../../lib/utils';
import { motion } from 'framer-motion';

import { Calendar } from './Calendar';
import { InsightCards } from './Insights';
import { Transactions } from './Transactions';
import { Invoices } from './Invoices';

export function Overview() {
  const { transactions, selectedDate, selectedMonth, viewMode } = useStore();

  const { totalIncome, totalExpense, balance, chartData } = useMemo(() => {
    let income = 0;
    let expense = 0;

    const dailyMap: Record<string, { income: number, expense: number }> = {};
    const baseTransactions = getFilteredTransactions(transactions, selectedMonth, viewMode);
    const activeTransactions = selectedDate
      ? baseTransactions.filter(t => t.date.startsWith(selectedDate))
      : baseTransactions;

    activeTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });

    baseTransactions.forEach(t => {
      const dateStr = format(parseISO(t.date), 'MMM dd');
      if (!dailyMap[dateStr]) dailyMap[dateStr] = { income: 0, expense: 0 };
      if (t.type === 'income') dailyMap[dateStr].income += t.amount;
      else dailyMap[dateStr].expense += t.amount;
    });

    let currentBalance = 0;
    const sortedDates = Object.keys(dailyMap).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const finalChartData = sortedDates.map(date => {
      const day = dailyMap[date];
      currentBalance += (day.income - day.expense);
      return { date, balance: currentBalance };
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      chartData: finalChartData
    };
  }, [transactions, selectedDate, selectedMonth, viewMode]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-foreground/60">A quick glance at your financial snapshot.</p>
      </div>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* PREMIUM BALANCE CARD */}
        <div className="md:col-span-8">
          <Card className="relative p-8 rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-[0_20px_50px_rgba(59,130,246,0.35)] hover:scale-[1.01] transition-transform duration-300 group">
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />
            
            {/* Top Row */}
            <div className="relative flex justify-between items-start z-10">
              <div>
                <p className="text-xs font-medium opacity-80 tracking-widest uppercase">Total Balance</p>
                <h2 className="text-5xl font-bold mt-3 tracking-tighter">
                  ₹{balance.toLocaleString('en-IN')}
                </h2>
              </div>

              {/* Fake Chip */}
              <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-yellow-200/50 to-yellow-500/30 backdrop-blur-md border border-white/20 shadow-inner" />
            </div>

            {/* Card Number */}
            <div className="relative mt-12 text-xl tracking-[0.25em] font-mono opacity-90 z-10">
              •••• •••• •••• 2048
            </div>

            {/* Bottom Row */}
            <div className="relative flex justify-between items-end mt-10 z-10">
              {/* Income */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold opacity-70 tracking-tight">Monthly Income</p>
                <p className="text-xl font-bold flex items-center gap-1.5 text-green-300">
                  <TrendingUp size={20} /> ₹{totalIncome.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Brand */}
              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-sm font-black italic tracking-tighter opacity-80">FinDash</span>
                <span className="text-[10px] opacity-50 uppercase font-bold">Premium Tier</span>
              </div>

              {/* Expense */}
              <div className="text-right space-y-1">
                <p className="text-[10px] uppercase font-bold opacity-70 tracking-tight">Monthly Expenses</p>
                <p className="text-xl font-bold flex items-center justify-end gap-1.5 text-red-300">
                  <TrendingDown size={20} /> ₹{totalExpense.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CALENDAR */}
        <div className="md:col-span-4 h-full">
          <Calendar />
        </div>
      </div>

      {/* TREND CHART */}
      <Card className="p-6 h-[350px] shadow-sm border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg tracking-tight">Balance Trend</h3>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">Real-time</span>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chartData}>
           <CartesianGrid 
                stroke="rgba(255,255,255,0.08)" 
                strokeDasharray="4 4" 
                />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 12, fill: '#94a3b8'}}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 12, fill: '#94a3b8'}}
              tickFormatter={(val) => `₹${val/1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* MAIN ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Transactions />
        </div>
        <div className="md:col-span-4">
          <InsightCards />
        </div>
      </div>

      {/* INVOICES */}
      <div className="pb-10">
        <Invoices />
      </div>

    </motion.div>
  );
}