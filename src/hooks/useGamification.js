import { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { getActiveSeason } from '../utils/seasonUtils';
import confetti from 'canvas-confetti';

export const useGamification = () => {
    const [loading, setLoading] = useState(false);

    const calculateLevel = (totalPoints) => {
        return Math.floor(totalPoints / 1000) + 1;
    };

    const addXP = async (amount, type) => {
        const user = auth.currentUser;
        if (!user) return;

        setLoading(true);
        try {
            const userRef = doc(db, 'users', user.uid);

            // Get current data to check for level up
            const userSnap = await getDoc(userRef);
            const currentPoints = userSnap.data()?.totalPoints || 0;
            const currentLevel = calculateLevel(currentPoints);
            const newPoints = currentPoints + amount;
            const newLevel = calculateLevel(newPoints);

            // Check for active season
            const activeSeason = await getActiveSeason();

            // Prepare update data
            const updateData = {
                totalPoints: increment(amount),
                level: newLevel
            };

            // Add seasonPoints ONLY if season is active
            if (activeSeason) {
                updateData.seasonPoints = increment(amount);
            }

            // Update User
            await updateDoc(userRef, updateData);

            // Add History with season tracking
            await addDoc(collection(db, 'xp_history'), {
                userId: user.uid,
                type,
                xpGained: amount,
                addedToSeason: !!activeSeason,
                seasonId: activeSeason?.id || null,
                timestamp: serverTimestamp()
            });

            // Visual Feedback
            triggerConfetti(type);

            // Level Up Check
            if (newLevel > currentLevel) {
                triggerLevelUpConfetti();
            }

            return true;
        } catch (error) {
            console.error("Error adding XP:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const triggerConfetti = (type) => {
        if (type === 'workout') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#A855F7', '#D946EF', '#FBC02D']
            });
        } else if (type === 'water') {
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#3B82F6', '#60A5FA', '#93C5FD']
            });
        }
    };

    const triggerLevelUpConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    return { addXP, calculateLevel, loading };
};
