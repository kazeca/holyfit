import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Ban, CheckCircle } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useToast, ToastContainer } from '../../components/Toast';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { toasts, removeToast, success, error } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = users.filter(user =>
                user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));
            const usersData = usersSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (err) {
            console.error('Error fetching users:', err);
            error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (userId, currentBanStatus) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                banned: !currentBanStatus
            });

            success(currentBanStatus ? 'Usuário desbaneado' : 'Usuário banido');
            fetchUsers();
        } catch (err) {
            console.error('Error toggling ban:', err);
            error('Erro ao atualizar status');
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
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950 font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin')}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white">Gerenciar Usuários</h1>
                    <p className="text-slate-400 text-sm">{users.length} usuários cadastrados</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome ou email..."
                        className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        className={`bg-slate-800 border rounded-2xl p-4 ${user.banned ? 'border-red-500/50' : 'border-slate-700/50'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl">
                                    {(user.displayName || 'U')[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold">{user.displayName || 'Sem nome'}</h3>
                                    <p className="text-slate-400 text-sm">{user.email}</p>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-xs text-slate-500">Level {user.level || 1}</span>
                                        <span className="text-xs text-slate-500">{user.totalPoints || 0} XP</span>
                                        <span className="text-xs text-slate-500">{user.totalWorkouts || 0} treinos</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleBan(user.id, user.banned || false)}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${user.banned
                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
                                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                                    }`}
                            >
                                {user.banned ? (
                                    <>
                                        <CheckCircle size={16} className="inline mr-1" />
                                        Desbanir
                                    </>
                                ) : (
                                    <>
                                        <Ban size={16} className="inline mr-1" />
                                        Banir
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-400">Nenhum usuário encontrado</p>
                    </div>
                )}
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default AdminUsers;
