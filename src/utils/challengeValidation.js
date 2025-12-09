import md5 from 'blueimp-md5';
import EXIF from 'exif-js';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';

/**
 * Generate MD5 hash from image file
 * Used to detect duplicate photo submissions
 */
export const generatePhotoHash = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const hash = md5(e.target.result);
            resolve(hash);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Extract EXIF timestamp from photo
 * Returns null if no EXIF data found
 */
export const extractPhotoTimestamp = async (file) => {
    return new Promise((resolve) => {
        EXIF.getData(file, function () {
            const dateTime = EXIF.getTag(this, 'DateTimeOriginal');
            const dateTimeDigitized = EXIF.getTag(this, 'DateTimeDigitized');
            const timestamp = dateTime || dateTimeDigitized;

            if (timestamp) {
                // EXIF format: "2024:12:02 02:00:00"
                const formatted = timestamp.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
                resolve(new Date(formatted));
            } else {
                resolve(null);
            }
        });
    });
};

/**
 * Check if photo was taken recently (within 2 hours)
 * Returns true if recent or if EXIF data not available (fallback to allow)
 */
export const isPhotoRecent = async (file) => {
    const photoDate = await extractPhotoTimestamp(file);

    // If no EXIF data, allow it (user might have camera without EXIF)
    if (!photoDate) {
        return true;
    }

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));

    return photoDate >= twoHoursAgo;
};

/**
 * Check if user has already completed challenge today
 * Returns true if can complete, false if on cooldown
 */
export const checkPhotoCooldown = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return true;

        const userData = userSnap.data();
        const lastChallengeDate = userData.lastChallengeDate;
        const today = new Date().toDateString();

        // If no last date or different day, allow
        if (!lastChallengeDate || lastChallengeDate !== today) {
            return true;
        }

        // Same day = on cooldown
        return false;
    } catch (error) {
        console.error('Error checking cooldown:', error);
        return true; // On error, allow (fail open)
    }
};

/**
 * Check if photo hash already exists for this user TODAY
 * Returns true if duplicate found today, false if unique
 */
export const checkPhotoReuse = async (userId, photoHash) => {
    try {
        // Only check for duplicates TODAY (not all time)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, 'challenge_completions'),
            where('userId', '==', userId),
            where('photoHash', '==', photoHash),
            where('createdAt', '>=', todayStart),
            where('createdAt', '<=', todayEnd),
            limit(1)
        );

        const snapshot = await getDocs(q);
        return !snapshot.empty; // true if duplicate found TODAY
    } catch (error) {
        console.error('Error checking photo reuse:', error);
        return false; // On error, assume unique (fail open)
    }
};

/**
 * Validate photo for challenge completion
 * Returns { valid: boolean, error: string }
 */
export const validateChallengePhoto = async (file, userId) => {
    // Check file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
        return { valid: false, error: 'Foto muito grande! Máximo 10MB.' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'Arquivo deve ser uma imagem.' };
    }

    // Removed: Daily cooldown check - users can complete unlimited workouts per day
    // This was blocking multiple workouts, which is now allowed

    // Generate hash
    const photoHash = await generatePhotoHash(file);

    // Check reuse
    const isDuplicate = await checkPhotoReuse(userId, photoHash);
    if (isDuplicate) {
        return { valid: false, error: 'Você já usou essa foto! Tire uma nova. 📸' };
    }

    // Check recency (optional - commented out for better UX)
    // const isRecent = await isPhotoRecent(file);
    // if (!isRecent) {
    //   return { valid: false, error: 'Use uma foto tirada agora (não da galeria antiga).' };
    // }

    return { valid: true, error: null, photoHash };
};
