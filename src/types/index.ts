export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    category: string;
    type: TransactionType;
    description: string;
}

export type Role = 'viewer' | 'admin';

export interface Filters {
    search: string;
    category: string | null;
    type: TransactionType | 'all';
}
