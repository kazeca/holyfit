import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BADGES, BADGE_CATEGORIES } from '../data/badges';
import { BadgeSkeleton } from '../components/SkeletonLoaders';

const BadgesPageEnhanced = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        if (!auth.currentUser) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    // Função para calcular progresso atual de cada badge
    const getBadgeCurrentProgress = (badge) => {
        if (!userData) return 0;

        switch (badge.category) {
            case BADGE_CATEGORIES.BEGINNER:
                if (badge.id === 'first_workout') return userData.totalWorkouts || 0;
                if (badge.id === 'first_level_up') return userData.level || 0;
                if (badge.id === 'profile_complete') return (userData.displayName && userData.photoURL) ? 1 : 0;
                return 0;

            case BADGE_CATEGORIES.STREAK:
                return userData.currentStreak || 0;

            case BADGE_CATEGORIES.WORKOUT:
                if (badge.id.includes('workouts_')) return userData.totalWorkouts || 0;
                return 0;

            case BADGE_CATEGORIES.NUTRITION:
                return 0; // TODO: Implementar

            case BADGE_CATEGORIES.SOCIAL:
                return 0; // TODO: Implementar

            case BADGE_CATEGORIES.ELITE:
                if (badge.id.includes('level_')) return userData.level || 0;
                return 0;

            default:
                return 0;
        }
    };

    // Função para obter requirement
    function getRequirementForBadge(badge) {
        if (badge.id === 'first_workout' || badge.id === 'first_meal' || badge.id === 'first_photo') return 1;
        if (badge.id === 'profile_complete') return 1;
        if (badge.id === 'first_level_up') return 2;
        if (badge.id === 'streak_3') return 3;
        if (badge.id === 'streak_7') return 7;
        if (badge.id === 'streak_14') return 14;
        if (badge.id === 'streak_30') return 30;
        if (badge.id === 'streak_60') return 60;
        if (badge.id === 'streak_100') return 100;
        if (badge.id === 'streak_365') return 365;
        if (badge.id === 'workouts_10') return 10;
        if (badge.id === 'workouts_50') return 50;
        if (badge.id === 'workouts_100') return 100;
        if (badge.id === 'level_20') return 20;
        if (badge.id === 'level_30') return 30;
        return 100;
    }

    const allBadges = BADGES.map(badge => ({
        ...badge,
        current: getBadgeCurrentProgress(badge),
        requirement: getRequirementForBadge(badge)
    }));

    const rarityColors = {
        comum: { bg: 'bg-gray-900/20', border: 'border-gray-500', text: 'text-gray-400', glow: 'shadow-gray-500/20' },
        raro: { bg: 'bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/30' },
        épico: { bg: 'bg-purple-900/20', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/30' },
        lendário: { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/40' },
        mítico: { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' }
    };

    const getBadgeProgress = (badge) => Math.min((badge.current / badge.requirement) * 100, 100);
    const isBadgeUnlocked = (badge) => badge.current >= badge.requirement;
    const unlockedBadges = allBadges.filter(isBadgeUnlocked);

    if (loading) {
        return (
            <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter">
                        CONQUISTAS
                    </h1>
                </div>

                {/* Skeleton Loaders */}
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(15)].map((_, i) => (
                        <BadgeSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950 font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white">Badges</h1>
                    <p className="text-slate-400 text-sm">{unlockedBadges.length}/{allBadges.length} desbloqueados</p>
                </div>
            </div>

            {/* Badges Grouped by Category */}
            {Object.entries(BADGE_CATEGORIES).map(([key, categoryName]) => {
                const categoryBadges = allBadges.filter(badge => badge.category === categoryName);
                const unlockedInCategory = categoryBadges.filter(isBadgeUnlocked).length;

                if (categoryBadges.length === 0) return null;

                return (
                    <div key={key} className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black text-white">{categoryName}</h2>
                            <span className="text-sm text-slate-400">{unlockedInCategory}/{categoryBadges.length}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {categoryBadges.map((badge) => {
                                const isUnlocked = isBadgeUnlocked(badge);
                                const progress = getBadgeProgress(badge);
                                const colors = rarityColors[badge.rarity] || rarityColors.comum;

                                return (
                                    <div
                                        key={badge.id}
                                        className={`relative p-4 rounded-2xl border transition-all ${isUnlocked
                                            ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
                                            : 'bg-gray-900/30 border-gray-800 opacity-60'
                                            }`}
                                    >
                                        {/* Badge Icon/Emoji */}
                                        <div className={`text-4xl mb-2 ${!isUnlocked && 'grayscale'}`}>
                                            {badge.emoji}
                                        </div>

                                        {/* Badge Name */}
                                        <h3 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                            {badge.name}
                                        </h3>

                                        {/* Badge Description */}
                                        <p className={`text-xs mb-2 ${isUnlocked ? 'text-slate-400' : 'text-gray-600'}`}>
                                            {badge.description}
                                        </p>

                                        {/* Rarity Badge */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-bold uppercase ${colors.text}`}>
                                                {badge.rarity}
                                            </span>
                                            {badge.xpBonus && (
                                                <span className="text-[10px] text-yellow-500 font-bold">
                                                    +{badge.xpBonus} XP
                                                </span>
                                            )}
                                        </div>

                                        {/* Progress Bar (if locked) */}
                                        {!isUnlocked && (
                                            <div className="space-y-1">
                                                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full ${colors.bg} ${colors.border} border transition-all`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-[10px] text-gray-500 text-center">
                                                    {badge.current}/{badge.requirement}
                                                </p>
                                            </div>
                                        )}

                                        {/* Unlocked Checkmark */}
                                        {isUnlocked && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BadgesPageEnhanced;
