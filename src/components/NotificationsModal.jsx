import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { X, Bell, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationsModal = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    // Format time ago
    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 60) return 'agora mesmo';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min atrás`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d atrás`;
        return format(date, "d 'de' MMM", { locale: ptBR });
    };

    // Fetch notifications
    useEffect(() => {
        if (!isOpen || !auth.currentUser) return;

        const fetchNotifications = async () => {
            try {
                const q = query(
                    collection(db, 'notifications'),
                    where('userId', '==', auth.currentUser.uid),
                    orderBy('createdAt', 'desc'),
                    limit(50)
                );

                const snapshot = await getDocs(q);
                const notifs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setNotifications(notifs);
                setUnreadCount(notifs.filter(n => !n.read).length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [isOpen]);

    // Mark as read
    const markAsRead = async (notificationId) => {
        try {
            const notifRef = doc(db, 'notifications', notificationId);
            await updateDoc(notifRef, { read: true });

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const unreadNotifs = notifications.filter(n => !n.read);
            await Promise.all(
                unreadNotifs.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }))
            );

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Clear all
    const clearAll = async () => {
        if (!window.confirm('Limpar todas as notificações?')) return;

        try {
            await Promise.all(
                notifications.map(n => deleteDoc(doc(db, 'notifications', n.id)))
            );

            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl animate-slideUp">

                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell size={20} className="text-purple-500" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notificações</h2>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                        >
                            <Check size={16} />
                            Marcar todas como lidas
                        </button>
                        <button
                            onClick={clearAll}
                            className="text-sm text-red-500 hover:text-red-600 font-medium ml-auto flex items-center gap-1"
                        >
                            <Trash2 size={16} />
                            Limpar todas
                        </button>
                    </div>
                )}

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                            <p className="mt-2 text-sm">Carregando...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <Bell size={48} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Nenhuma notificação</p>
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <NotificationItem
                                key={notif.id}
                                notification={notif}
                                onMarkAsRead={markAsRead}
                                formatTimeAgo={formatTimeAgo}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const NotificationItem = ({ notification, onMarkAsRead, formatTimeAgo }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'badge': return '🏆';
            case 'achievement': return '⭐';
            case 'workout': return '💪';
            case 'streak': return '🔥';
            case 'level': return '📈';
            default: return '🔔';
        }
    };

    const getBgColor = () => {
        if (!notification.read) return 'bg-blue-50/50 dark:bg-blue-900/10';
        return 'hover:bg-gray-50 dark:hover:bg-gray-800/50';
    };

    return (
        <div
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
            className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${getBgColor()}`}
        >
            <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {notification.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                    </p>
                </div>
                {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                )}
            </div>
        </div>
    );
};

export default NotificationsModal;
