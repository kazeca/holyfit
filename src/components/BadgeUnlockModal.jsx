import React from 'react';
import { X } from 'lucide-react';
import { getBadgeById, getRarityGradient } from '../data/badges';
import confetti from 'canvas-confetti';

export default function BadgeUnlockModal({ badgeId, onClose }) {
    const badge = getBadgeById(badgeId);

    if (!badge) return null;

    // Trigger confetti on mount
    React.useEffect(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 2,
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1']
            });
        }, 30);

        // Auto-close after 4 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className={`bg-gradient-to-br ${getRarityGradient(badge.rarity)} rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in duration-500 shadow-2xl`}>

                {/* Sparkles */}
                <div className="text-6xl mb-4 animate-bounce">
                    ✨ ✨ ✨
                </div>

                {/* Badge Icon */}
                <div className="text-9xl mb-4 animate-pulse">
                    {badge.emoji}
                </div>

                {/* Title */}
                <h2 className="text-3xl font-black text-white mb-2">
                    BADGE DESBLOQUEADO!
                </h2>

                {/* Badge Name */}
                <div className="bg-black/30 rounded-xl p-4 mb-4">
                    <div className="text-2xl font-black text-white mb-1">
                        {badge.name}
                    </div>
                    <div className="text-sm text-white/80">
                        {badge.description}
                    </div>
                </div>

                {/* XP Bonus */}
                <div className="bg-white/20 rounded-xl p-3 mb-4">
                    <div className="text-4xl font-black text-white">
                        +{badge.xpBonus} XP 🎉
                    </div>
                </div>

                {/* Rarity */}
                <div className="text-sm text-white/90 uppercase tracking-wider font-bold mb-4">
                    {badge.rarity}
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold transition-colors"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}
