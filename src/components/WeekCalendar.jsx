import React, { useEffect, useRef } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WeekCalendar = ({ selectedDate, onSelectDate }) => {
    const scrollRef = useRef(null);
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 0 }); // Sunday start

    // Generate 2 weeks of dates (current week + next week)
    const dates = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));

    useEffect(() => {
        // Scroll to selected date on mount
        if (scrollRef.current) {
            const selectedIndex = dates.findIndex(date => isSameDay(date, selectedDate));
            if (selectedIndex !== -1) {
                const itemWidth = 60; // Approximate width of each item
                scrollRef.current.scrollLeft = (selectedIndex * itemWidth) - (scrollRef.current.clientWidth / 2) + (itemWidth / 2);
            }
        }
    }, []);

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-4" ref={scrollRef}>
            <div className="flex gap-3 px-4 min-w-max">
                {dates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);

                    return (
                        <button
                            key={date.toString()}
                            onClick={() => onSelectDate(date)}
                            className={`
                                flex flex-col items-center justify-center w-14 h-20 rounded-[1.5rem] transition-all duration-300
                                ${isSelected
                                    ? 'bg-neon-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110 z-10'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }
                                ${isToday && !isSelected ? 'border border-neon-purple/50 text-neon-purple' : ''}
                            `}
                        >
                            <span className="text-xs font-medium mb-1 capitalize">
                                {format(date, 'EEE', { locale: ptBR }).replace('.', '')}
                            </span>
                            <span className={`text-xl font-black ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                {format(date, 'd')}
                            </span>
                            {isToday && (
                                <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-neon-purple'}`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekCalendar;
