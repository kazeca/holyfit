import { db } from '../firebase';
import { doc, updateDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';

const MAX_FREEZES = 5;
const DAYS_FOR_FREEZE = 7;

/**
 * Get date string in YYYY-MM-DD format
 */
const getDateString = (date = new Date()) => {
    return date.toISOString().split('T')[0];
};

/**
 * Get yesterday's date string
 */
const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getDateString(yesterday);
};

/**
 * Calculate days between two date strings
 */
const daysBetween = (date1String, date2String) => {
    const d1 = new Date(date1String);
    const d2 = new Date(date2String);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * Increment user's streak by 1
 */
export const incrementStreak = async (userId, userData) => {
    const newStreak = (userData.streak || 0) + 1;
    const today = getDateString();

    const updates = {
        streak: newStreak,
        lastActivityDate: today,
        streakHistory: arrayUnion({
            date: today,
            activity: 'streak_increment',
            streak: newStreak
        })
    };

    // Grant freeze shield every 7 days
    if (newStreak % DAYS_FOR_FREEZE === 0) {
        const currentFreezes = userData.streakFreezes || 0;
        if (currentFreezes < MAX_FREEZES) {
            updates.streakFreezes = increment(1);
            updates.streakHistory = arrayUnion({
                date: today,
                activity: 'freeze_earned',
                streak: newStreak
            });
        }
    }

    await updateDoc(doc(db, 'users', userId), updates);

    // Return info about freeze earned
    return {
        streak: newStreak,
        freezeEarned: newStreak % DAYS_FOR_FREEZE === 0 && (userData.streakFreezes || 0) < MAX_FREEZES
    };
};

/**
 * Reset user's streak to 0
 */
export const resetStreak = async (userId, userData) => {
    const currentStreak = userData.streak || 0;
    const longestStreak = userData.longestStreak || 0;
    const today = getDateString();

    const updates = {
        streak: 0,
        longestStreak: Math.max(currentStreak, longestStreak),
        lastActivityDate: today,
        streakHistory: arrayUnion({
            date: today,
            activity: 'streak_reset',
            previousStreak: currentStreak
        })
    };

    await updateDoc(doc(db, 'users', userId), updates);

    return {
        previousStreak: currentStreak,
        wasLongest: currentStreak > longestStreak
    };
};

/**
 * Use a streak freeze to save current streak
 */
export const useStreakFreeze = async (userId, userData) => {
    const today = getDateString();
    const currentFreezes = userData.streakFreezes || 0;

    if (currentFreezes <= 0) {
        throw new Error('No freezes available');
    }

    const updates = {
        streakFreezes: increment(-1),
        lastActivityDate: today,
        streakHistory: arrayUnion({
            date: today,
            activity: 'freeze_used',
            streak: userData.streak || 0
        })
    };

    await updateDoc(doc(db, 'users', userId), updates);

    return {
        streak: userData.streak || 0,
        freezesRemaining: currentFreezes - 1
    };
};

/**
 * Main function to check and update streak
 * Should be called when user opens app or completes activity
 */
export const checkStreak = async (userId, userData) => {
    const today = getDateString();
    const yesterday = getYesterdayString();
    const lastActivity = userData.lastActivityDate || '';

    // Scenario 1: Already did activity today
    if (lastActivity === today) {
        return {
            status: 'active',
            streak: userData.streak || 0,
            message: 'Streak is active for today'
        };
    }

    // Scenario 2: Did activity yesterday - increment streak
    if (lastActivity === yesterday) {
        const result = await incrementStreak(userId, userData);
        return {
            status: 'increased',
            streak: result.streak,
            freezeEarned: result.freezeEarned,
            message: result.freezeEarned
                ? `Streak increased to ${result.streak}! You earned a freeze shield! 🛡️`
                : `Streak increased to ${result.streak}!`
        };
    }

    // Scenario 3: Missed 1+ days
    const daysMissed = daysBetween(lastActivity, today) - 1;

    if (daysMissed >= 1) {
        const currentFreezes = userData.streakFreezes || 0;

        // Has freezes available
        if (currentFreezes > 0) {
            return {
                status: 'at_risk',
                streak: userData.streak || 0,
                daysMissed,
                freezesAvailable: currentFreezes,
                message: `You missed ${daysMissed} day(s). Use a freeze shield to save your ${userData.streak}-day streak?`
            };
        }

        // No freezes - reset streak
        const result = await resetStreak(userId, userData);
        return {
            status: 'lost',
            streak: 0,
            previousStreak: result.previousStreak,
            wasLongest: result.wasLongest,
            message: result.wasLongest
                ? `Your ${result.previousStreak}-day streak became your longest streak!`
                : `Your ${result.previousStreak}-day streak was reset.`
        };
    }

    // Fallback - shouldn't reach here
    return {
        status: 'unknown',
        streak: userData.streak || 0,
        message: 'Streak status unknown'
    };
};

/**
 * Update last activity date
 * Call this after any qualifying activity (workout, meal, challenge)
 */
export const updateActivityDate = async (userId) => {
    const today = getDateString();

    await updateDoc(doc(db, 'users', userId), {
        lastActivityDate: today
    });
};

/**
 * Initialize streak fields for new users
 */
export const initializeStreak = async (userId) => {
    const today = getDateString();

    await updateDoc(doc(db, 'users', userId), {
        streak: 0,
        longestStreak: 0,
        streakFreezes: 0,
        lastActivityDate: today,
        streakHistory: []
    });
};
