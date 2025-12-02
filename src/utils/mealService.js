import { db, storage, auth } from '../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import md5 from 'blueimp-md5';

/**
 * Compress image before upload
 * Reusing logic from challengeService
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
        return file;
    }
};

/**
 * Generate MD5 hash from file
 */
export const generatePhotoHash = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const hash = md5(arrayBuffer);
        return hash;
    } catch (error) {
        console.error('Error generating hash:', error);
        return null;
    }
};

/**
 * Upload meal photo to Firebase Storage
 */
export const uploadMealPhoto = async (file, userId) => {
    try {
        // Compress image
        const compressedFile = await compressImage(file);

        // Create storage reference
        const timestamp = Date.now();
        const storageRef = ref(storage, `proofs/meals/${userId}/${timestamp}.jpg`);

        // Upload
        await uploadBytes(storageRef, compressedFile);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading meal photo:', error);
        throw new Error('Erro ao fazer upload da foto. Tente novamente.');
    }
};

/**
 * Save meal to Firestore
 */
export const saveMeal = async (mealData) => {
    try {
        const docRef = await addDoc(collection(db, 'meals_history'), {
            userId: mealData.userId,
            userName: mealData.userName,
            userAvatar: mealData.userAvatar,
            userLevel: mealData.userLevel,
            mealType: mealData.mealType,
            foods: mealData.foods,
            totalCalories: mealData.totalCalories,
            totalProtein: mealData.totalProtein || 0,
            totalCarbs: mealData.totalCarbs || 0,
            totalFat: mealData.totalFat || 0,
            photoURL: mealData.photoURL,
            photoHash: mealData.photoHash,
            notes: mealData.notes || '',
            createdAt: serverTimestamp(),
            date: new Date().toISOString().split('T')[0]
        });

        return docRef.id;
    } catch (error) {
        console.error('Error saving meal:', error);
        throw new Error('Erro ao salvar refeição.');
    }
};

/**
 * Update user nutrition stats
 */
export const updateUserNutritionStats = async (userId, calories) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            caloriesConsumedToday: increment(calories),
            totalMeals: increment(1)
        });
    } catch (error) {
        console.error('Error updating nutrition stats:', error);
        // Don't throw - this is not critical
    }
};

/**
 * Create meal feed post
 */
export const createMealFeedPost = async (mealData) => {
    try {
        await addDoc(collection(db, 'feed_posts'), {
            userId: mealData.userId,
            userName: mealData.userName,
            userLevel: mealData.userLevel,
            userAvatar: mealData.userAvatar,
            activityType: 'Refeição Registrada',
            mealType: mealData.mealType,
            description: `Registrou: ${mealData.mealType}`,
            totalCalories: mealData.totalCalories,
            photoURL: mealData.photoURL,
            likes: 0,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating meal feed post:', error);
        // Don't throw - feed post is optional
    }
};

/**
 * Complete meal registration with photo
 * Main orchestration function
 */
export const completeMealWithPhoto = async (photoFile, mealData, photoHash) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    try {
        // 1. Upload photo
        const photoURL = await uploadMealPhoto(photoFile, user.uid);

        // 2. Calculate macros totals
        const totalProtein = mealData.foods.reduce((sum, food) =>
            sum + (food.protein * food.quantity), 0
        );
        const totalCarbs = mealData.foods.reduce((sum, food) =>
            sum + (food.carbs * food.quantity), 0
        );
        const totalFat = mealData.foods.reduce((sum, food) =>
            sum + (food.fat * food.quantity), 0
        );

        // 3. Save meal
        const completeMealData = {
            userId: user.uid,
            userName: user.displayName || 'Usuário',
            userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`,
            userLevel: mealData.userLevel || 1,
            mealType: mealData.mealType,
            foods: mealData.foods,
            totalCalories: mealData.totalCalories,
            totalProtein: Math.round(totalProtein * 10) / 10,
            totalCarbs: Math.round(totalCarbs * 10) / 10,
            totalFat: Math.round(totalFat * 10) / 10,
            photoURL,
            photoHash,
            notes: mealData.notes || ''
        };

        await saveMeal(completeMealData);

        // 4. Update user stats
        await updateUserNutritionStats(user.uid, mealData.totalCalories);

        // 5. Create feed post
        await createMealFeedPost(completeMealData);

        return { success: true, photoURL };
    } catch (error) {
        console.error('Error completing meal:', error);
        throw error;
    }
};
