const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate XP earned from workout
 */
function calculateWorkoutXP(workoutType, duration, intensity) {
    const baseXP = {
        'Corrida': 10,
        'Musculação': 15,
        'Bicicleta': 10,
        'Natação': 12,
        'Yoga': 8,
        'Pilates': 8,
        'Funcional': 15,
        'Crossfit': 20,
        'HIIT': 18,
        'Caminhada': 5
    }[workoutType] || 10;

    const durationMultiplier = Math.floor(duration / 5);

    const intensityMultiplier = {
        'Leve': 1.0,
        'Moderada': 1.5,
        'Alta': 2.0
    }[intensity] || 1.0;

    return Math.floor(baseXP * durationMultiplier * intensityMultiplier);
}

/**
 * Calculate user level from XP
 */
function calculateLevel(xp) {
    return Math.floor(xp / 100);
}

/**
 * Get title by level
 */
function getTitleByLevel(level) {
    if (level >= 31) return '🌟 Divino';
    if (level >= 21) return '👑 Lenda';
    if (level >= 16) return '💎 Elite';
    if (level >= 11) return '🔥 Veterano';
    if (level >= 6) return '⚔️ Guerreiro';
    return '🔰 Iniciante';
}

/**
 * Check if photo hash is duplicate
 */
async function isDuplicatePhoto(userId, photoHash, collection) {
    const snapshot = await db.collection(collection)
        .where('userId', '==', userId)
        .where('photoHash', '==', photoHash)
        .limit(1)
        .get();

    return !snapshot.empty;
}

// ==================== CLOUD FUNCTIONS ====================

/**
 * Complete workout with photo proof
 */
exports.completeWorkout = functions.https.onCall(async (data, context) => {
    // Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const userId = context.auth.uid;
    const { workoutType, duration, intensity, calories, photoHash, photoURL } = data;

    // Validation
    if (!workoutType || !duration || !intensity || !photoHash || !photoURL) {
        throw new functions.https.HttpsError('invalid-argument', 'Dados incompletos');
    }

    if (duration < 5 || duration > 300) {
        throw new functions.https.HttpsError('invalid-argument', 'Duração deve estar entre 5 e 300 minutos');
    }

    // Anti-fraud: Check duplicate photo
    const isDuplicate = await isDuplicatePhoto(userId, photoHash, 'workouts_history');
    if (isDuplicate) {
        throw new functions.https.HttpsError('already-exists', 'Esta foto já foi usada anteriormente');
    }

    try {
        // Calculate XP (server-side = secure!)
        const xpGained = calculateWorkoutXP(workoutType, duration, intensity);

        // Transaction to update user and create history
        const result = await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new Error('Usuário não encontrado');
            }

            const userData = userDoc.data();
            const newXP = (userData.xp || 0) + xpGained;
            const newLevel = calculateLevel(newXP);
            const newTitle = getTitleByLevel(newLevel);
            const newTotalPoints = (userData.totalPoints || 0) + xpGained;

            // Update user
            transaction.update(userRef, {
                xp: newXP,
                level: newLevel,
                currentTitle: newTitle,
                activeTitle: newTitle,
                totalPoints: newTotalPoints,
                workoutsCompleted: admin.firestore.FieldValue.increment(1),
                totalCaloriesBurned: admin.firestore.FieldValue.increment(calories || 0),
                lastActivityDate: new Date().toISOString().split('T')[0]
            });

            // Create workout history
            const workoutRef = db.collection('workouts_history').doc();
            transaction.create(workoutRef, {
                userId,
                userName: userData.name || 'Usuário',
                userAvatar: userData.avatar || '',
                userLevel: newLevel,
                workoutType,
                duration,
                intensity,
                calories: calories || 0,
                xpGained,
                photoHash,
                photoURL,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                date: new Date().toISOString().split('T')[0]
            });

            // Create feed post
            const feedRef = db.collection('feed_posts').doc();
            transaction.create(feedRef, {
                type: 'workout',
                userId,
                userName: userData.name || 'Usuário',
                userAvatar: userData.avatar || '',
                userLevel: newLevel,
                userTitle: newTitle,
                workoutType,
                duration,
                intensity,
                photoURL,
                xpGained,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                likes: 0,
                comments: 0
            });

            return { xpGained, newLevel, newTitle };
        });

        return {
            success: true,
            ...result,
            message: `Treino concluído! +${result.xpGained} XP`
        };

    } catch (error) {
        console.error('Error completing workout:', error);
        throw new functions.https.HttpsError('internal', 'Erro ao processar treino: ' + error.message);
    }
});

/**
 * Register meal with photo proof
 */
exports.registerMeal = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const userId = context.auth.uid;
    const {
        mealType,
        foods,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        photoHash,
        photoURL,
        notes
    } = data;

    // Validation
    if (!mealType || !foods || !Array.isArray(foods) || foods.length === 0 || !photoHash || !photoURL) {
        throw new functions.https.HttpsError('invalid-argument', 'Dados incompletos');
    }

    if (totalCalories < 0 || totalCalories > 5000) {
        throw new functions.https.HttpsError('invalid-argument', 'Calorias inválidas');
    }

    // Anti-fraud: Check duplicate photo
    const isDuplicate = await isDuplicatePhoto(userId, photoHash, 'meals_history');
    if (isDuplicate) {
        throw new functions.https.HttpsError('already-exists', 'Esta foto já foi usada anteriormente');
    }

    try {
        // Calculate XP (10 calories = 1 XP)
        const xpGained = Math.round(totalCalories / 10);

        const result = await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new Error('Usuário não encontrado');
            }

            const userData = userDoc.data();
            const newXP = (userData.xp || 0) + xpGained;
            const newLevel = calculateLevel(newXP);
            const newTitle = getTitleByLevel(newLevel);

            // Update user
            transaction.update(userRef, {
                xp: newXP,
                level: newLevel,
                currentTitle: newTitle,
                activeTitle: newTitle,
                totalPoints: admin.firestore.FieldValue.increment(xpGained),
                totalMeals: admin.firestore.FieldValue.increment(1),
                caloriesConsumedToday: admin.firestore.FieldValue.increment(totalCalories),
                lastActivityDate: new Date().toISOString().split('T')[0]
            });

            // Create meal history
            const mealRef = db.collection('meals_history').doc();
            transaction.create(mealRef, {
                userId,
                userName: userData.name || 'Usuário',
                userAvatar: userData.avatar || '',
                userLevel: newLevel,
                mealType,
                foods,
                totalCalories,
                totalProtein: totalProtein || 0,
                totalCarbs: totalCarbs || 0,
                totalFat: totalFat || 0,
                photoHash,
                photoURL,
                notes: notes || '',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                date: new Date().toISOString().split('T')[0]
            });

            // Create feed post
            const feedRef = db.collection('feed_posts').doc();
            transaction.create(feedRef, {
                type: 'meal',
                userId,
                userName: userData.name || 'Usuário',
                userAvatar: userData.avatar || '',
                userLevel: newLevel,
                userTitle: newTitle,
                mealType,
                totalCalories,
                photoURL,
                xpGained,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                likes: 0,
                comments: 0
            });

            return { xpGained, newLevel, newTitle };
        });

        return {
            success: true,
            ...result,
            message: `Refeição registrada! +${result.xpGained} XP`
        };

    } catch (error) {
        console.error('Error registering meal:', error);
        throw new functions.https.HttpsError('internal', 'Erro ao processar refeição: ' + error.message);
    }
});

/**
 * Use streak freeze shield
 */
exports.useStreakFreeze = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const userId = context.auth.uid;

    try {
        const result = await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new Error('Usuário não encontrado');
            }

            const userData = userDoc.data();

            // Check if has freezes
            if ((userData.streakFreezes || 0) <= 0) {
                throw new Error('Você não tem escudos disponíveis');
            }

            // Use freeze
            transaction.update(userRef, {
                streakFreezes: admin.firestore.FieldValue.increment(-1),
                lastActivityDate: new Date().toISOString().split('T')[0],
                streakHistory: admin.firestore.FieldValue.arrayUnion({
                    date: new Date().toISOString().split('T')[0],
                    activity: 'freeze_used',
                    streak: userData.streak || 0
                })
            });

            return {
                streak: userData.streak || 0,
                freezesRemaining: (userData.streakFreezes || 0) - 1
            };
        });

        return {
            success: true,
            ...result,
            message: `Escudo usado! Sequência de ${result.streak} dias salva!`
        };

    } catch (error) {
        console.error('Error using freeze:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Complete challenge with photo (optional - bonus function)
 */
exports.completeChallenge = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const userId = context.auth.uid;
    const { challengeType, points, difficulty, photoHash, photoURL } = data;

    if (!challengeType || !points || !photoHash || !photoURL) {
        throw new functions.https.HttpsError('invalid-argument', 'Dados incompletos');
    }

    // Anti-fraud
    const isDuplicate = await isDuplicatePhoto(userId, photoHash, 'challenges_history');
    if (isDuplicate) {
        throw new functions.https.HttpsError('already-exists', 'Esta foto já foi usada');
    }

    try {
        const result = await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data();

            const newXP = (userData.xp || 0) + points;
            const newLevel = calculateLevel(newXP);
            const newTitle = getTitleByLevel(newLevel);

            transaction.update(userRef, {
                xp: newXP,
                level: newLevel,
                currentTitle: newTitle,
                totalPoints: admin.firestore.FieldValue.increment(points),
                challengesCompleted: admin.firestore.FieldValue.increment(1),
                lastActivityDate: new Date().toISOString().split('T')[0]
            });

            transaction.create(db.collection('challenges_history').doc(), {
                userId,
                userName: userData.name,
                userLevel: newLevel,
                challengeType,
                difficulty,
                points,
                photoHash,
                photoURL,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return { xpGained: points, newLevel };
        });

        return { success: true, ...result };

    } catch (error) {
        console.error('Error completing challenge:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
