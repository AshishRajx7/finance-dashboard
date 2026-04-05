import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { Lightbulb, TrendingDown, ArrowDownRight, ArrowUpRight, Calendar, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTopCategory, getMonthComparison, getFilteredTransactions, cn } from '../../lib/utils';

export function InsightCards() {
    const { transactions, selectedDate, selectedMonth, viewMode } = useStore();

    const insights = useMemo(() => {
        const baseTransactions = getFilteredTransactions(transactions, selectedMonth, viewMode);
        const activeTransactions = selectedDate
            ? baseTransactions.filter(t => t.date.startsWith(selectedDate))
            : baseTransactions;

        if (activeTransactions.length === 0) return { items: [], comparison: null, stats: null };

        const expenses = activeTransactions.filter(t => t.type === 'expense');
        
        // --- NEW LOGIC: Highest Spend Day & Avg Spend ---
        const dailyExpenses = expenses.reduce((acc, t) => {
            acc[t.date] = (acc[t.date] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        const highestDay = Object.entries(dailyExpenses).sort((a, b) => b[1] - a[1])[0];
        
        const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
        
        // Using activeTransactions.length or unique days for average depends on preference
        // Here we follow your logic: totalExpense / total transaction count
        const avgSpend = Math.round(totalExpense / (activeTransactions.length || 1));

        if (expenses.length === 0) return { items: [], comparison: null, stats: { highestDay, avgSpend } };

        const topCat = getTopCategory(activeTransactions);
        let comparison = null;
        if (viewMode === 'month') {
            comparison = getMonthComparison(transactions, selectedMonth);
        }

        const frequency = expenses.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        let mostFrequent = '';
        let maxCount = 0;
        Object.entries(frequency).forEach(([cat, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostFrequent = cat;
            }
        });

        const items = [];
        if (topCat) {
            items.push({
                id: 1,
                title: "Top Expense",
                description: `You spent the most on ${topCat[0]} (₹${topCat[1].toLocaleString('en-IN')}).`,
                icon: <TrendingDown size={20} className="text-destructive" />,
            });
        }
        if (mostFrequent) {
            items.push({
                id: 2,
                title: "Frequent Category",
                description: `${mostFrequent} is your most frequent expense category (${maxCount} times).`,
                icon: <Lightbulb size={20} className="text-primary" />,
            });
        }

        return { items, comparison, stats: { highestDay, avgSpend } };
    }, [transactions, selectedDate, selectedMonth, viewMode]);

    if (transactions.length === 0) {
        return (
            <Card className="p-5 flex flex-col items-center justify-center text-center h-full">
                <Lightbulb size={32} className="text-foreground/30 mb-2" />
                <p className="text-foreground/50 text-sm">Add transactions to see insights.</p>
            </Card>
        );
    }

    return (
        <Card className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg tracking-tight">Smart Insights</h3>
                <Lightbulb size={20} className="text-primary/80" />
            </div>

            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {/* Existing Dynamic Insights */}
                {insights.items.map((insight, i) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl bg-foreground/[0.02] border border-border/50 flex flex-col gap-2.5 transition-colors hover:bg-foreground/[0.04]"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-background rounded-lg shadow-sm border border-border/50">
                                {insight.icon}
                            </div>
                            <span className="font-semibold text-sm">{insight.title}</span>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                            {insight.description}
                        </p>
                    </motion.div>
                ))}

                {/* NEW UI: Highest Spend Day */}
                {insights.stats?.highestDay && (
                   <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-foreground/[0.02] border border-border/50 flex flex-col gap-1 transition-colors hover:bg-foreground/[0.04]"
                    >
                        <div className="flex items-center gap-2 text-primary">
                            <Calendar size={14} />
                            <p className="text-xs font-bold uppercase tracking-wider">Highest Spend Day</p>
                        </div>
                        <p className="text-sm font-semibold">
                            {insights.stats.highestDay[0]} <span className="text-primary">(₹{insights.stats.highestDay[1].toLocaleString('en-IN')})</span>
                        </p>
                    </motion.div>
                )}

                {/* NEW UI: Avg Daily Spend */}
                {insights.stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-foreground/[0.02] border border-border/50 flex flex-col gap-1 transition-colors hover:bg-foreground/[0.04]"
                    >
                        <div className="flex items-center gap-2 text-primary">
                            <Calculator size={14} />
                            <p className="text-xs font-bold uppercase tracking-wider">Avg Daily Spend</p>
                        </div>
                        <p className="text-sm font-bold text-primary">
                            ₹{insights.stats.avgSpend.toLocaleString('en-IN')}
                        </p>
                    </motion.div>
                )}

                {/* Comparison Card */}
                {insights.comparison !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={cn("p-4 rounded-xl border flex flex-col gap-2.5 mt-2",
                            insights.comparison < 0 ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20")}
                    >
                        <div className="flex items-center justify-between">
                            <span className={cn("font-semibold text-xs", insights.comparison < 0 ? "text-success" : "text-destructive")}>Monthly Comparison</span>
                            <div className={cn("p-1 rounded-md", insights.comparison < 0 ? "bg-success/20" : "bg-destructive/20")}>
                                {insights.comparison < 0 ? <ArrowDownRight size={14} className="text-success" /> : <ArrowUpRight size={14} className="text-destructive" />}
                            </div>
                        </div>
                        <p className={cn("text-xs leading-relaxed", insights.comparison < 0 ? "text-success/80" : "text-destructive/80")}>
                            Expenses {insights.comparison < 0 ? "down" : "up"} by <strong>{Math.abs(insights.comparison).toFixed(1)}%</strong>. 
                        </p>
                    </motion.div>
                )}
            </div>
        </Card>
    );
}