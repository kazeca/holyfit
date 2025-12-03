// Títulos evolutivos baseados no nível do usuário

export const TITLES = [
    {
        id: 1,
        emoji: "🔰",
        name: "Iniciante",
        minLevel: 1,
        maxLevel: 5,
        color: "#9CA3AF",
        gradient: "from-gray-400 to-gray-600",
        description: "Seus primeiros passos na jornada fitness"
    },
    {
        id: 2,
        emoji: "⚔️",
        name: "Guerreiro",
        minLevel: 6,
        maxLevel: 10,
        color: "#3B82F6",
        gradient: "from-blue-500 to-blue-700",
        description: "Demonstrando força e determinação"
    },
    {
        id: 3,
        emoji: "🔥",
        name: "Veterano",
        minLevel: 11,
        maxLevel: 15,
        color: "#F97316",
        gradient: "from-orange-500 to-red-600",
        description: "Experiência que faz a diferença"
    },
    {
        id: 4,
        emoji: "💎",
        name: "Elite",
        minLevel: 16,
        maxLevel: 20,
        color: "#A855F7",
        gradient: "from-purple-500 to-fuchsia-600",
        description: "Entre os melhores do Holy Fit"
    },
    {
        id: 5,
        emoji: "👑",
        name: "Lenda",
        minLevel: 21,
        maxLevel: 30,
        color: "#EAB308",
        gradient: "from-yellow-500 to-amber-600",
        description: "Inspiração para toda a comunidade"
    },
    {
        id: 6,
        emoji: "🌟",
        name: "Divino",
        minLevel: 31,
        maxLevel: 999,
        color: "#06B6D4",
        gradient: "from-cyan-400 via-purple-500 to-pink-500",
        description: "Atingiu a perfeição absoluta"
    }
];

/**
 * Get title for a specific level
 */
export const getTitleForLevel = (level) => {
    return TITLES.find(t => level >= t.minLevel && level <= t.maxLevel) || TITLES[0];
};

/**
 * Get formatted title string with emoji
 */
export const getFormattedTitle = (level) => {
    const title = getTitleForLevel(level);
    return `${title.emoji} ${title.name}`;
};

/**
 * Check if user unlocked a new title
 */
export const checkNewTitle = (previousLevel, newLevel) => {
    const previousTitle = getTitleForLevel(previousLevel);
    const newTitle = getTitleForLevel(newLevel);

    return previousTitle.id !== newTitle.id ? newTitle : null;
};
