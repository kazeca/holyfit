import React, { useEffect, useState } from 'react';
import { ArrowLeft, Target, Trophy, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useToast, ToastContainer } from '../components/Toast';
import confetti from 'canvas-confetti';

const MissionsPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toasts, removeToast, success, error } = useToast();

    useEffect(() => {
        fetchMissionsData();
    }, []);

    const fetchMissionsData = async () => {
        if (!auth.currentUser) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching missions:', error);
            setLoading(false);
        }
    };

    const completeMission = async (mission) => {
        if (!auth.currentUser || mission.completed) return;

        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const today = new Date().toDateString();

            // Update based on mission type
            const updates = {};

            if (mission.id === 'daily_workout') {
                updates.lastWorkoutDate = today;
            } else if (mission.id === 'daily_water') {
                updates.hydrationToday = 2000;
            } else if (mission.id === 'daily_challenge') {
                updates.lastChallengeDate = today;
            }

            // Add XP reward
            updates.totalPoints = increment(mission.reward);

            await updateDoc(userRef, updates);

            // Success feedback
            success(`Missao completa! +${mission.reward} XP`);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Refresh data
            fetchMissionsData();
        } catch (err) {
            console.error('Error completing mission:', err);
            error('Erro ao completar missao');
        }
    };

    const dailyMissions = [
        {
            id: 'daily_workout',
            title: 'Complete um Treino',
            description: 'Finalize qualquer treino hoje',
            reward: 50,
            icon: Trophy,
            color: 'orange',
            completed: userData?.lastWorkoutDate === new Date().toDateString()
        },
        {
            id: 'daily_water',
            title: 'Meta de Hidratacao',
            description: 'Beba pelo menos 2L de agua',
            reward: 30,
            icon: Star,
            color: 'blue',
            completed: (userData?.hydrationToday || 0) >= 2000
        },
        {
            id: 'daily_challenge',
            title: 'Desafio do Dia',
            description: 'Complete o desafio relampago',
            reward: 75,
            icon: Target,
            color: 'purple',
            completed: userData?.lastChallengeDate === new Date().toDateString()
        }
    ];

    const weeklyMissions = [
        {
            id: 'weekly_workouts',
            title: 'Treinar 5x na Semana',
            description: 'Complete 5 treinos nesta semana',
            reward: 200,
            icon: Trophy,
            color: 'green',
            progress: userData?.weeklyWorkouts || 0,
            target: 5,
            completed: (userData?.weeklyWorkouts || 0) >= 5
        },
        {
            id: 'weekly_streak',
            title: 'Sequencia de 7 Dias',
            description: 'Mantenha uma sequencia de 7 dias',
            reward: 150,
            icon: Star,
            color: 'pink',
            progress: userData?.currentStreak || 0,
            target: 7,
            completed: (userData?.currentStreak || 0) >= 7
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
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
                <div>
                    <h1 className="text-3xl font-black text-white">Missoes</h1>
                    <p className="text-slate-400 text-sm">Complete desafios e ganhe XP</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-black text-white mb-4">Missoes Diarias</h2>
                <div className="space-y-4">
                    {dailyMissions.map(mission => {
                        const Icon = mission.icon;
                        const isCompleted = mission.completed;
                        return (
                            <div
                                key={mission.id}
                                className={`bg-slate-800 border rounded-3xl p-5 transition-all ${isCompleted
                                    ? 'border-green-500/50 bg-green-500/5'
                                    : 'border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-orange-500/10 shrink-0">
                                        <Icon className="text-orange-500" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-lg mb-1">{mission.title}</h3>
                                        <p className="text-slate-400 text-sm mb-3">{mission.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-400">
                                                +{mission.reward} XP
                                            </span>
                                            {!isCompleted && (
                                                <button
                                                    onClick={() => completeMission(mission)}
                                                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg font-bold text-xs transition-all active:scale-95"
                                                >
                                                    Completar
                                                </button>
                                            )}
                                        </div>
                                        {isCompleted && (
                                            <div className="flex items-center gap-2 text-green-500">
                                                <CheckCircle2 size={20} />
                                                <span className="text-sm font-bold">Concluido!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-black text-white mb-4">Missoes Semanais</h2>
                <div className="space-y-4">
                    {weeklyMissions.map(mission => {
                        const Icon = mission.icon;
                        const isCompleted = mission.completed;
                        const progress = ((mission.progress / mission.target) * 100).toFixed(0);
                        return (
                            <div
                                key={mission.id}
                                className={`bg-slate-800 border rounded-3xl p-5 transition-all ${isCompleted
                                    ? 'border-green-500/50 bg-green-500/5'
                                    : 'border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-green-500/10 shrink-0">
                                        <Icon className="text-green-500" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-lg mb-1">{mission.title}</h3>
                                        <p className="text-slate-400 text-sm mb-3">{mission.description}</p>

                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm font-bold mb-2">
                                                <span className="text-slate-400">{mission.progress}/{mission.target}</span>
                                                <span className="text-green-400">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-500/10 text-green-400">
                                                +{mission.reward} XP
                                            </span>
                                            {isCompleted && (
                                                <div className="flex items-center gap-2 text-green-500">
                                                    <CheckCircle2 size={20} />
                                                    <span className="text-sm font-bold">Concluido!</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4">
                <p className="text-slate-400 text-sm text-center">
                    As missoes resetam diariamente as 00:00. Complete-as para ganhar XP extra!
                </p>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div >
    );
};

export default MissionsPage;
