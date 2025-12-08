import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Activity, Trophy, Zap } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        totalWorkouts: 0,
        totalXP: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Total users
            const usersSnap = await getDocs(collection(db, 'users'));
            const totalUsers = usersSnap.size;

            // Active today (users with lastActive today)
            const today = new Date().toDateString();
            const activeUsers = usersSnap.docs.filter(doc => {
                const data = doc.data();
                return data.lastActive === today;
            });

            // Total workouts
            const workoutsSnap = await getDocs(collection(db, 'workouts'));
            const totalWorkouts = workoutsSnap.size;

            // Total XP (sum from all users)
            const totalXP = usersSnap.docs.reduce((sum, doc) => {
                return sum + (doc.data().totalPoints || 0);
            }, 0);

            setStats({
                totalUsers,
                activeToday: activeUsers.length,
                totalWorkouts,
                totalXP
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400 text-sm">Visão geral do sistema</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="text-cyan-500" size={28} />
                        </div>
                        <p className="text-5xl font-black text-white mb-2">{stats.totalUsers}</p>
                        <p className="text-slate-400 text-sm font-medium">Total de Usuários</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Activity className="text-green-500" size={28} />
                        </div>
                        <p className="text-5xl font-black text-white mb-2">{stats.activeToday}</p>
                        <p className="text-slate-400 text-sm font-medium">Ativos Hoje</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Trophy className="text-orange-500" size={28} />
                        </div>
                        <p className="text-5xl font-black text-white mb-2">{stats.totalWorkouts}</p>
                        <p className="text-slate-400 text-sm font-medium">Total de Treinos</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="text-yellow-500" size={28} />
                        </div>
                        <p className="text-4xl font-black text-white mb-2">{stats.totalXP.toLocaleString()}</p>
                        <p className="text-slate-400 text-sm font-medium">Total de XP</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-white mb-4">Ações Rápidas</h2>

                    <button
                        onClick={() => navigate('/admin/users')}
                        className="w-full bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl p-4 text-left transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold">Gerenciar Usuários</h3>
                                <p className="text-slate-400 text-sm">Ver lista, banir, editar</p>
                            </div>
                            <Users className="text-cyan-500" size={24} />
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/admin/seasons')}
                        className="w-full bg-slate-800 border border-slate-700/50 hover:border-yellow-500/50 rounded-2xl p-4 text-left transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold">Temporadas (21 dias)</h3>
                                <p className="text-slate-400 text-sm">Criar ciclos e gerenciar vencedores</p>
                            </div>
                            <Trophy className="text-yellow-500" size={24} />
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/admin/challenges')}
                        className="w-full bg-slate-800 border border-slate-700/50 hover:border-purple-500/50 rounded-2xl p-4 text-left transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold">Desafios</h3>
                                <p className="text-slate-400 text-sm">Criar e editar desafios</p>
                            </div>
                            <Trophy className="text-purple-500" size={24} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
