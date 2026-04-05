import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Role, Filters } from '../types';

interface DashboardState {
    transactions: Transaction[];
    role: Role;
    filters: Filters;
    theme: 'light' | 'dark';
    selectedDate: string | null;
    viewMode: 'month' | 'overall';
    selectedMonth: string;
    user: { name: string; email: string };

    // Actions
    addTransaction: (tx: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, tx: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    setRole: (role: Role) => void;
    setFilters: (filters: Partial<Filters>) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setSelectedDate: (date: string | null) => void;
    clearSelectedDate: () => void;
    setViewMode: (mode: 'month' | 'overall') => void;
    setSelectedMonth: (month: string) => void;
}

const initialTransactions: Transaction[] = [
    // ===== MARCH =====
    { id: '1', date: "2026-03-01T10:00:00Z", amount: 50000, category: "Salary", type: "income", description: 'Salary deposit' },
    { id: '2', date: "2026-03-02T12:00:00Z", amount: 450, category: "Food", type: "expense", description: 'Groceries' },
    { id: '3', date: "2026-03-03T18:00:00Z", amount: 800, category: "Shopping", type: "expense", description: 'Online shopping' },
    { id: '4', date: "2026-03-05T09:00:00Z", amount: 3000, category: "Bills", type: "expense", description: 'Utilities' },
    { id: '5', date: "2026-03-06T13:00:00Z", amount: 1200, category: "Food", type: "expense", description: 'Restaurant' },
    { id: '6', date: "2026-03-07T15:00:00Z", amount: 2800, category: "Travel", type: "expense", description: 'Weekend trip' },
    { id: '7', date: "2026-03-08T20:00:00Z", amount: 2200, category: "Entertainment", type: "expense", description: 'Concert tickets' },
  
    { id: '8', date: "2026-03-10T12:00:00Z", amount: 600, category: "Food", type: "expense", description: 'Lunch' },
    { id: '9', date: "2026-03-12T17:00:00Z", amount: 1500, category: "Shopping", type: "expense", description: 'Shoes' },
    { id: '10', date: "2026-03-14T08:00:00Z", amount: 3200, category: "Travel", type: "expense", description: 'Flight booking' },
    { id: '11', date: "2026-03-15T19:00:00Z", amount: 2500, category: "Entertainment", type: "expense", description: 'Amusement park' },
  
    { id: '12', date: "2026-03-18T13:00:00Z", amount: 700, category: "Food", type: "expense", description: 'Dinner out' },
    { id: '13', date: "2026-03-20T16:00:00Z", amount: 1800, category: "Shopping", type: "expense", description: 'Clothes' },
    { id: '14', date: "2026-03-22T10:00:00Z", amount: 2700, category: "Travel", type: "expense", description: 'Hotel stay' },
    { id: '15', date: "2026-03-23T20:00:00Z", amount: 2100, category: "Entertainment", type: "expense", description: 'Movie night' },
  
    { id: '16', date: "2026-03-25T12:00:00Z", amount: 650, category: "Food", type: "expense", description: 'Groceries' },
    { id: '17', date: "2026-03-27T18:00:00Z", amount: 2000, category: "Shopping", type: "expense", description: 'Electronics' },
    { id: '18', date: "2026-03-29T14:00:00Z", amount: 3000, category: "Travel", type: "expense", description: 'Road trip' },
    { id: '36', date: "2026-03-30T14:00:00Z", amount: 500, category: "Food", type: "expense", description: 'Lunch' },
    { id: '37', date: "2026-03-31T18:00:00Z", amount: 700, category: "Food", type: "expense", description: 'Dinner' },
  
    // ===== APRIL =====
    { id: '19', date: "2026-04-01T10:00:00Z", amount: 52000, category: "Salary", type: "income", description: 'Salary deposit' },
  
    { id: '20', date: "2026-04-02T13:00:00Z", amount: 500, category: "Food", type: "expense", description: 'Lunch' },
    { id: '21', date: "2026-04-03T16:00:00Z", amount: 900, category: "Shopping", type: "expense", description: 'Accessories' },
    { id: '22', date: "2026-04-05T09:00:00Z", amount: 2800, category: "Bills", type: "expense", description: 'Utilities' },
    { id: '38', date: "2026-04-05T12:00:00Z", amount: 300, category: "Food", type: "expense", description: 'Lunch' },
    { id: '39', date: "2026-04-05T15:00:00Z", amount: 1200, category: "Shopping", type: "expense", description: 'Clothes' },
    { id: '40', date: "2026-04-05T19:00:00Z", amount: 1500, category: "Bills", type: "expense", description: 'Internet' },
    { id: '23', date: "2026-04-06T12:00:00Z", amount: 1000, category: "Food", type: "expense", description: 'Groceries' },
    { id: '24', date: "2026-04-07T15:00:00Z", amount: 2200, category: "Travel", type: "expense", description: 'Train tickets' },
    { id: '25', date: "2026-04-08T19:00:00Z", amount: 1800, category: "Entertainment", type: "expense", description: 'Theatre' },
  
    { id: '26', date: "2026-04-10T12:00:00Z", amount: 550, category: "Food", type: "expense", description: 'Cafe' },
    { id: '27', date: "2026-04-12T17:00:00Z", amount: 1300, category: "Shopping", type: "expense", description: 'Books' },
    { id: '28', date: "2026-04-14T10:00:00Z", amount: 2600, category: "Travel", type: "expense", description: 'Bus trip' },
    { id: '29', date: "2026-04-15T21:00:00Z", amount: 2000, category: "Entertainment", type: "expense", description: 'Events' },
  
    { id: '30', date: "2026-04-18T13:00:00Z", amount: 650, category: "Food", type: "expense", description: 'Dinner' },
    { id: '31', date: "2026-04-20T16:00:00Z", amount: 1500, category: "Shopping", type: "expense", description: 'Clothes' },
    { id: '32', date: "2026-04-22T08:00:00Z", amount: 2400, category: "Travel", type: "expense", description: 'Weekend transit' },
  
    { id: '33', date: "2026-04-25T12:00:00Z", amount: 600, category: "Food", type: "expense", description: 'Snacks' },
    { id: '34', date: "2026-04-27T17:00:00Z", amount: 1700, category: "Shopping", type: "expense", description: 'Gifts' },
    { id: '35', date: "2026-04-29T14:00:00Z", amount: 2600, category: "Travel", type: "expense", description: 'Holiday' },
];

export const useStore = create<DashboardState>()(
    persist(
        (set) => ({
            transactions: initialTransactions,
            role: 'admin',
            filters: { search: '', category: null, type: 'all' },
            theme: 'dark',
            selectedDate: null,
            viewMode: 'month',
            selectedMonth: '2026-04',
            user: { name: "Ashish Raj", email: "ashish@email.com" },

            addTransaction: (tx) =>
                set((state) => ({
                    transactions: [
                        ...state.transactions,
                        { ...tx, id: crypto.randomUUID() },
                    ],
                })),

            updateTransaction: (id, updatedTx) =>
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? { ...t, ...updatedTx } : t
                    ),
                })),

            deleteTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                })),

            setRole: (role) => set({ role }),

            setFilters: (updates) =>
                set((state) => ({ filters: { ...state.filters, ...updates } })),

            setTheme: (theme) => set({ theme }),

            setSelectedDate: (date) => set({ selectedDate: date }),
            clearSelectedDate: () => set({ selectedDate: null }),
            setViewMode: (mode) => set({ viewMode: mode }),
            setSelectedMonth: (month) => set({ selectedMonth: month }),
        }),
        {
            name: 'zorvyn-dashboard-v4',
        }
    )
);
