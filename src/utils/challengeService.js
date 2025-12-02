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
 * Upload challenge photo to Firebase Storage
 * Returns download URL
 */
export const uploadChallengePhoto = async (file, userId) => {
    try {
        // Compress image
        const compressedFile = await compressImage(file);

        // Create storage reference
        const timestamp = Date.now();
        const storageRef = ref(storage, `challenges/${userId}/${timestamp}.jpg`);

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
 * Create automatic feed post for challenge completion
 */
export const createChallengeFeedPost = async (data) => {
    try {
        await addDoc(collection(db, 'feed_posts'), {
            userId: data.userId,
            userName: data.userName,
            userLevel: data.userLevel,
            userAvatar: data.userAvatar,
            activityType: 'Desafio Completado',
            description: `Completou: ${data.challengeDescription}`,
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

/**
 * Complete challenge with photo proof
 * Main orchestration function
 */
export const completeChallengeWithPhoto = async (photoFile, challengeData, photoHash) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    try {
        // 1. Upload photo
        const photoURL = await uploadChallengePhoto(photoFile, user.uid);

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
