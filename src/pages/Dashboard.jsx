import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { Activity, Droplets, Flame, Zap, Plus, X, Settings, HelpCircle, Crown } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWaterModal, setShowWaterModal] = useState(false); // For adding water (custom amount)
    const [showGoalModal, setShowGoalModal] = useState(false); // For editing hydration goal
    const [showWorkoutGoalModal, setShowWorkoutGoalModal] = useState(false); // For editing workout goal
    const [showInfoModal, setShowInfoModal] = useState(false); // For "How it works"
    const { addXP, calculateLevel } = useGamification();
    const navigate = useNavigate();

    // Local state for goals (could be in Firestore)
    const [hydrationGoal, setHydrationGoal] = useState(2000);
    const [workoutGoal, setWorkoutGoal] = useState(5);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
                if (doc.data().hydrationGoal) setHydrationGoal(doc.data().hydrationGoal);
                if (doc.data().workoutGoal) setWorkoutGoal(doc.data().workoutGoal);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddWater = async (amount, e) => {
        if (e) e.stopPropagation(); // Prevent opening the card modal
        if (!auth.currentUser) return;

        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                hydrationToday: increment(amount)
            });

            // Add XP for water (5 XP per drink)
            await addXP(5, 'water');

            // Close modal if open
            setShowWaterModal(false);
        } catch (error) {
            console.error("Error adding water:", error);
        }
    };

    const saveHydrationGoal = async () => {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { hydrationGoal });
        setShowGoalModal(false);
    };

    const saveWorkoutGoal = async () => {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { workoutGoal });
        setShowWorkoutGoalModal(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;

    const currentLevel = userData?.level || 1;
    const nextLevelXP = currentLevel * 1000;
    const currentXP = userData?.totalPoints || 0;
    const progress = (currentXP % 1000) / 10; // 0-100%

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
            {/* Header */}
            <div className="bg-[#1C1C1E] rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/subscribe')}
                                className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform"
                            >
                                <Crown size={20} fill="currentColor" />
                            </button>
                            <button
                                onClick={() => setShowInfoModal(true)}
                                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <HelpCircle size={20} />
                            </button>
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white font-black">
                                    {currentLevel}
                                </div>
                                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1C1C1E] rounded-full"></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex-1 mr-4">
                            <h1 className="text-3xl font-black text-white tracking-tight mb-3">
                                Hello, {auth.currentUser?.displayName?.split(' ')[0] || 'User'}!
                            </h1>

                            {/* XP Bar */}
                            <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-neon-purple to-neon-fuchsia h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">
                                {currentXP} / {nextLevelXP} XP to Lvl {currentLevel + 1}
                            </p>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-gray-800 overflow-hidden border-2 border-white/10 shadow-lg shrink-0">
                            <img src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName || 'User'}`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Meta Diária (Orange) - Click to Edit Goal */}
                <div
                    onClick={() => setShowWorkoutGoalModal(true)}
                    className="col-span-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] p-5 text-white shadow-[0_10px_30px_rgba(251,146,60,0.4)] relative overflow-hidden flex flex-col justify-between h-48 cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="flex justify-between items-start">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">Meta Semanal</span>
                        <Settings size={16} className="text-white/80 cursor-pointer hover:text-white" onClick={(e) => { e.stopPropagation(); navigate('/settings'); }} />
                    </div>

                    {/* Fake Bar Chart */}
                    <div className="flex items-end gap-1.5 h-16 opacity-80">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className={`w-2 rounded-t-sm ${i < workoutGoal ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/30'}`} style={{ height: `${Math.random() * 50 + 30}%` }}></div>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-4xl font-black tracking-tighter">{workoutGoal}<span className="text-xl align-top font-bold opacity-80">dias</span></h2>
                    </div>
                </div>

                {/* Hidratação (Blue) - Click to Edit Goal, FAB to Add */}
                <div
                    onClick={() => setShowGoalModal(true)}
                    className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] p-5 text-white shadow-[0_10px_30px_rgba(59,130,246,0.4)] relative overflow-hidden flex flex-col justify-between h-48 cursor-pointer active:scale-95 transition-transform group"
                >
                    <div className="flex justify-between items-start">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">Hidratação</span>
                        <Settings size={16} className="text-white/80" />
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/20" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-white" strokeDasharray={175} strokeDashoffset={175 - (175 * ((userData?.hydrationToday || 0) / hydrationGoal))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Droplets size={20} className="fill-white" />
                            </div>
                        </div>

                        {/* FAB Mini for Quick Add */}
                        <button
                            onClick={(e) => handleAddWater(250, e)}
                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform z-20"
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black tracking-tighter">{userData?.hydrationToday || 0}<span className="text-sm font-bold opacity-80">/{hydrationGoal}ml</span></h2>
                    </div>
                </div>

                {/* Desafio Diário (Dark) */}
                <div className="col-span-2 bg-[#1C1C1E] rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden h-48 flex flex-col justify-end group">
                    <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80" alt="Workout" className="absolute top-0 right-0 w-3/5 h-full object-cover opacity-60 mask-image-gradient" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

                    <div className="relative z-10 mb-2">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <ClockIcon size={12} /> {userData?.workoutsCompleted || 0} treinos
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <Flame size={12} /> {userData?.caloriesBurnedToday || 0}kcal
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold leading-tight mb-1">Hoje</h3>
                        <p className="text-gray-400 text-sm">Resumo da Atividade</p>
                    </div>

                    <button className="absolute bottom-6 right-6 w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Info Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Como Funciona?</h3>
                            <button onClick={() => setShowInfoModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center font-bold">1</div>
                                <p className="text-gray-600 dark:text-gray-300 font-medium">Treine e complete desafios.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center font-bold">2</div>
                                <p className="text-gray-600 dark:text-gray-300 font-medium">Beba água e bata a meta.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center font-bold">3</div>
                                <p className="text-gray-600 dark:text-gray-300 font-medium">Ganhe XP e suba no Ranking!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hydration Goal Modal */}
            {showGoalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Meta de Hidratação</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-500 mb-2">Meta Diária (ml)</label>
                            <input
                                type="number"
                                value={hydrationGoal}
                                onChange={(e) => setHydrationGoal(Number(e.target.value))}
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowGoalModal(false)} className="flex-1 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-800">Cancelar</button>
                            <button onClick={saveHydrationGoal} className="flex-1 py-4 rounded-xl font-bold text-white bg-blue-500 shadow-lg shadow-blue-500/30">Salvar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Workout Goal Modal */}
            {showWorkoutGoalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Meta de Treinos</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-500 mb-2">Dias por Semana</label>
                            <div className="flex justify-between gap-2">
                                {[3, 4, 5, 6, 7].map(days => (
                                    <button
                                        key={days}
                                        onClick={() => setWorkoutGoal(days)}
                                        className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all ${workoutGoal === days ? 'bg-orange-500 text-white shadow-lg scale-110' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
                                    >
                                        {days}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowWorkoutGoalModal(false)} className="flex-1 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-800">Cancelar</button>
                            <button onClick={saveWorkoutGoal} className="flex-1 py-4 rounded-xl font-bold text-white bg-orange-500 shadow-lg shadow-orange-500/30">Salvar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Water Modal (Quick Add) */}
            {showWaterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Adicionar Água</h3>
                            <button onClick={() => setShowWaterModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={(e) => handleAddWater(250, e)}
                                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-100 dark:border-blue-800 hover:border-blue-500 transition-colors"
                            >
                                <Droplets size={24} className="text-blue-500 mb-2" />
                                <span className="font-bold text-blue-900 dark:text-blue-100">250ml</span>
                                <span className="text-xs text-blue-400">+5 XP</span>
                            </button>
                            <button
                                onClick={(e) => handleAddWater(500, e)}
                                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-100 dark:border-blue-800 hover:border-blue-500 transition-colors"
                            >
                                <Droplets size={32} className="text-blue-500 mb-2" />
                                <span className="font-bold text-blue-900 dark:text-blue-100">500ml</span>
                                <span className="text-xs text-blue-400">+5 XP</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ClockIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default Dashboard;
