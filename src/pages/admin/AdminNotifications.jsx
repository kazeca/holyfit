import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Bell, Send, Users, Filter } from 'lucide-react';
import { createInAppNotification } from '../../utils/inAppNotifications';

const AdminNotifications = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        title: '',
        message: '',
        type: 'system',
        recipients: 'all',
        levelFilter: 1
    });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchHistory();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));
            const usersData = usersSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const historySnap = await getDocs(collection(db, 'notification_broadcasts'));
            const historyData = historySnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.sentAt?.seconds - a.sentAt?.seconds);
            setHistory(historyData.slice(0, 10)); // Last 10
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const getRecipients = () => {
        switch (notification.recipients) {
            case 'all':
                return users;
            case 'level':
                return users.filter(u => (u.level || 1) >= notification.levelFilter);
            case 'active':
                const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                return users.filter(u => {
                    const lastActive = u.lastWorkoutDate?.toMillis?.() || 0;
                    return lastActive > sevenDaysAgo;
                });
            default:
                return users;
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!notification.title || !notification.message) {
            alert('Preencha título e mensagem');
            return;
        }

        const recipients = getRecipients();

        if (!window.confirm(`Enviar para ${recipients.length} usuários?`)) {
            return;
        }

        setLoading(true);

        try {
            // Send notifications
            await Promise.all(
                recipients.map(user =>
                    createInAppNotification(user.id, {
                        title: notification.title,
                        message: notification.message,
                        type: notification.type,
                        icon: getIconForType(notification.type)
                    })
                )
            );

            // Log broadcast
            await addDoc(collection(db, 'notification_broadcasts'), {
                title: notification.title,
                message: notification.message,
                type: notification.type,
                recipients: notification.recipients,
                recipientCount: recipients.length,
                sentBy: auth.currentUser.uid,
                sentAt: serverTimestamp()
            });

            alert(`✅ ${recipients.length} notificações enviadas!`);
            setNotification({
                title: '',
                message: '',
                type: 'system',
                recipients: 'all',
                levelFilter: 1
            });
            fetchHistory();
        } catch (error) {
            console.error('Error sending notifications:', error);
            alert('Erro ao enviar notificações');
        } finally {
            setLoading(false);
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'workout': return '💪';
            case 'badge': return '🏆';
            case 'streak': return '🔥';
            case 'level': return '📈';
            default: return '🔔';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const recipients = getRecipients();

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Notificações em Massa</h1>
                <p className="text-gray-400 text-sm">Enviar notificações para múltiplos usuários</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Send Form */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Send size={20} />
                        Enviar Notificação
                    </h2>

                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Título</label>
                            <input
                                type="text"
                                value={notification.title}
                                onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                                className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                                placeholder="Ex: Nova Temporada Começou!"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Mensagem</label>
                            <textarea
                                value={notification.message}
                                onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                                className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                                rows="4"
                                placeholder="Ex: Participe e ganhe recompensas exclusivas!"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Tipo</label>
                            <select
                                value={notification.type}
                                onChange={(e) => setNotification({ ...notification, type: e.target.value })}
                                className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                            >
                                <option value="system">Sistema 🔔</option>
                                <option value="workout">Treino 💪</option>
                                <option value="badge">Badge 🏆</option>
                                <option value="streak">Sequência 🔥</option>
                                <option value="level">Nível 📈</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Destinatários</label>
                            <select
                                value={notification.recipients}
                                onChange={(e) => setNotification({ ...notification, recipients: e.target.value })}
                                className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                            >
                                <option value="all">Todos os usuários</option>
                                <option value="level">Por nível mínimo</option>
                                <option value="active">Apenas ativos (7 dias)</option>
                            </select>
                        </div>

                        {notification.recipients === 'level' && (
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nível Mínimo</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={notification.levelFilter}
                                    onChange={(e) => setNotification({ ...notification, levelFilter: parseInt(e.target.value) })}
                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                                />
                            </div>
                        )}

                        <div className="bg-gray-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-purple-400">
                                <Users size={16} />
                                <span className="text-sm font-bold">
                                    {recipients.length} usuário(s) receberão esta notificação
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Enviar Notificação
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* History */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Bell size={20} />
                        Histórico de Envios
                    </h2>

                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">
                                Nenhuma notificação enviada ainda
                            </p>
                        ) : (
                            history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-800 rounded-xl p-4"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-white font-bold text-sm">{item.title}</h3>
                                        <span className="text-xs text-gray-400">
                                            {item.recipientCount} usuários
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{item.message}</p>
                                    <p className="text-gray-500 text-xs">
                                        {formatDate(item.sentAt)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
