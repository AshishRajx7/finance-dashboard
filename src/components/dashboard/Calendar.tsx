import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { cn, getDailySpending, getHeatmapColor } from '../../lib/utils';

export function Calendar() {
    const transactions = useStore((state) => state.transactions);
    const selectedDateStr = useStore((state) => state.selectedDate);
    const setSelectedDate = useStore((state) => state.setSelectedDate);

    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

    const daysInMonth = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const startDayOfWeek = daysInMonth[0].getDay(); // 0 is Sunday

    const intensityMap = useMemo(() => {
        return getDailySpending(transactions);
    }, [transactions]);


    const handleDateClick = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        setSelectedDate(selectedDateStr === dateStr ? null : dateStr);
    };

    const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

    const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <Card className="p-6 flex flex-col h-full min-h-[380px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon size={20} className="text-primary" />
                    <h3 className="font-semibold text-lg tracking-tight">Activity</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-foreground/5 rounded-md transition-colors"><ChevronLeft size={18} /></button>
                    <span className="text-sm font-medium w-24 text-center">{format(currentMonth, 'MMM yyyy')}</span>
                    <button onClick={nextMonth} className="p-1 hover:bg-foreground/5 rounded-md transition-colors"><ChevronRight size={18} /></button>
                </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-between">
                <div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="text-center text-[10px] uppercase font-semibold text-foreground/40 pb-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square rounded-lg" />
                        ))}
                        
                        {daysInMonth.map((date) => {
                            const dateKey = format(date, 'yyyy-MM-dd');
                            const spent = intensityMap[dateKey] || 0;
                            const isSelected = selectedDateStr === dateKey;
                            const isToday = isSameDay(date, new Date());
                            
                            let cellStyle = getHeatmapColor(spent);

                            if (isSelected) {
                                cellStyle += " ring-2 ring-primary ring-offset-2 ring-offset-card scale-105 font-bold";
                            }

                            return (
                                <button
                                    key={dateKey}
                                    onClick={() => handleDateClick(date)}
                                    className={cn(
                                        "relative group aspect-square flex items-center justify-center rounded-xl border text-[11px] transition-all duration-300",
                                        cellStyle,
                                        !isSelected && "hover:-translate-y-[2px]",
                                        isToday && !isSelected && "ring-1 ring-primary/50 ring-offset-1 ring-offset-card"
                                    )}
                                >
                                    <span className="z-10">{format(date, 'd')}</span>
                                    
                                    {/* Tooltip */}
                                    {spent > 0 && (
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full mb-2 bg-foreground text-background text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
                                            ₹{spent.toLocaleString('en-IN')} spent
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-foreground" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-3 text-[10px] text-foreground/50 pt-4">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-700/50" /> None</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> &lt; ₹500</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500" /> &lt; ₹2K</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> &gt; ₹2K</div>
                </div>
            </div>
        </Card>
    );
}
