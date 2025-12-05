// Utility functions for user ranks/titles (VERSÃO FEMININA)

export const getRankByLevel = (level) => {
    if (level >= 31) return {
        title: 'Imbatível',
        emoji: '🔥',
        color: 'text-red-500',
        gradient: 'from-red-500 to-pink-500',
        bgGradient: 'bg-gradient-to-r from-red-500/20 to-pink-500/20',
        border: 'border-red-500/50'
    };
    if (level >= 21) return {
        title: 'Rainha Fit',
        emoji: '👑',
        color: 'text-yellow-500',
        gradient: 'from-yellow-500 to-orange-500',
        bgGradient: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
        border: 'border-yellow-500/50'
    };
    if (level >= 16) return {
        title: 'Poderosa',
        emoji: '💎',
        color: 'text-cyan-500',
        gradient: 'from-cyan-500 to-blue-500',
        bgGradient: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20',
        border: 'border-cyan-500/50'
    };
    if (level >= 11) return {
        title: 'Inspiradora',
        emoji: '💫',
        color: 'text-purple-500',
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
        border: 'border-purple-500/50'
    };
    if (level >= 6) return {
        title: 'Determinada',
        emoji: '🌷',
        color: 'text-rose-500',
        gradient: 'from-rose-500 to-pink-500',
        bgGradient: 'bg-gradient-to-r from-rose-500/20 to-pink-500/20',
        border: 'border-rose-500/50'
    };
    return {
        title: 'Aprendiz',
        emoji: '🌺',
        color: 'text-pink-500',
        gradient: 'from-pink-500 to-rose-500',
        bgGradient: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20',
        border: 'border-pink-500/50'
    };
};

export const getAllRanks = () => [
    { level: 1, title: 'Aprendiz', emoji: '🌺', color: 'text-pink-500', minLevel: 1, maxLevel: 5 },
    { level: 6, title: 'Determinada', emoji: '🌷', color: 'text-rose-500', minLevel: 6, maxLevel: 10 },
    { level: 11, title: 'Inspiradora', emoji: '💫', color: 'text-purple-500', minLevel: 11, maxLevel: 15 },
    { level: 16, title: 'Poderosa', emoji: '💎', color: 'text-cyan-500', minLevel: 16, maxLevel: 20 },
    { level: 21, title: 'Rainha Fit', emoji: '👑', color: 'text-yellow-500', minLevel: 21, maxLevel: 30 },
    { level: 31, title: 'Imbatível', emoji: '🔥', color: 'text-red-500', minLevel: 31, maxLevel: 999 }
];

export const getNextRank = (currentLevel) => {
    const ranks = getAllRanks();
    return ranks.find(rank => currentLevel < rank.minLevel) || ranks[ranks.length - 1];
};

export const calculateLevel = (totalPoints) => {
    let level = 1;
    let xpForNextLevel = 100;
    let accumulatedXP = 0;

    while (accumulatedXP + xpForNextLevel <= totalPoints) {
        accumulatedXP += xpForNextLevel;
        level++;
        xpForNextLevel = Math.floor(100 * level * Math.pow(1.1, level - 1));
    }

    return level;
};

export default getRankByLevel;
