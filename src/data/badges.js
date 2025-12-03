// 50 Badges de conquistas organizados por categoria

export const BADGE_CATEGORIES = {
    BEGINNER: 'Iniciante',
    STREAK: 'Sequência',
    WORKOUT: 'Treino',
    NUTRITION: 'Nutrição',
    SOCIAL: 'Social',
    ELITE: 'Elite'
};

export const RARITY = {
    COMUM: 'comum',
    RARO: 'raro',
    EPICO: 'épico',
    LENDARIO: 'lendário',
    MITICO: 'mítico'
};

export const BADGES = [
    // INICIANTE (5)
    { id: "first_workout", emoji: "🏃", name: "Primeiro Passo", description: "Complete seu primeiro treino", category: BADGE_CATEGORIES.BEGINNER, rarity: RARITY.COMUM, xpBonus: 50 },
    { id: "first_meal", emoji: "🍎", name: "Alimentação Consciente", description: "Registre sua primeira refeição", category: BADGE_CATEGORIES.BEGINNER, rarity: RARITY.COMUM, xpBonus: 50 },
    { id: "first_photo", emoji: "📸", name: "Primeira Prova", description: "Tire sua primeira foto de comprovação", category: BADGE_CATEGORIES.BEGINNER, rarity: RARITY.COMUM, xpBonus: 30 },
    { id: "profile_complete", emoji: "✅", name: "Perfil Completo", description: "Complete todas informações do perfil", category: BADGE_CATEGORIES.BEGINNER, rarity: RARITY.COMUM, xpBonus: 100 },
    { id: "first_level_up", emoji: "⬆️", name: "Evoluindo", description: "Alcance o nível 2", category: BADGE_CATEGORIES.BEGINNER, rarity: RARITY.COMUM, xpBonus: 75 },

    // SEQUÊNCIA (10)
    { id: "streak_3", emoji: "🔥", name: "Aquecendo", description: "3 dias de sequência", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.COMUM, xpBonus: 100 },
    { id: "streak_7", emoji: "💪", name: "Uma Semana Forte", description: "7 dias de sequência", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.RARO, xpBonus: 200 },
    { id: "streak_14", emoji: "💯", name: "Duas Semanas Imparável", description: "14 dias de sequência", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.RARO, xpBonus: 300 },
    { id: "streak_30", emoji: "🏆", name: "Guerreiro dos 30 Dias", description: "30 dias de sequência", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.EPICO, xpBonus: 500 },
    { id: "streak_60", emoji: "🔱", name: "Consistência Absoluta", description: "60 dias de sequência", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.EPICO, xpBonus: 800 },
    { id: "streak_100", emoji: "👑", name: "Centenário", description: "100 dias de sequência", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.LENDARIO, xpBonus: 1500 },
    { id: "streak_365", emoji: "🌟", name: "Lenda Imortal", description: "365 dias de sequência (1 ano!)", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.MITICO, xpBonus: 5000 },
    { id: "freeze_saver", emoji: "🛡️", name: "Protegido", description: "Use um escudo pela primeira vez", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.COMUM, xpBonus: 100 },
    { id: "freeze_collector", emoji: "🛡️", name: "Colecionador de Escudos", description: "Acumule 5 escudos", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.RARO, xpBonus: 250 },
    { id: "comeback_king", emoji: "💫", name: "Rei do Retorno", description: "Retorne após perder sequência de 30+ dias", category: BADGE_CATEGORIES.STREAK, rarity: RARITY.EPICO, xpBonus: 400 },

    // TREINO (15)
    { id: "early_bird", emoji: "🌅", name: "Madrugador", description: "Treine antes das 6h da manhã", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.RARO, xpBonus: 150 },
    { id: "night_owl", emoji: "🌙", name: "Coruja Fitness", description: "Treine depois das 22h", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.RARO, xpBonus: 150 },
    { id: "workouts_10", emoji: "💪", name: "Dedicado", description: "Complete 10 treinos", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.COMUM, xpBonus: 200 },
    { id: "workouts_50", emoji: "🔥", name: "Comprometido", description: "Complete 50 treinos", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.RARO, xpBonus: 500 },
    { id: "workouts_100", emoji: "💯", name: "Centena Épica", description: "Complete 100 treinos", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.EPICO, xpBonus: 1000 },
    { id: "cardio_king", emoji: "🏃‍♂️", name: "Rei do Cardio", description: "Complete 50 treinos de corrida/bike", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.EPICO, xpBonus: 400 },
    { id: "iron_pumper", emoji: "🏋️", name: "Bombado", description: "Complete 100 treinos de musculação", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.LENDARIO, xpBonus: 800 },
    { id: "flexible", emoji: "🧘", name: "Flexível", description: "Complete 20 treinos de yoga/alongamento", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.RARO, xpBonus: 300 },
    { id: "calories_burner", emoji: "🔥", name: "Queimador", description: "Queime 10.000 calorias totais", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.EPICO, xpBonus: 600 },
    { id: "marathon_ready", emoji: "🎽", name: "Pronto para Maratona", description: "Complete treino de 42km", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.LENDARIO, xpBonus: 1500 },
    { id: "daily_double", emoji: "⚡", name: "Dose Dupla", description: "Faça 2 treinos no mesmo dia", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.RARO, xpBonus: 250 },
    { id: "variety_master", emoji: "🎯", name: "Multi-Esportista", description: "Complete treinos de 5 esportes diferentes", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.EPICO, xpBonus: 400 },
    { id: "long_session", emoji: "⏱️", name: "Resistência Extrema", description: "Complete treino de 2h+", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.EPICO, xpBonus: 500 },
    { id: "weekend_warrior", emoji: "🎖️", name: "Guerreiro de Fim de Semana", description: "Treine todos os fins de semana por 1 mês", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.RARO, xpBonus: 350 },
    { id: "consistency_pro", emoji: "📅", name: "Profissional da Consistência", description: "Treine 5x por semana durante 4 semanas", category: BADGE_CATEGORIES.WORKOUT, rarity: RARITY.EPICO, xpBonus: 700 },

    // NUTRIÇÃO (10)
    { id: "healthy_eater", emoji: "🥗", name: "Alimentação Saudável", description: "Registre 10 refeições", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.COMUM, xpBonus: 200 },
    { id: "nutrition_tracker", emoji: "📊", name: "Tracker Nutricional", description: "Registre 50 refeições", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.RARO, xpBonus: 500 },
    { id: "protein_king", emoji: "🍗", name: "Rei da Proteína", description: "Consuma 200g+ proteína num dia", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.RARO, xpBonus: 300 },
    { id: "calorie_deficit", emoji: "📉", name: "Déficit Perfeito", description: "Fique abaixo da meta calórica por 7 dias", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.EPICO, xpBonus: 600 },
    { id: "hydrated_week", emoji: "💧", name: "Hidratado", description: "Bata meta de água por 7 dias seguidos", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.RARO, xpBonus: 250 },
    { id: "meal_prep_master", emoji: "🍱", name: "Mestre do Meal Prep", description: "Registre 5 refeições no mesmo dia", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.RARO, xpBonus: 300 },
    { id: "clean_eater", emoji: "🌿", name: "Alimentação Limpa", description: "Registre apenas alimentos naturais por 7 dias", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.EPICO, xpBonus: 500 },
    { id: "cheat_meal", emoji: "🍕", name: "Recompensa Merecida", description: "Registre um cheat meal após 14 dias de dieta", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.COMUM, xpBonus: 100 },
    { id: "macro_master", emoji: "⚖️", name: "Mestre dos Macros", description: "Acerte macros perfeitos (±5g) por 3 dias", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.LENDARIO, xpBonus: 1000 },
    { id: "nutrition_month", emoji: "📅", name: "Mês Perfeito", description: "Registre todas refeições por 30 dias", category: BADGE_CATEGORIES.NUTRITION, rarity: RARITY.MITICO, xpBonus: 2000 },

    // SOCIAL (5)
    { id: "social_butterfly", emoji: "🦋", name: "Borboleta Social", description: "Comente em 10 posts diferentes", category: BADGE_CATEGORIES.SOCIAL, rarity: RARITY.COMUM, xpBonus: 150 },
    { id: "motivator", emoji: "💬", name: "Motivador", description: "Receba 50 likes em seus posts", category: BADGE_CATEGORIES.SOCIAL, rarity: RARITY.RARO, xpBonus: 300 },
    { id: "influencer", emoji: "⭐", name: "Influenciador", description: "Tenha 10 seguidores", category: BADGE_CATEGORIES.SOCIAL, rarity: RARITY.EPICO, xpBonus: 500 },
    { id: "challenge_accepted", emoji: "💥", name: "Desafio Aceito", description: "Complete 10 desafios diários", category: BADGE_CATEGORIES.SOCIAL, rarity: RARITY.RARO, xpBonus: 400 },
    { id: "community_leader", emoji: "👥", name: "Líder Comunitário", description: "Aj ude 5 iniciantes a completarem primeiro treino", category: BADGE_CATEGORIES.SOCIAL, rarity: RARITY.LENDARIO, xpBonus: 1000 },

    // ELITE (5)
    { id: "top3", emoji: "🥉", name: "Pódio", description: "Chegue ao Top 3 do ranking", category: BADGE_CATEGORIES.ELITE, rarity: RARITY.EPICO, xpBonus: 500 },
    { id: "number1", emoji: "🥇", name: "Campeão", description: "Fique em 1º lugar no ranking", category: BADGE_CATEGORIES.ELITE, rarity: RARITY.LENDARIO, xpBonus: 1500 },
    { id: "level_20", emoji: "💎", name: "Elite Suprema", description: "Alcance o nível 20", category: BADGE_CATEGORIES.ELITE, rarity: RARITY.EPICO, xpBonus: 1000 },
    { id: "level_30", emoji: "👑", name: "Lenda Viva", description: "Alcance o nível 30", category: BADGE_CATEGORIES.ELITE, rarity: RARITY.LENDARIO, xpBonus: 2000 },
    { id: "perfect_month", emoji: "✨", name: "Mês Perfeito", description: "Complete todas metas por 30 dias consecutivos", category: BADGE_CATEGORIES.ELITE, rarity: RARITY.MITICO, xpBonus: 5000 }
];

/**
 * Get badge by ID
 */
export const getBadgeById = (id) => {
    return BADGES.find(b => b.id === id);
};

/**
 * Get badges by category
 */
export const getBadgesByCategory = (category) => {
    return BADGES.filter(b => b.category === category);
};

/**
 * Get badges by rarity
 */
export const getBadgesByRarity = (rarity) => {
    return BADGES.filter(b => b.rarity === rarity);
};

/**
 * Get rarity color
 */
export const getRarityColor = (rarity) => {
    const colors = {
        [RARITY.COMUM]: '#9CA3AF',
        [RARITY.RARO]: '#3B82F6',
        [RARITY.EPICO]: '#A855F7',
        [RARITY.LENDARIO]: '#EAB308',
        [RARITY.MITICO]: '#EC4899'
    };
    return colors[rarity] || colors[RARITY.COMUM];
};

/**
 * Get rarity gradient
 */
export const getRarityGradient = (rarity) => {
    const gradients = {
        [RARITY.COMUM]: 'from-gray-500 to-gray-700',
        [RARITY.RARO]: 'from-blue-500 to-blue-700',
        [RARITY.EPICO]: 'from-purple-500 to-fuchsia-600',
        [RARITY.LENDARIO]: 'from-yellow-500 to-amber-600',
        [RARITY.MITICO]: 'from-pink-500 via-purple-500 to-cyan-500'
    };
    return gradients[rarity] || gradients[RARITY.COMUM];
};
