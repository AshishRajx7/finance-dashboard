import { useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { format, parseISO } from 'date-fns';
import { Search, ArrowUpDown, Trash2, Edit2, Plus, Download } from 'lucide-react';
import { cn, getFilteredTransactions } from '../../lib/utils';
import type { TransactionType, Transaction } from '../../types';
import { TransactionModal } from './TransactionModal';

export function Transactions() {
    const navigate = useNavigate();
    const { transactions, selectedDate, selectedMonth, viewMode, filters, setFilters, role, deleteTransaction } = useStore();

    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);

    const filteredTransactions = useMemo(() => {
        let result = getFilteredTransactions([...transactions], selectedMonth, viewMode);

        if (selectedDate) {
            result = result.filter(t => t.date.startsWith(selectedDate));
        }

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                t => t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
            );
        }

        if (filters.type !== 'all') {
            result = result.filter(t => t.type === filters.type);
        }

        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [transactions, filters, sortOrder, selectedDate, selectedMonth, viewMode]);

    // Data limited for UI display
    const displayTransactions = useMemo(() => filteredTransactions.slice(0, 10), [filteredTransactions]);

    const exportToCSV = () => {
        const headers = ["Date", "Amount", "Category", "Type"];
        const rows = filteredTransactions.map(t => [
            t.date,
            t.amount,
            t.category,
            t.type
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transactions.csv";
        link.click();
    };

    const exportToJSON = () => {
        const blob = new Blob(
            [JSON.stringify(filteredTransactions, null, 2)],
            { type: "application/json" }
        );
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transactions.json";
        link.click();
    };

    const exportBtnClass = "text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-foreground/70 hover:text-foreground";

    return (
        <Card className="flex flex-col h-full min-h-[600px] overflow-hidden relative">
            
            {/* Header & Controls */}
            <div className="p-5 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight mb-1">Recent Transactions</h2>
                        <p className="text-sm text-foreground/60">{transactions.length} total transactions</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={exportToCSV} className={exportBtnClass}>
                            <Download size={14} /> CSV
                        </button>
                        <button onClick={exportToJSON} className={exportBtnClass}>
                            <Download size={14} /> JSON
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-48">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                        <input
                            type="text"
                            placeholder="Search category..."
                            className="w-full h-9 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                        />
                    </div>
                        <select
                            className="h-9 pl-3 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-foreground"
                            value={filters.type}
                            onChange={(e) => setFilters({ type: e.target.value as TransactionType | 'all' })}
                        >
                            {/* Add 'text-black' or a specific dark color to the options */}
                            <option value="all" className="text-black">All Types</option>
                            <option value="income" className="text-black">Income</option>
                            <option value="expense" className="text-black">Expense</option>
                        </select>

                    {/* Aligned Add Button */}
                    {role === 'admin' && (
                        <button
                            onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
                            className="h-9 px-4 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-all shadow-md shadow-primary/20 whitespace-nowrap ml-auto lg:ml-0"
                        >
                            <Plus size={16} /> <span>Add</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur z-10 text-xs uppercase tracking-wider text-foreground/50 border-b border-border shadow-sm">
                        <tr>
                            <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors group" onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                                <div className="flex items-center gap-2">
                                    Date
                                    <ArrowUpDown className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-semibold">Description</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold text-right">Amount</th>
                            {role === 'admin' && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-sm">
                        {displayTransactions.length > 0 ? (
                            displayTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-foreground/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                                        {format(parseISO(tx.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        {tx.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-foreground/5 text-foreground/80 px-2.5 py-1 rounded-md text-xs font-medium border border-border/50">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className={cn(
                                        "px-6 py-4 text-right font-semibold whitespace-nowrap",
                                        tx.type === 'income' ? 'text-success' : 'text-foreground'
                                    )}>
                                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                    </td>
                                    {role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingTx(tx); setIsModalOpen(true); }}
                                                    className="p-1.5 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteTransaction(tx.id)}
                                                    className="p-1.5 text-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={role === 'admin' ? 5 : 4} className="h-64 text-center">
                                    <p className="text-foreground/40">No transactions found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex justify-between items-center bg-card/50">
                <span className="text-sm text-foreground/50">
                    Showing {displayTransactions.length} of {filteredTransactions.length} transactions
                </span>
                <button
                    onClick={() => navigate("/transactions")}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    View All →
                </button>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTx(null); }}
                editingTransaction={editingTx}
            />
        </Card>
    );
}