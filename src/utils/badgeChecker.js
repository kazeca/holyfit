import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { BADGES, getBadgeById } from '../data/badges';

/**
 * Check and unlock badges based on user activity
 * Returns array of newly unlocked badge IDs
 */
export const checkBadges = async (userId, eventType, eventData = {}) => {
    try {
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) return [];

        const userData = userDoc.data();
        const unlockedBadgeIds = (userData.badges || []).map(b => b.id);
        const newBadges = [];

        switch (eventType) {
            case 'WORKOUT_COMPLETED':
                // First workout
                if (!unlockedBadgeIds.includes('first_workout')) {
                    newBadges.push('first_workout');
                }

                // First photo
                if (!unlockedBadgeIds.includes('first_photo')) {
                    newBadges.push('first_photo');
                }

                // Time-based badges
                const hour = new Date().getHours();
                if (hour < 6 && !unlockedBadgeIds.includes('early_bird')) {
                    newBadges.push('early_bird');
                }
                if (hour >= 22 && !unlockedBadgeIds.includes('night_owl')) {
                    newBadges.push('night_owl');
                }

                // Workout count badges
                const totalWorkouts = (userData.workoutsCompleted || 0) + 1;
                if (totalWorkouts >= 10 && !unlockedBadgeIds.includes('workouts_10')) {
                    newBadges.push('workouts_10');
                }
                if (totalWorkouts >= 50 && !unlockedBadgeIds.includes('workouts_50')) {
                    newBadges.push('workouts_50');
                }
                if (totalWorkouts >= 100 && !unlockedBadgeIds.includes('workouts_100')) {
                    newBadges.push('workouts_100');
                }

                // Calories burned
                const totalCalories = userData.totalCaloriesBurned || 0;
                if (totalCalories >= 10000 && !unlockedBadgeIds.includes('calories_burner')) {
                    newBadges.push('calories_burner');
                }
                break;

            case 'MEAL_REGISTERED':
                // First meal
                if (!unlockedBadgeIds.includes('first_meal')) {
                    newBadges.push('first_meal');
                }

                // Meal count badges
                const totalMeals = (userData.totalMeals || 0) + 1;
                if (totalMeals >= 10 && !unlockedBadgeIds.includes('healthy_eater')) {
                    newBadges.push('healthy_eater');
                }
                if (totalMeals >= 50 && !unlockedBadgeIds.includes('nutrition_tracker')) {
                    newBadges.push('nutrition_tracker');
                }
                break;

            case 'STREAK_UPDATED':
                const streak = eventData.streak || 0;
                if (streak >= 3 && !unlockedBadgeIds.includes('streak_3')) {
                    newBadges.push('streak_3');
                }
                if (streak >= 7 && !unlockedBadgeIds.includes('streak_7')) {
                    newBadges.push('streak_7');
                }
                if (streak >= 14 && !unlockedBadgeIds.includes('streak_14')) {
                    newBadges.push('streak_14');
                }
                if (streak >= 30 && !unlockedBadgeIds.includes('streak_30')) {
                    newBadges.push('streak_30');
                }
                if (streak >= 60 && !unlockedBadgeIds.includes('streak_60')) {
                    newBadges.push('streak_60');
                }
                if (streak >= 100 && !unlockedBadgeIds.includes('streak_100')) {
                    newBadges.push('streak_100');
                }
                if (streak >= 365 && !unlockedBadgeIds.includes('streak_365')) {
                    newBadges.push('streak_365');
                }
                break;

            case 'FREEZE_USED':
                if (!unlockedBadgeIds.includes('freeze_saver')) {
                    newBadges.push('freeze_saver');
                }

                const freezes = userData.streakFreezes || 0;
                if (freezes >= 5 && !unlockedBadgeIds.includes('freeze_collector')) {
                    newBadges.push('freeze_collector');
                }
                break;

            case 'LEVEL_UP':
                const newLevel = eventData.newLevel || 0;
                if (newLevel >= 2 && !unlockedBadgeIds.includes('first_level_up')) {
                    newBadges.push('first_level_up');
                }
                if (newLevel >= 20 && !unlockedBadgeIds.includes('level_20')) {
                    newBadges.push('level_20');
                }
                if (newLevel >= 30 && !unlockedBadgeIds.includes('level_30')) {
                    newBadges.push('level_30');
                }
                break;

            case 'RANKING_UPDATED':
                const position = eventData.position || 999;
                if (position <= 3 && !unlockedBadgeIds.includes('top3')) {
                    newBadges.push('top3');
                }
                if (position === 1 && !unlockedBadgeIds.includes('number1')) {
                    newBadges.push('number1');
                }
                break;
        }

        // Unlock new badges if any
        if (newBadges.length > 0) {
            await unlockBadges(userId, newBadges);
        }

        return newBadges;
    } catch (error) {
        console.error('Error checking badges:', error);
        return [];
    }
};

/**
 * Unlock badges and grant XP bonus
 */
const unlockBadges = async (userId, badgeIds) => {
    try {
        const badgeObjects = badgeIds.map(id => ({
            id,
            unlockedAt: new Date().toISOString(),
            displayOnProfile: true
        }));

        // Calculate total XP bonus
        const totalXP = badgeIds.reduce((sum, id) => {
            const badge = getBadgeById(id);
            return sum + (badge?.xpBonus || 0);
        }, 0);

        // Update user with new badges and XP
        await updateDoc(doc(db, 'users', userId), {
            badges: arrayUnion(...badgeObjects),
            xp: increment(totalXP),
            totalPoints: increment(totalXP)
        });

        return badgeObjects;
    } catch (error) {
        console.error('Error unlocking badges:', error);
        throw error;
    }
};

/**
 * Get user's badge progress
 */
export const getBadgeProgress = (userBadges = []) => {
    const unlockedCount = userBadges.length;
    const totalCount = BADGES.length;
    const percentage = Math.round((unlockedCount / totalCount) * 100);

    return {
        unlocked: unlockedCount,
        total: totalCount,
        percentage
    };
};

/**
 * Get badges by category for display
 */
export const getBadgesForDisplay = (userBadges = [], category = null) => {
    const unlockedIds = userBadges.map(b => b.id);

    let badgesToShow = category
        ? BADGES.filter(b => b.category === category)
        : BADGES;

    return badgesToShow.map(badge => ({
        ...badge,
        unlocked: unlockedIds.includes(badge.id),
        unlockedAt: userBadges.find(b => b.id === badge.id)?.unlockedAt
    }));
};
