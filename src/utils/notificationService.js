import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

/**
 * Request notification permission and get FCM token
 * @returns {Promise<{success: boolean, token?: string, error?: any}>}
 */
export const requestNotificationPermission = async () => {
    try {
        // Check if messaging is supported
        if (!messaging) {
            return {
                success: false,
                error: 'Notifications not supported in this browser'
            };
        }

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            return {
                success: false,
                reason: 'permission_denied',
                message: 'Você precisa permitir notificações para receber alertas'
            };
        }

        // Get FCM token
        // Note: You need to generate a VAPID key in Firebase Console
        // Project Settings > Cloud Messaging > Web Push certificates
        const token = await getToken(messaging, {
            vapidKey: 'YOUR_VAPID_KEY_HERE' // TODO: Replace with actual VAPID key
        });

        // Save token to Firestore
        if (auth.currentUser && token) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                fcmTokens: arrayUnion(token),
                notificationsEnabled: true,
                lastTokenUpdate: new Date()
            });
        }

        return { success: true, token };

    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return {
            success: false,
            error,
            message: 'Erro ao ativar notificações. Tente novamente.'
        };
    }
};

/**
 * Setup listener for foreground messages
 * @param {Function} onMessageReceived - Callback for when message is received
 */
export const setupForegroundListener = (onMessageReceived) => {
    if (!messaging) {
        console.warn('Messaging not available');
        return () => { };
    }

    const unsubscribe = onMessage(messaging, (payload) => {
        console.log('[Foreground] Message received:', payload);

        // Call callback with payload
        if (onMessageReceived) {
            onMessageReceived(payload);
        }

        // Show browser notification if app is in foreground
        if (Notification.permission === 'granted') {
            new Notification(
                payload.notification?.title || 'Holy Fit',
                {
                    body: payload.notification?.body || '',
                    icon: '/logo192.png',
                    badge: '/badge-72x72.png',
                    tag: payload.data?.tag || 'default',
                    data: payload.data
                }
            );
        }
    });

    return unsubscribe;
};

/**
 * Disable notifications for current user
 */
export const disableNotifications = async () => {
    try {
        if (auth.currentUser) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                notificationsEnabled: false
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Error disabling notifications:', error);
        return { success: false, error };
    }
};

/**
 * Check if notifications are supported
 */
export const areNotificationsSupported = () => {
    return 'Notification' in window && 'serviceWorker' in navigator && messaging !== null;
};

/**
 * Get current notification permission status
 */
export const getNotificationPermission = () => {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
};

export default {
    requestNotificationPermission,
    setupForegroundListener,
    disableNotifications,
    areNotificationsSupported,
    getNotificationPermission
};
