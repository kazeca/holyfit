import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Users, Activity, TrendingUp, Calendar, Award, Zap, Target, BarChart3 } from 'lucide-react';

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        activeToday: 0,
        active7Days: 0,
        active30Days: 0,
        totalWorkouts: 0,
        avgWorkoutsPerUser: 0,
        totalXP: 0,
        avgLevel: 0,
        retentionD1: 0,
        retentionD7: 0,
        retentionD30: 0,
        newUsersToday: 0,
        newUsers7Days: 0,
        newUsers30Days: 0
    });

    const [userLevels, setUserLevels] = useState({
        level1_5: 0,
        level6_10: 0,
        level11_20: 0,
        level21plus: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const now = new Date();
            const today = now.toDateString();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            // Fetch all users
            const usersSnap = await getDocs(collection(db, 'users'));
            const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Total users
            const totalUsers = users.length;

            // Active users
            const activeToday = users.filter(u => u.lastActive === today).length;
            const active7Days = users.filter(u => {
                const lastActive = u.lastWorkoutDate?.toDate?.() || new Date(0);
                return lastActive > sevenDaysAgo;
            }).length;
            const active30Days = users.filter(u => {
                const lastActive = u.lastWorkoutDate?.toDate?.() || new Date(0);
                return lastActive > thirtyDaysAgo;
            }).length;

            // New users
            const newUsersToday = users.filter(u => {
                const createdAt = new Date(u.createdAt);
                return createdAt.toDateString() === today;
            }).length;
            const newUsers7Days = users.filter(u => {
                const createdAt = new Date(u.createdAt);
                return createdAt > sevenDaysAgo;
            }).length;
            const newUsers30Days = users.filter(u => {
                const createdAt = new Date(u.createdAt);
                return createdAt > thirtyDaysAgo;
            }).length;

            // Workouts
            const workoutsSnap = await getDocs(collection(db, 'workouts'));
            const totalWorkouts = workoutsSnap.size;
            const avgWorkoutsPerUser = totalUsers > 0 ? (totalWorkouts / totalUsers).toFixed(1) : 0;

            // XP and Levels
            const totalXP = users.reduce((sum, u) => sum + (u.totalPoints || 0), 0);
            const avgLevel = totalUsers > 0 ? (users.reduce((sum, u) => sum + (u.level || 1), 0) / totalUsers).toFixed(1) : 0;

            // User level distribution
            const level1_5 = users.filter(u => (u.level || 1) <= 5).length;
            const level6_10 = users.filter(u => (u.level || 1) >= 6 && (u.level || 1) <= 10).length;
            const level11_20 = users.filter(u => (u.level || 1) >= 11 && (u.level || 1) <= 20).length;
            const level21plus = users.filter(u => (u.level || 1) >= 21).length;

            // Retention (simplified)
            const retentionD1 = totalUsers > 0 ? ((activeToday / totalUsers) * 100).toFixed(1) : 0;
            const retentionD7 = totalUsers > 0 ? ((active7Days / totalUsers) * 100).toFixed(1) : 0;
            const retentionD30 = totalUsers > 0 ? ((active30Days / totalUsers) * 100).toFixed(1) : 0;

            setMetrics({
                totalUsers,
                activeToday,
                active7Days,
                active30Days,
                totalWorkouts,
                avgWorkoutsPerUser,
                totalXP,
                avgLevel,
                retentionD1,
                retentionD7,
                retentionD30,
                newUsersToday,
                newUsers7Days,
                newUsers30Days
            });

            setUserLevels({
                level1_5,
                level6_10,
                level11_20,
                level21plus
            });

        } catch (error) {
            console.error('Error fetching analytics:', error);
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
                    <h1 className="text-4xl font-black text-white mb-2">Analytics</h1>
                    <p className="text-slate-400 text-sm">Métricas detalhadas e análise de dados</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="text-cyan-500" size={28} />
                        </div>
                        <p className="text-5xl font-black text-white mb-2">{metrics.totalUsers}</p>
                        <p className="text-slate-400 text-sm font-medium">Total de Usuários</p>
                        <p className="text-green-400 text-xs mt-2">+{metrics.newUsers7Days} nos últimos 7 dias</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Activity className="text-green-500" size={28} />
                        </div>
                        <p className="text-5xl font-black text-white mb-2">{metrics.active7Days}</p>
                        <p className="text-slate-400 text-sm font-medium">Ativos (7 dias)</p>
                        <p className="text-green-400 text-xs mt-2">{metrics.retentionD7}% de retenção</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="text-orange-500" size={28} />
                        </div>
                        <p className="text-5xl font-black text-white mb-2">{metrics.avgWorkoutsPerUser}</p>
                        <p className="text-slate-400 text-sm font-medium">Treinos por Usuário</p>
                        <p className="text-slate-400 text-xs mt-2">{metrics.totalWorkouts} treinos totais</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="text-purple-500" size={28} />
                        </div>
                        <p className="text-5xl font-black text-white mb-2">{metrics.avgLevel}</p>
                        <p className="text-slate-400 text-sm font-medium">Nível Médio</p>
                        <p className="text-slate-400 text-xs mt-2">{metrics.totalXP.toLocaleString()} XP total</p>
                    </div>
                </div>

                {/* Retention & Growth */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Retention */}
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            <BarChart3 size={24} className="text-purple-400" />
                            Taxa de Retenção
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-400 text-sm">D1 (Hoje)</span>
                                    <span className="text-white font-bold">{metrics.retentionD1}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                                        style={{ width: `${metrics.retentionD1}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-400 text-sm">D7 (7 dias)</span>
                                    <span className="text-white font-bold">{metrics.retentionD7}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                                        style={{ width: `${metrics.retentionD7}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-400 text-sm">D30 (30 dias)</span>
                                    <span className="text-white font-bold">{metrics.retentionD30}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                                        style={{ width: `${metrics.retentionD30}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Growth */}
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            <TrendingUp size={24} className="text-green-400" />
                            Crescimento de Usuários
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Hoje</p>
                                    <p className="text-3xl font-black text-white">{metrics.newUsersToday}</p>
                                </div>
                                <Calendar className="text-cyan-500" size={32} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Últimos 7 dias</p>
                                    <p className="text-3xl font-black text-white">{metrics.newUsers7Days}</p>
                                </div>
                                <Calendar className="text-blue-500" size={32} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Últimos 30 dias</p>
                                    <p className="text-3xl font-black text-white">{metrics.newUsers30Days}</p>
                                </div>
                                <Calendar className="text-purple-500" size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Level Distribution */}
                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <Award size={24} className="text-yellow-400" />
                        Distribuição de Níveis
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                            <p className="text-4xl font-black text-cyan-400 mb-2">{userLevels.level1_5}</p>
                            <p className="text-slate-400 text-sm">Nível 1-5</p>
                            <p className="text-xs text-slate-500 mt-1">Iniciantes</p>
                        </div>

                        <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                            <p className="text-4xl font-black text-blue-400 mb-2">{userLevels.level6_10}</p>
                            <p className="text-slate-400 text-sm">Nível 6-10</p>
                            <p className="text-xs text-slate-500 mt-1">Intermediários</p>
                        </div>

                        <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                            <p className="text-4xl font-black text-purple-400 mb-2">{userLevels.level11_20}</p>
                            <p className="text-slate-400 text-sm">Nível 11-20</p>
                            <p className="text-xs text-slate-500 mt-1">Avançados</p>
                        </div>

                        <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                            <p className="text-4xl font-black text-yellow-400 mb-2">{userLevels.level21plus}</p>
                            <p className="text-slate-400 text-sm">Nível 21+</p>
                            <p className="text-xs text-slate-500 mt-1">Experts</p>
                        </div>
                    </div>
                </div>

                {/* Active Users Summary */}
                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <Zap size={24} className="text-yellow-400" />
                        Resumo de Atividade
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-slate-400 text-sm mb-2">DAU (Daily Active Users)</p>
                            <p className="text-5xl font-black text-green-400">{metrics.activeToday}</p>
                            <p className="text-xs text-slate-500 mt-2">{((metrics.activeToday / metrics.totalUsers) * 100).toFixed(1)}% do total</p>
                        </div>

                        <div className="text-center">
                            <p className="text-slate-400 text-sm mb-2">WAU (Weekly Active Users)</p>
                            <p className="text-5xl font-black text-blue-400">{metrics.active7Days}</p>
                            <p className="text-xs text-slate-500 mt-2">{((metrics.active7Days / metrics.totalUsers) * 100).toFixed(1)}% do total</p>
                        </div>

                        <div className="text-center">
                            <p className="text-slate-400 text-sm mb-2">MAU (Monthly Active Users)</p>
                            <p className="text-5xl font-black text-purple-400">{metrics.active30Days}</p>
                            <p className="text-xs text-slate-500 mt-2">{((metrics.active30Days / metrics.totalUsers) * 100).toFixed(1)}% do total</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
