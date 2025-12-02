import React from 'react';
import { Flame } from 'lucide-react';

export default function StreakWidget({ streak = 0, freezes = 0 }) {
    const daysUntilNextFreeze = streak % 7 === 0 ? 7 : 7 - (streak % 7);
    const hasReachedMilestone = streak > 0 && streak % 7 === 0;

    return (
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            {/* Background flame pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 text-9xl">🔥</div>
                <div className="absolute bottom-0 left-0 text-9xl">🔥</div>
            </div>

            <div className="relative">
                {/* Header with shields */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                            Sequência Atual
                        </div>
                    </div>
                    {freezes > 0 && (
                        <div className="flex items-center gap-1">
                            {Array(freezes).fill(null).map((_, i) => (
                                <span key={i} className="text-2xl">🛡️</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Big streak number */}
                <div className="flex items-baseline gap-3 mb-2">
                    <div className="text-6xl font-black text-white">
                        {streak}
                    </div>
                    <Flame className="text-white animate-pulse" size={40} fill="currentColor" />
                </div>

                <div className="text-white/80 text-sm font-medium mb-4">
                    dias consecutivos
                </div>

                {/* Progress to next freeze */}
                {streak < 999 && (
                    <>
                        <div className="w-full bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-500"
                                style={{ width: `${((streak % 7) / 7) * 100}%` }}
                            />
                        </div>

                        <div className="text-sm text-white/90 font-medium">
                            {hasReachedMilestone ? (
                                <span className="font-black">
                                    🎉 Parabéns! Você ganhou um escudo!
                                </span>
                            ) : (
                                <span>
                                    Faltam <span className="font-black">{daysUntilNextFreeze} dias</span> para ganhar um escudo
                                </span>
                            )}
                        </div>
                    </>
                )}

                {/* No freezes warning */}
                {freezes === 0 && streak > 0 && (
                    <div className="mt-4 bg-black/20 border border-white/20 rounded-xl p-3">
                        <p className="text-xs text-white/80">
                            ⚠️ Você não tem escudos! Continue sua sequência para ganhar proteção.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
