import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Get the currently active season
 * @returns {Promise<Object|null>} Active season object or null if no active season
 */
export const getActiveSeason = async () => {
    try {
        const seasonsQuery = query(
            collection(db, 'seasons'),
            where('isActive', '==', true),
            limit(1)
        );

        const querySnapshot = await getDocs(seasonsQuery);

        if (querySnapshot.empty) {
            return null;
        }

        const seasonDoc = querySnapshot.docs[0];
        return {
            id: seasonDoc.id,
            ...seasonDoc.data()
        };
    } catch (error) {
        console.error('Error fetching active season:', error);
        return null;
    }
};

/**
 * Check if a season is currently active
 * @returns {Promise<boolean>} True if there's an active season
 */
export const hasActiveSeason = async () => {
    const season = await getActiveSeason();
    return season !== null;
};

/**
 * Get season by ID
 * @param {string} seasonId - Season ID
 * @returns {Promise<Object|null>} Season object or null
 */
export const getSeasonById = async (seasonId) => {
    try {
        const seasonDoc = await getDoc(doc(db, 'seasons', seasonId));

        if (!seasonDoc.exists()) {
            return null;
        }

        return {
            id: seasonDoc.id,
            ...seasonDoc.data()
        };
    } catch (error) {
        console.error('Error fetching season:', error);
        return null;
    }
};

/**
 * Check if a specific date is within a season's timeframe
 * @param {Object} season - Season object
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is within season
 */
export const isDateInSeason = (season, date = new Date()) => {
    if (!season || !season.startDate || !season.endDate) {
        return false;
    }

    const startDate = season.startDate.toDate ? season.startDate.toDate() : new Date(season.startDate);
    const endDate = season.endDate.toDate ? season.endDate.toDate() : new Date(season.endDate);

    return date >= startDate && date <= endDate;
};

export default {
    getActiveSeason,
    hasActiveSeason,
    getSeasonById,
    isDateInSeason
};
