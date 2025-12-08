import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { Award, Plus, Users, X } from 'lucide-react';

const AdminBadges = () => {
    const [badges, setBadges] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [newBadge, setNewBadge] = useState({
        name: '',
        description: '',
        icon: '🏆',
        rarity: 'common'
    });

    useEffect(() => {
        fetchBadges();
        fetchUsers();
    }, []);

    const fetchBadges = async () => {
        try {
            const badgesSnap = await getDocs(collection(db, 'badges'));
            const badgesData = badgesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBadges(badgesData);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleCreateBadge = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'badges'), {
                ...newBadge,
                createdAt: serverTimestamp()
            });
            setShowCreateModal(false);
            setNewBadge({ name: '', description: '', icon: '🏆', rarity: 'common' });
            fetchBadges();
        } catch (error) {
            console.error('Error creating badge:', error);
            alert('Erro ao criar badge');
        }
    };

    const handleAssignBadge = async (userId) => {
        if (!selectedBadge) return;

        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                badges: arrayUnion(selectedBadge.id)
            });

            alert('Badge atribuído com sucesso!');
            setShowAssignModal(false);
            setSelectedBadge(null);
        } catch (error) {
            console.error('Error assigning badge:', error);
            alert('Erro ao atribuir badge');
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'text-gray-400 bg-gray-800';
            case 'rare': return 'text-blue-400 bg-blue-900/30';
            case 'epic': return 'text-purple-400 bg-purple-900/30';
            case 'legendary': return 'text-yellow-400 bg-yellow-900/30';
            default: return 'text-gray-400 bg-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Gerenciar Badges</h1>
                    <p className="text-gray-400 text-sm">Criar e atribuir badges aos usuários</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-bold transition-colors"
                >
                    <Plus size={20} />
                    Novo Badge
                </button>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="text-4xl">{badge.icon}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                                {badge.rarity}
                            </span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">{badge.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{badge.description}</p>
                        <button
                            onClick={() => {
                                setSelectedBadge(badge);
                                setShowAssignModal(true);
                            }}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-xl text-sm font-bold transition-colors"
                        >
                            Atribuir a Usuário
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Badge Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Criar Novo Badge</h2>
                            <button onClick={() => setShowCreateModal(false)}>
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateBadge} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={newBadge.name}
                                    onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Descrição</label>
                                <textarea
                                    value={newBadge.description}
                                    onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Ícone (Emoji)</label>
                                <input
                                    type="text"
                                    value={newBadge.icon}
                                    onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 text-2xl text-center"
                                    maxLength="2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Raridade</label>
                                <select
                                    value={newBadge.rarity}
                                    onChange={(e) => setNewBadge({ ...newBadge, rarity: e.target.value })}
                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-2"
                                >
                                    <option value="common">Comum</option>
                                    <option value="rare">Raro</option>
                                    <option value="epic">Épico</option>
                                    <option value="legendary">Lendário</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-bold transition-colors"
                            >
                                Criar Badge
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Badge Modal */}
            {showAssignModal && selectedBadge && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Atribuir: {selectedBadge.name}</h2>
                            <button onClick={() => {
                                setShowAssignModal(false);
                                setSelectedBadge(null);
                            }}>
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleAssignBadge(user.id)}
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl text-left transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                            alt={user.displayName}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-bold">{user.displayName}</p>
                                            <p className="text-sm text-gray-400">Nível {user.level || 1}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBadges;
