import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Transaction, TransactionType } from '../../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingTransaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, editingTransaction }: ModalProps) {
    const addTransaction = useStore(state => state.addTransaction);
    const updateTransaction = useStore(state => state.updateTransaction);

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<TransactionType>('expense');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (editingTransaction) {
            setDescription(editingTransaction.description);
            setAmount(editingTransaction.amount.toString());
            setCategory(editingTransaction.category);
            setType(editingTransaction.type);
            setDate(editingTransaction.date.split('T')[0]);
        } else {
            setDescription('');
            setAmount('');
            setCategory('');
            setType('expense');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [editingTransaction, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !category || !date) return;

        const txData = {
            description,
            amount: parseFloat(amount),
            category,
            type,
            date: new Date(date).toISOString(),
        };

        if (editingTransaction) {
            updateTransaction(editingTransaction.id, txData);
        } else {
            addTransaction(txData);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                /* NEW WRAPPER: Centering via Flexbox */
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md bg-card border border-border shadow-xl rounded-2xl overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                            <h3 className="font-semibold text-lg">
                                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                            </h3>
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="p-1.5 rounded-lg text-foreground/50 hover:bg-foreground/5 hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4"> {/* Space-y-4 added for internal spacing */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 focus-within:text-primary transition-colors">
                                    <label className="text-sm font-medium text-foreground/70">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as TransactionType)}
                                        className="w-full p-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/70">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        className="w-full p-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground/70">Amount</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-foreground/50 font-medium">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground/70">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    placeholder="E.g., Groceries"
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground/70">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    placeholder="E.g., Food"
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="px-5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-foreground/5 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-sm transition-colors"
                                >
                                    {editingTransaction ? 'Save Changes' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}