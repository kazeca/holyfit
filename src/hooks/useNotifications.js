import { useEffect, useState } from 'react';
import {
    requestNotificationPermission,
    setupForegroundListener,
    disableNotifications,
    areNotificationsSupported,
    getNotificationPermission
} from '../utils/notificationService';

/**
 * Hook for managing push notifications
 */
export const useNotifications = () => {
    const [permission, setPermission] = useState(getNotificationPermission());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if notifications are supported
        if (!areNotificationsSupported()) {
            setError('Notificações não são suportadas neste navegador');
            return;
        }

        // Setup foreground message listener
        const unsubscribe = setupForegroundListener((payload) => {
            console.log('Foreground notification received:', payload);

            // You can show a toast here if you have a toast system
            // showToast(payload.notification.title, payload.notification.body);
        });

        // Update permission state if it changes
        const checkPermission = () => {
            setPermission(getNotificationPermission());
        };

        // Check permission periodically (in case user changes it in browser settings)
        const interval = setInterval(checkPermission, 5000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    /**
     * Enable push notifications
     */
    const enableNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await requestNotificationPermission();

            if (result.success) {
                setPermission('granted');
                return { success: true, token: result.token };
            } else {
                setError(result.message || 'Erro ao ativar notificações');
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Erro inesperado ao ativar notificações');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Disable push notifications
     */
    const disablePushNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await disableNotifications();

            if (result.success) {
                return { success: true };
            } else {
                setError('Erro ao desativar notificações');
                return { success: false };
            }
        } catch (err) {
            setError('Erro inesperado');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return {
        permission,
        loading,
        error,
        isSupported: areNotificationsSupported(),
        isEnabled: permission === 'granted',
        enableNotifications,
        disableNotifications: disablePushNotifications
    };
};

export default useNotifications;
