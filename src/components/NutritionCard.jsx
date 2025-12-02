import React from 'react';
import { Apple } from 'lucide-react';

export default function NutritionCard({ consumed = 0, goal = 2200 }) {
    const percentage = Math.min((consumed / goal) * 100, 100);
    const remaining = goal - consumed;
    const isOverGoal = consumed > goal;

    return (
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                        Nutrição
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <div className="text-5xl font-black text-white">
                            {consumed}
                        </div>
                        <div className="text-white/60 text-sm font-bold">
                            de {goal} kcal
                        </div>
                    </div>
                </div>
                <Apple className="w-12 h-12 text-white/20" strokeWidth={2.5} />
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 mb-3 overflow-hidden">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${isOverGoal ? 'bg-red-400' : 'bg-white'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Status Text */}
            <div className="text-sm text-white/90 font-medium">
                {isOverGoal ? (
                    <span>
                        Você excedeu em <span className="font-black">{Math.abs(remaining)} kcal</span>
                    </span>
                ) : remaining === 0 ? (
                    <span className="font-black">🎯 Meta atingida!</span>
                ) : (
                    <span>
                        Faltam <span className="font-black">{remaining} kcal</span> para a meta
                    </span>
                )}
            </div>
        </div>
    );
}
