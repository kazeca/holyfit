import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Droplets, Flame, Activity, Download, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const ProgressPage = () => {
    const navigate = useNavigate();
    const [workoutData, setWorkoutData] = useState([]);
    const [xpData, setXpData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        weeklyAverage: 0,
        totalWorkouts: 0,
        totalXP: 0,
        comparisonLastWeek: 0
    });

    useEffect(() => {
        fetchProgressData();
    }, []);

    const calculateStats = (workouts, lastWeekWorkouts) => {
        const weeklyAverage = (workouts.length / 7).toFixed(1);
        const totalWorkouts = workouts.length;
        const totalXP = xpData.reduce((sum, xp) => sum + (xp.amount || 0), 0);
        const comparisonLastWeek = totalWorkouts - lastWeekWorkouts.length;

        setStats({ weeklyAverage, totalWorkouts, totalXP, comparisonLastWeek });
    };

    const exportData = () => {
        const csvContent = [
            ['Data', 'Tipo', 'XP', 'Detalhes'],
            ...workoutData.map(w => [
                w.createdAt?.toDate().toLocaleDateString(),
                'Treino',
                w.xpGained || 0,
                w.title || 'Treino'
            ]),
            ...xpData.map(x => [
                x.timestamp?.toDate().toLocaleDateString(),
                x.source || 'XP',
                x.amount || 0,
                x.description || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `holy-fit-progress-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const fetchProgressData = async () => {
        if (!auth.currentUser) return;

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

            // Fetch workouts - remove orderBy to avoid index requirement
            const workoutsRef = collection(db, 'workouts');
            const workoutsQuery = query(
                workoutsRef,
                where('userId', '==', auth.currentUser.uid),
                where('createdAt', '>=', fourteenDaysAgo),
                limit(30)
            );
            const workoutsSnap = await getDocs(workoutsQuery);
            const allWorkouts = workoutsSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

            const workouts = allWorkouts.filter(w => w.createdAt?.toDate() >= sevenDaysAgo).slice(0, 7);
            const lastWeekWorkouts = allWorkouts.filter(w =>
                w.createdAt?.toDate() >= fourteenDaysAgo && w.createdAt?.toDate() < sevenDaysAgo
            );

            setWorkoutData(workouts);

            // Fetch XP history - remove orderBy to avoid index requirement
            const xpRef = collection(db, 'xp_history');
            const xpQuery = query(
                xpRef,
                where('userId', '==', auth.currentUser.uid),
                where('timestamp', '>=', sevenDaysAgo),
                limit(50)
            );
            const xpSnap = await getDocs(xpQuery);
            const xp = xpSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())
                .slice(0, 20);
            setXpData(xp);

            // Calculate statistics
            calculateStats(workouts, lastWeekWorkouts);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching progress data:', error);
            setLoading(false);
        }
    };

    const getWeekdayName = (date) => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        return days[date.getDay()];
    };

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    };

    const getWorkoutsForDay = (date) => {
        return workoutData.filter(workout => {
            const workoutDate = workout.createdAt?.toDate();
            return workoutDate && workoutDate.toDateString() === date.toDateString();
        }).length;
    };

    const getXPForDay = (date) => {
        return xpData
            .filter(xp => {
                const xpDate = xp.timestamp?.toDate();
                return xpDate && xpDate.toDateString() === date.toDateString();
            })
            .reduce((sum, xp) => sum + (xp.amount || 0), 0);
    };

    const last7Days = getLast7Days();
    const maxWorkouts = Math.max(...last7Days.map(getWorkoutsForDay), 1);
    const maxXP = Math.max(...last7Days.map(getXPForDay), 1);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950 font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-black text-white">Progresso</h1>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Activity className="text-cyan-500" size={20} />
                        <span className="text-3xl font-black text-white">{stats.weeklyAverage}</span>
                    </div>
                    <p className="text-slate-400 text-xs">Media treinos/dia</p>
                </div>

                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        {stats.comparisonLastWeek >= 0 ? (
                            <TrendingUp className="text-green-500" size={20} />
                        ) : (
                            <TrendingDown className="text-red-500" size={20} />
                        )}
                        <span className={`text-3xl font-black ${stats.comparisonLastWeek >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stats.comparisonLastWeek >= 0 ? '+' : ''}{stats.comparisonLastWeek}
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs">vs semana passada</p>
                </div>
            </div>

            {/* Export Button */}
            <button
                onClick={exportData}
                className="w-full mb-6 bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl p-4 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
                <Download size={20} />
                Exportar Dados (CSV)
            </button>

            <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-cyan-500/10">
                        <Activity className="text-cyan-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white">Treinos (Ultimos 7 dias)</h2>
                        <p className="text-sm text-slate-400">Total: {workoutData.length} treinos</p>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2 h-48">
                    {last7Days.map((date, index) => {
                        const count = getWorkoutsForDay(date);
                        const height = maxWorkouts > 0 ? (count / maxWorkouts) * 100 : 0;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                                    <div
                                        className={`w-full rounded-t-lg transition-all ${count > 0 ? 'bg-cyan-500 shadow-lg shadow-cyan-500/30' : 'bg-slate-700'
                                            }`}
                                        style={{ height: `${height}%`, minHeight: count > 0 ? '20px' : '4px' }}
                                    >
                                        {count > 0 && (
                                            <p className="text-white text-xs font-bold text-center pt-1">{count}</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">{getWeekdayName(date)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-orange-500/10">
                        <Flame className="text-orange-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white">XP Ganho (Ultimos 7 dias)</h2>
                        <p className="text-sm text-slate-400">Total: {xpData.reduce((sum, xp) => sum + (xp.amount || 0), 0)} XP</p>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2 h-48">
                    {last7Days.map((date, index) => {
                        const xp = getXPForDay(date);
                        const height = maxXP > 0 ? (xp / maxXP) * 100 : 0;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                                    <div
                                        className={`w-full rounded-t-lg transition-all ${xp > 0 ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-slate-700'
                                            }`}
                                        style={{ height: `${height}%`, minHeight: xp > 0 ? '20px' : '4px' }}
                                    >
                                        {xp > 0 && (
                                            <p className="text-white text-xs font-bold text-center pt-1">{xp}</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">{getWeekdayName(date)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6">
                <h2 className="text-lg font-black text-white mb-4">Atividade Recente</h2>
                {workoutData.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Nenhum treino registrado nos ultimos 7 dias.</p>
                ) : (
                    <div className="space-y-3">
                        {workoutData.map(workout => (
                            <div key={workout.id} className="bg-slate-900 rounded-xl p-4 border border-slate-700/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-bold">{workout.workoutName || 'Treino'}</p>
                                        <p className="text-slate-400 text-sm">{workout.exercises?.length || 0} exercicios</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-cyan-400 font-bold">+{workout.xpAwarded || 100} XP</p>
                                        <p className="text-slate-500 text-xs">
                                            {workout.createdAt?.toDate().toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressPage;
