import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, PieChart, Settings } from 'lucide-react';

export function Sidebar() {
    // Shared base classes for all links
    const linkBaseClass = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all";
    
    // Function to handle conditional active styling
    const getLinkStyle = ({ isActive }: { isActive: boolean }) => 
        isActive 
            ? `${linkBaseClass} bg-primary/10 text-primary font-semibold` 
            : `${linkBaseClass} text-foreground/70 hover:bg-foreground/5 hover:text-foreground font-medium`;

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border hidden md:flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                    FinDash<span className="text-foreground">.</span>
                </h2>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <NavLink to="/" className={getLinkStyle}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/transactions" className={getLinkStyle}>
                    <Receipt size={20} />
                    <span>Transactions</span>
                </NavLink>

                <NavLink to="/insights" className={getLinkStyle}>
                    <PieChart size={20} />
                    <span>Insights</span>
                </NavLink>

                {/* Added Invoices based on your request */}
                <NavLink to="/invoices" className={getLinkStyle}>
                    <Receipt size={20} /> 
                    <span>Invoices</span>
                </NavLink>
            </nav>

            <div className="p-4 border-t border-border">
                <NavLink to="/settings" className={getLinkStyle}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </div>
        </aside>
    );
}