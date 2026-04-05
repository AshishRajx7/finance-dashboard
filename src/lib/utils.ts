import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Transaction } from "../types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getDailySpending = (transactions: Transaction[]) => {
    return transactions.reduce((acc, txn) => {
        const date = txn.date.split('T')[0];
        if (!acc[date]) acc[date] = 0;
        if (txn.type === "expense") acc[date] += txn.amount;
        return acc;
    }, {} as Record<string, number>);
};

export const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const getMonthlyTotals = (transactions: Transaction[]) => {
    return transactions.reduce((acc, txn) => {
        const month = txn.date.slice(0, 7);
        if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 };
        }
        acc[month][txn.type] += txn.amount;
        return acc;
    }, {} as Record<string, { income: number, expense: number }>);
};

export const getCategoryBreakdown = (transactions: Transaction[]) => {
    return transactions.reduce((acc, txn) => {
        if (txn.type === "expense") {
            acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
        }
        return acc;
    }, {} as Record<string, number>);
};

export const getHeatmapColor = (amount: number) => {
    if (!amount) return "bg-gray-700/50 hover:bg-gray-600 text-white border-transparent";
    if (amount < 800) return "bg-green-500 hover:bg-green-400 hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] text-white border-transparent";
    if (amount < 2000) return "bg-yellow-500 hover:bg-yellow-400 hover:shadow-[0_0_12px_rgba(234,179,8,0.3)] text-white border-transparent";
    return "bg-red-500 hover:bg-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] text-white border-transparent";
};

export const getTopCategory = (transactions: Transaction[]) => {
    const breakdown = getCategoryBreakdown(transactions);
    const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0] : null;
};

export const getMonthComparison = (transactions: Transaction[], selectedMonth: string) => {
    const current = transactions.filter(t => t.date.startsWith(selectedMonth));
    
    const [year, month] = selectedMonth.split('-');
    const prevDate = new Date(parseInt(year), parseInt(month) - 2);
    const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const previous = transactions.filter(t => t.date.startsWith(prevMonthStr));

    const currExpense = current.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const prevExpense = previous.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

    if (prevExpense === 0) return null;
    return ((currExpense - prevExpense) / prevExpense) * 100;
};

export const getFilteredTransactions = (transactions: Transaction[], selectedMonth: string, viewMode: 'month' | 'overall') => {
    if (viewMode === 'overall') return transactions;
    return transactions.filter(t => t.date.startsWith(selectedMonth));
};
