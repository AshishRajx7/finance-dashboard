import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn("bg-white/5 backdrop-blur-xl text-card-foreground rounded-2xl border border-white/10 shadow-lg hover:-translate-y-1 transition-all duration-300", className)}>
            {children}
        </div>
    );
}
