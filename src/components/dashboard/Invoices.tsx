import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type Invoice = {
  id: number;
  name: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Unpaid';
};

export function Invoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, name: "John Doe Design", amount: 2200, status: "Paid" },
    { id: 2, name: "Anna Smith", amount: 1800, status: "Pending" },
    { id: 3, name: "AWS Cloud", amount: 500, status: "Unpaid" },
  ]);

  const markAsPaid = (id: number) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === id ? { ...inv, status: 'Paid' } : inv
      )
    );
  };

  const settleAll = () => {
    setInvoices(prev =>
      prev.map(inv => ({ ...inv, status: 'Paid' }))
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid':
        return {
          dot: 'bg-green-500',
          track: 'bg-green-500',
          width: '100%',
          text: 'text-green-500'
        };
      case 'Pending':
        return {
          dot: 'bg-yellow-500',
          track: 'bg-yellow-500',
          width: '50%',
          text: 'text-yellow-500'
        };
      case 'Unpaid':
        return {
          dot: 'bg-red-500',
          track: 'bg-red-500',
          width: '10%',
          text: 'text-red-500'
        };
      default:
        return {
          dot: 'bg-gray-400',
          track: 'bg-gray-400',
          width: '0%',
          text: 'text-gray-400'
        };
    }
  };

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg tracking-tight">
            Recent Invoices
          </h3>
          <Receipt size={18} className="text-foreground/40" />
        </div>

        <div className="space-y-4">
          {invoices.map((inv, i) => {
            const style = getStatusStyle(inv.status);

            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-2 p-3 rounded-xl bg-foreground/[0.02] border border-border/50 hover:bg-foreground/[0.04] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate pr-2">
                    {inv.name}
                  </span>
                  <span className="font-bold text-sm">
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${style.text}`}>
                      {inv.status}
                    </span>
                  </div>

                  {/* ACTION */}
                  {inv.status !== 'Paid' && (
                    <button
                      onClick={() => markAsPaid(inv.id)}
                      className="text-xs text-green-400 hover:underline"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-1 bg-foreground/10 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: style.width }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${style.track}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
        <button
          onClick={() => navigate('/invoices')}
          className="text-sm font-medium text-primary hover:underline"
        >
          View All →
        </button>

        <button
          onClick={settleAll}
          className="text-sm font-medium text-green-400 hover:underline"
        >
          Settle All
        </button>
      </div>
    </Card>
  );
}