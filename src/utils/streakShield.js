import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Streak Freeze/Shield System
 * Allows users to protect their streak for one day using shields
 */

/**
 * Purchase a streak shield
 * @param {string} userId - User ID
 * @param {number} cost - Cost in points (default: 500)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const purchaseStreakShield = async (userId, cost = 500) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const userData = userSnap.data();
        const currentPoints = userData.totalPoints || 0;

        // Check if user has enough points
        if (currentPoints < cost) {
            return {
                success: false,
                message: `Pontos insuficientes. Você precisa de ${cost} pontos.`
            };
        }

        // Deduct points and add shield
        await updateDoc(userRef, {
            totalPoints: increment(-cost),
            streakShields: increment(1)
        });

        return {
            success: true,
            message: '🛡️ Escudo de Streak adquirido com sucesso!'
        };
    } catch (error) {
        console.error('Error purchasing streak shield:', error);
        return {
            success: false,
            message: 'Erro ao comprar escudo'
        };
    }
};

/**
 * Use a streak shield to protect streak
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const useStreakShield = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const userData = userSnap.data();
        const shields = userData.streakShields || 0;

        if (shields <= 0) {
            return {
                success: false,
                message: 'Você não tem escudos disponíveis'
            };
        }

        // Use shield and set protection until tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        await updateDoc(userRef, {
            streakShields: increment(-1),
            streakProtectedUntil: tomorrow.toISOString(),
            lastShieldUsed: new Date().toISOString()
        });

        return {
            success: true,
            message: '🛡️ Escudo ativado! Sua streak está protegida por 24h.'
        };
    } catch (error) {
        console.error('Error using streak shield:', error);
        return {
            success: false,
            message: 'Erro ao usar escudo'
        };
    }
};

/**
 * Check if user's streak is currently protected
 * @param {Object} userData - User data object
 * @returns {boolean}
 */
export const isStreakProtected = (userData) => {
    if (!userData?.streakProtectedUntil) return false;

    const protectedUntil = new Date(userData.streakProtectedUntil);
    const now = new Date();

    return now < protectedUntil;
};

/**
 * Auto-consume shield if streak would break
 * Call this before breaking a streak
 * @param {string} userId - User ID
 * @returns {Promise<{protected: boolean, message: string}>}
 */
export const autoConsumeShieldIfNeeded = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return { protected: false, message: 'Usuário não encontrado' };
        }

        const userData = userSnap.data();

        // Check if already protected
        if (isStreakProtected(userData)) {
            return {
                protected: true,
                message: '🛡️ Streak protegida pelo escudo ativo!'
            };
        }

        // Check if user has shields
        const shields = userData.streakShields || 0;
        if (shields > 0) {
            // Auto-consume shield
            const result = await useStreakShield(userId);
            if (result.success) {
                return {
                    protected: true,
                    message: '🛡️ Escudo consumido automaticamente! Streak salva!'
                };
            }
        }

        return {
            protected: false,
            message: 'Sem escudos disponíveis'
        };
    } catch (error) {
        console.error('Error auto-consuming shield:', error);
        return {
            protected: false,
            message: 'Erro ao verificar escudo'
        };
    }
};

/**
 * Get shield info for display
 * @param {Object} userData - User data object
 * @returns {Object} Shield information
 */
export const getShieldInfo = (userData) => {
    const shields = userData?.streakShields || 0;
    const isProtected = isStreakProtected(userData);
    const protectedUntil = userData?.streakProtectedUntil
        ? new Date(userData.streakProtectedUntil)
        : null;

    return {
        shields,
        isProtected,
        protectedUntil,
        canPurchase: (userData?.totalPoints || 0) >= 500
    };
};
