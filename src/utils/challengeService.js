import { db, storage, auth } from '../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

/**
 * Compress image before upload
 * Reduces file size to max 500KB
 */
export const compressImage = async (file) => {
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: 'image/jpeg'
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        return file; // Return original if compression fails
    }
};

/**
 * Upload photo to Firebase Storage (generic for challenges and workouts)
 * Returns download URL
 */
export const uploadProofPhoto = async (file, userId, actionType = 'challenges') => {
    try {
        // Compress image
        const compressedFile = await compressImage(file);

        // Create storage reference
        const timestamp = Date.now();
        const storageRef = ref(storage, `proofs/${actionType}/${userId}/${timestamp}.jpg`);

        // Upload
        await uploadBytes(storageRef, compressedFile);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw new Error('Erro ao fazer upload da foto. Tente novamente.');
    }
};

// Keep old function for backward compatibility
export const uploadChallengePhoto = async (file, userId) => {
    return uploadProofPhoto(file, userId, 'challenges');
};

/**
 * Save challenge completion to Firestore
 */
export const saveChallengeCompletion = async (data) => {
    try {
        const docRef = await addDoc(collection(db, 'challenge_completions'), {
            userId: data.userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            challengeType: data.challengeType,
            challengeDescription: data.challengeDescription,
            photoURL: data.photoURL,
            photoHash: data.photoHash,
            xpAwarded: data.xpAwarded,
            completedAt: serverTimestamp(),
            metadata: {
                photoTakenAt: new Date().toISOString()
            }
        });

        return docRef.id;
    } catch (error) {
        console.error('Error saving challenge completion:', error);
        throw new Error('Erro ao salvar desafio.');
    }
};

/**
 * Save workout completion to Firestore
 */
export const saveWorkoutCompletion = async (data) => {
    try {
        const docRef = await addDoc(collection(db, 'workout_completions'), {
            userId: data.userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            workoutName: data.workoutName,
            exercises: data.exercises || [],
            duration: data.duration || 0,
            photoURL: data.photoURL,
            photoHash: data.photoHash,
            xpAwarded: data.xpAwarded,
            completedAt: serverTimestamp()
        });

        return docRef.id;
    } catch (error) {
        console.error('Error saving workout completion:', error);
        throw new Error('Erro ao salvar treino.');
    }
};

/**
 * Update user stats after challenge completion
 */
export const updateUserChallengeStats = async (userId, xp) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            totalPoints: increment(xp),
            totalChallenges: increment(1),
            lastChallengeDate: new Date().toDateString()
        });
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw new Error('Erro ao atualizar estatísticas.');
    }
};

/**
 * Update user stats after workout completion
 */
export const updateUserWorkoutStats = async (userId, xp) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            totalPoints: increment(xp),
            totalWorkouts: increment(1)
        });
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw new Error('Erro ao atualizar estatísticas.');
    }
};

/**
 * Create automatic feed post (generic)
 */
export const createFeedPost = async (actionType, data) => {
    try {
        await addDoc(collection(db, 'feed_posts'), {
            userId: data.userId,
            userName: data.userName,
            userLevel: data.userLevel,
            userAvatar: data.userAvatar,
            activityType: actionType,
            description: data.description,
            photoURL: data.photoURL,
            xpEarned: data.xpAwarded,
            likes: 0,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating feed post:', error);
        // Don't throw - feed post is optional
    }
};

// Keep old function for backward compatibility
export const createChallengeFeedPost = async (data) => {
    return createFeedPost('Desafio Completado', {
        ...data,
        description: `Completou: ${data.challengeDescription}`
    });
};

/**
 * Complete challenge with photo proof
 * Main orchestration function
 */
export const completeChallengeWithPhoto = async (photoFile, challengeData, photoHash) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    try {
        // 1. Upload photo
        const photoURL = await uploadProofPhoto(photoFile, user.uid, 'challenges');

        // 2. Save completion
        const completionData = {
            userId: user.uid,
            userName: user.displayName || 'Usuário',
            userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`,
            challengeType: challengeData.title,
            challengeDescription: challengeData.task,
            photoURL,
            photoHash,
            xpAwarded: challengeData.reward
        };

        await saveChallengeCompletion(completionData);

        // 3. Update user stats
        await updateUserChallengeStats(user.uid, challengeData.reward);

        // 4. Create feed post
        await createChallengeFeedPost({
            ...completionData,
            userLevel: challengeData.userLevel || 1
        });

        return { success: true, photoURL };
    } catch (error) {
        console.error('Error completing challenge:', error);
        throw error;
    }
};

/**
 * Complete workout with photo proof
 * Similar to challenge but for workouts
 */
export const completeWorkoutWithPhoto = async (photoFile, workoutData, photoHash) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    try {
        // 1. Upload photo
        const photoURL = await uploadProofPhoto(photoFile, user.uid, 'workouts');

        // 2. Save workout completion
        const completionData = {
            userId: user.uid,
            userName: user.displayName || 'Usuário',
            userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`,
            workoutName: workoutData.workoutName || 'Treino',
            photoURL,
            photoHash,
            xpAwarded: workoutData.xp || 100,
            createdAt: serverTimestamp()
        };

        // Save to workouts collection
        await addDoc(collection(db, 'workouts'), completionData);

        // 3. Update user stats
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            totalPoints: increment(completionData.xpAwarded),
            seasonPoints: increment(completionData.xpAwarded),
            workoutsCompleted: increment(1),
            lastWorkoutDate: serverTimestamp()
        });

        // 4. Create feed post
        await createFeedPost('Treino Realizado', {
            ...completionData,
            userLevel: workoutData.userLevel || 1,
            description: `Completou treino: ${completionData.workoutName}`
        });

        return { success: true, photoURL };
    } catch (error) {
        console.error('Error completing workout:', error);
        throw error;
    }
};

