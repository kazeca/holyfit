import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create an in-app notification for a user
 * @param {string} userId - User ID
 * @param {Object} notification - Notification data
 * @returns {Promise<string>} - Notification ID
 */
export const createInAppNotification = async (userId, notification) => {
    try {
        const docRef = await addDoc(collection(db, 'notifications'), {
            userId,
            title: notification.title,
            message: notification.message,
            type: notification.type || 'system',
            icon: notification.icon || '🔔',
            read: false,
            createdAt: serverTimestamp(),
            data: notification.data || {}
        });

        console.log('✅ [NOTIFICATION] Created:', notification.title);
        return docRef.id;
    } catch (error) {
        console.error('❌ [NOTIFICATION] Error creating:', error);
        throw error;
    }
};

/**
 * Create workout completion notification
 */
export const notifyWorkoutComplete = async (userId, workoutData) => {
    return createInAppNotification(userId, {
        title: 'Treino Registrado!',
        message: `Você ganhou +${workoutData.xp || 100} XP`,
        type: 'workout',
        icon: '💪',
        data: {
            workoutName: workoutData.workoutName,
            xp: workoutData.xp,
            calories: workoutData.calories
        }
    });
};

/**
 * Create badge earned notification
 */
export const notifyBadgeEarned = async (userId, badgeData) => {
    return createInAppNotification(userId, {
        title: 'Novo Badge Conquistado!',
        message: `Você ganhou: ${badgeData.name}`,
        type: 'badge',
        icon: '🏆',
        data: {
            badgeId: badgeData.id,
            badgeName: badgeData.name
        }
    });
};

/**
 * Create level up notification
 */
export const notifyLevelUp = async (userId, level) => {
    return createInAppNotification(userId, {
        title: 'Level Up!',
        message: `Você alcançou o nível ${level}!`,
        type: 'level',
        icon: '📈',
        data: {
            level
        }
    });
};

/**
 * Create streak milestone notification
 */
export const notifyStreakMilestone = async (userId, streak) => {
    return createInAppNotification(userId, {
        title: 'Sequência Incrível!',
        message: `${streak} dias seguidos de treino!`,
        type: 'streak',
        icon: '🔥',
        data: {
            streak
        }
    });
};

/**
 * Create welcome notification
 */
export const notifyWelcome = async (userId, userName) => {
    return createInAppNotification(userId, {
        title: `Bem-vindo, ${userName}!`,
        message: 'Complete seu primeiro treino para ganhar XP',
        type: 'system',
        icon: '👋',
        data: {}
    });
};
