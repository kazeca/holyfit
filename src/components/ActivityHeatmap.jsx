import React from 'react';
import { format, subDays, eachDayOfInterval, isSameDay, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ActivityHeatmap = ({ data = [] }) => {
    // Generate last 365 days (or current year)
    const today = new Date();
    const startDate = subDays(today, 364); // Last 365 days

    const dates = eachDayOfInterval({
        start: startDate,
        end: today
    });

    // Helper to get intensity level (0-4)
    const getIntensity = (date) => {
        const activity = data.find(d => isSameDay(new Date(d.date), date));
        if (!activity) return 0;
        // Logic: 1 activity = level 1, 2 = level 2, etc. Cap at 4.
        return Math.min(activity.count, 4);
    };

    const getColor = (level) => {
        switch (level) {
            case 0: return 'bg-gray-200 dark:bg-gray-800';
            case 1: return 'bg-green-200 dark:bg-green-900/40';
            case 2: return 'bg-green-400 dark:bg-green-700';
            case 3: return 'bg-green-500 dark:bg-green-600';
            case 4: return 'bg-green-600 dark:bg-green-500';
            default: return 'bg-gray-200 dark:bg-gray-800';
        }
    };

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[600px]"> {/* Ensure it doesn't squash on mobile */}
                <div className="flex gap-1">
                    {/* We need to group by weeks for the vertical layout usually, 
                        but for simplicity in CSS grid, we can just map all. 
                        However, standard heatmap is 7 rows (days of week) x 52 cols (weeks).
                    */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                        {dates.map((date) => {
                            const intensity = getIntensity(date);
                            return (
                                <div
                                    key={date.toISOString()}
                                    className={`w-3 h-3 rounded-sm ${getColor(intensity)}`}
                                    title={`${format(date, "d 'de' MMMM", { locale: ptBR })}: ${intensity} atividades`}
                                ></div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>Menos</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-800"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500"></div>
                    </div>
                    <span>Mais</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
