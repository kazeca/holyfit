import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase';

const functions = getFunctions(app);

/**
 * Call Cloud Function: Complete Workout
 */
export const callCompleteWorkout = async (workoutData) => {
    try {
        const completeWorkout = httpsCallable(functions, 'completeWorkout');
        const result = await completeWorkout(workoutData);
        return result.data;
    } catch (error) {
        console.error('Error calling completeWorkout:', error);
        throw new Error(error.message || 'Erro ao completar treino');
    }
};

/**
 * Call Cloud Function: Register Meal
 */
export const callRegisterMeal = async (mealData) => {
    try {
        const registerMeal = httpsCallable(functions, 'registerMeal');
        const result = await registerMeal(mealData);
        return result.data;
    } catch (error) {
        console.error('Error calling registerMeal:', error);
        throw new Error(error.message || 'Erro ao registrar refeição');
    }
};

/**
 * Call Cloud Function: Use Streak Freeze
 */
export const callUseStreakFreeze = async () => {
    try {
        const useStreakFreeze = httpsCallable(functions, 'useStreakFreeze');
        const result = await useStreakFreeze();
        return result.data;
    } catch (error) {
        console.error('Error calling useStreakFreeze:', error);
        throw new Error(error.message || 'Erro ao usar escudo');
    }
};

/**
 * Call Cloud Function: Complete Challenge
 */
export const callCompleteChallenge = async (challengeData) => {
    try {
        const completeChallenge = httpsCallable(functions, 'completeChallenge');
        const result = await completeChallenge(challengeData);
        return result.data;
    } catch (error) {
        console.error('Error calling completeChallenge:', error);
        throw new Error(error.message || 'Erro ao completar desafio');
    }
};
