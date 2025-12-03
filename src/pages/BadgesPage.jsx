import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, Award } from 'lucide-react';
import { BADGES, BADGE_CATEGORIES, getRarityGradient } from '../data/badges';
import { getBadgeProgress, getBadgesForDisplay } from '../utils/badgeChecker';

export default function BadgesPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/login');
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, 'users', auth.currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    setUserData(doc.data());
                }
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white text-xl">Carregando...</div>
            </div>
        );
    }

    const userBadges = userData?.badges || [];
    const progress = getBadgeProgress(userBadges);
    const badgesToDisplay = getBadgesForDisplay(
        userBadges,
        selectedCategory
    );

    return (
        <div className="min-h-screen bg-gray-950 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-6">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-white flex items-center gap-2">
                            <Award size={32} className="text-yellow-400" />
                            Minhas Conquistas
                        </h1>
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold">
                            Progresso: {progress.unlocked}/{progress.total}
                        </span>
                        <span className="text-yellow-400 font-bold">
                            {progress.percentage}%
                        </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-yellow-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Category Filter */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === null
                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            Todos ({BADGES.length})
                        </button>
                        {Object.values(BADGE_CATEGORIES).map((category) => {
                            const count = BADGES.filter(b => b.category === category).length;
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === category
                                            ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {category} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {badgesToDisplay.map((badge) => {
                        const isUnlocked = badge.unlocked;

                        return (
                            <div
                                key={badge.id}
                                className={`relative rounded-2xl p-4 text-center transition-all ${isUnlocked
                                        ? `bg-gradient-to-br ${getRarityGradient(badge.rarity)} shadow-lg hover:scale-105`
                                        : 'bg-white/5 opacity-40 grayscale'
                                    }`}
                            >
                                {/* Badge Icon */}
                                <div className={`text-5xl mb-2 ${isUnlocked ? 'animate-bounce' : ''}`}>
                                    {badge.emoji}
                                </div>

                                {/* Badge Name */}
                                <div className="font-bold text-white text-xs mb-1 line-clamp-2">
                                    {badge.name}
                                </div>

                                {/* XP Bonus (if unlocked) */}
                                {isUnlocked && (
                                    <div className="text-xs text-yellow-300 font-bold">
                                        +{badge.xpBonus} XP
                                    </div>
                                )}

                                {/* Lock Icon (if not unlocked) */}
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-4xl opacity-50">🔒</div>
                                    </div>
                                )}

                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap z-20 shadow-xl">
                                    {badge.description}
                                    {isUnlocked && badge.unlockedAt && (
                                        <div className="text-gray-400 mt-1">
                                            {new Date(badge.unlockedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {badgesToDisplay.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏆</div>
                        <div className="text-gray-400">
                            Nenhum badge nesta categoria ainda
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
