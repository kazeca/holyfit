import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getTitleForLevel, getFormattedTitle, checkNewTitle } from '../data/titles';

/**
 * Update user's title based on new level
 * Returns the new title if unlocked, null otherwise
 */
export const updateUserTitle = async (userId, newLevel, previousLevel = 0) => {
    try {
        const newTitle = getTitleForLevel(newLevel);
        const formattedTitle = getFormattedTitle(newLevel);

        // Check if this is a new title unlock
        const unlockedTitle = checkNewTitle(previousLevel, newLevel);

        // Always update current title
        await updateDoc(doc(db, 'users', userId), {
            level: newLevel,
            currentTitle: formattedTitle,
            activeTitle: formattedTitle
        });

        // If new title unlocked, add to unlocked titles
        if (unlockedTitle) {
            await updateDoc(doc(db, 'users', userId), {
                unlockedTitles: arrayUnion(formattedTitle)
            });

            return {
                unlocked: true,
                title: unlockedTitle
            };
        }

        return { unlocked: false };
    } catch (error) {
        console.error('Error updating user title:', error);
        throw error;
    }
};

/**
 * Change active title (user can choose which unlocked title to display)
 */
export const setActiveTitle = async (userId, titleString) => {
    try {
        await updateDoc(doc(db, 'users', userId), {
            activeTitle: titleString
        });
    } catch (error) {
        console.error('Error setting active title:', error);
        throw error;
    }
};

/**
 * Get title display for user (with emoji and color)
 */
export const getTitleDisplay = (level) => {
    const title = getTitleForLevel(level);
    return {
        text: `${title.emoji} ${title.name}`,
        emoji: title.emoji,
        name: title.name,
        color: title.color,
        gradient: title.gradient
    };
};
