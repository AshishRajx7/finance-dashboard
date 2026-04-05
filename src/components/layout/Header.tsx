import { Moon, Sun, Shield, Menu, Settings, LogOut, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

export function Header() {
    const { role, setRole, theme, setTheme, selectedDate, clearSelectedDate, viewMode, setViewMode, user } = useStore();
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
            <div className="flex items-center md:hidden gap-3">
                <button className="p-2 -ml-2 text-foreground/70 hover:bg-foreground/5 rounded-lg">
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-extrabold text-primary">FinDash.</h2>
            </div>

            <div className="hidden md:flex items-center gap-4 ml-8 mr-auto">
                <div className="flex items-center bg-background/50 p-1 rounded-lg border border-border shadow-sm">
                    <button
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'month' ? 'bg-card shadow text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setViewMode('overall')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'overall' ? 'bg-card shadow text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                        Overall
                    </button>
                </div>
                {selectedDate && (
                    <div className="flex items-center gap-2 text-sm font-medium border-l border-border pl-4">
                        <button
                            onClick={clearSelectedDate}
                            className="text-foreground/60 hover:text-foreground transition-colors"
                        >
                            Clear Date
                        </button>
                        <span className="text-foreground/30">/</span>
                        <span className="text-primary">{format(parseISO(selectedDate), 'MMM d, yyyy')}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Role Switcher */}
                <div className="flex items-center bg-background p-1 rounded-lg border border-border shadow-sm">
                    <button
                        onClick={() => setRole('viewer')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'viewer' ? 'bg-card shadow text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                        Viewer
                    </button>
                    <button
                        onClick={() => setRole('admin')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${role === 'admin' ? 'bg-primary text-primary-foreground shadow' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                        <Shield size={14} /> Admin
                    </button>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-2 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Account Settings */}
                <button
                    onClick={() => setIsAccountOpen(true)}
                    className="p-2 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Account Panel Modal */}
            {isAccountOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
                    <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Account Panel</h2>
                            <button onClick={() => setIsAccountOpen(false)} className="text-foreground/50 hover:text-foreground">✕</button>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-foreground/5 border border-border/50">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-foreground/60">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors text-sm font-medium"
                            >
                                <div className="flex items-center gap-3">
                                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                </div>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm font-medium">
                                <div className="flex items-center gap-3">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
