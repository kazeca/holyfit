import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Flame, Trophy, Calendar, Moon, Sun, Crown, X, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../context/ThemeContext';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { BADGES } from '../utils/badges';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                // Fetch User Data
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }

                // Fetch Workouts
                const q = query(
                    collection(db, 'workouts'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const workoutsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setWorkouts(workoutsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pb-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-purple"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 pt-6 px-4 transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">
                    PERFIL
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-neon-purple dark:hover:text-white transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                    <img
                        src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName}&background=random`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-neon-purple object-cover shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border border-gray-700">
                        <div className="bg-neon-fuchsia text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Flame size={12} className="fill-white" />
                            {userData?.currentStreak || 0}
                        </div>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{auth.currentUser?.displayName}</h2>
                <p className="text-gray-400 text-sm mb-4">Membro desde {userData?.createdAt ? format(new Date(userData.createdAt), "MMM yyyy", { locale: ptBR }) : '-'}</p>

                <button
                    onClick={() => navigate('/subscribe')}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
                >
                    <Crown size={16} fill="currentColor" />
                    Assinar Pro
                </button>
            </div>

            {/* Activity Heatmap */}
            <div className="mb-8 bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                    Histórico de Atividades
                </h3>
                <ActivityHeatmap data={workouts.map(w => ({ date: new Date(w.createdAt.seconds * 1000), count: 1 }))} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                    <Trophy className="text-neon-purple mb-2" size={24} />
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{userData?.totalPoints || 0}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Pontos Totais</span>
                </div>
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                    <Calendar className="text-neon-fuchsia mb-2" size={24} />
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{workouts.length}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Treinos</span>
                </div>
            </div>


            {/* Badges */}
            <div className="mb-8">
                <div
                    onClick={() => navigate('/badges')}
                    className="flex items-center justify-between mb-4 cursor-pointer group"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                        Conquistas
                    </h3>
                    <button className="text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors flex items-center gap-1">
                        Ver todos
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {BADGES.map((badge) => {
                        const isUnlocked = userData && badge.condition(userData, workouts);
                        const Icon = badge.icon;

                        return (
                            <div
                                key={badge.id}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${isUnlocked ? 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 shadow-sm' : 'bg-gray-50 dark:bg-white/5 border-transparent opacity-50 grayscale'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isUnlocked ? badge.bgColor : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    <Icon size={20} className={isUnlocked ? badge.color : 'text-gray-400'} />
                                </div>
                                <span className="text-xs font-bold text-center text-gray-900 dark:text-white leading-tight">{badge.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Workouts Grid */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-neon-fuchsia rounded-full"></span>
                Meus Treinos
            </h3>

            {workouts.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800">
                    <p>Nenhum treino registrado ainda.</p>
                    <p className="text-xs mt-2">Faça seu primeiro check-in!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2">
                    {workouts.map((workout) => (
                        <div
                            key={workout.id}
                            onClick={() => setSelectedWorkout(workout)}
                            className="aspect-square relative group overflow-hidden rounded-lg bg-gray-800 cursor-pointer"
                        >
                            <img
                                src={workout.imageUrl}
                                alt="Workout"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                    {workout.createdAt?.seconds ? format(new Date(workout.createdAt.seconds * 1000), "dd/MM", { locale: ptBR }) : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Workout Details Modal */}
            {selectedWorkout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden w-full max-w-md shadow-2xl">
                        <div className="relative h-48">
                            <img src={selectedWorkout.imageUrl} alt="Workout" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <button
                                onClick={() => setSelectedWorkout(null)}
                                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-2xl font-black">{selectedWorkout.title}</h3>
                                <p className="text-gray-300 text-sm">{format(new Date(selectedWorkout.createdAt.seconds * 1000), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2 text-orange-500 font-bold">
                                    <Flame size={20} />
                                    <span>{selectedWorkout.calories} kcal</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-500 font-bold">
                                    <ClockIcon size={20} />
                                    <span>{selectedWorkout.duration} min</span>
                                </div>
                                <div className="flex items-center gap-2 text-purple-500 font-bold">
                                    <Trophy size={20} />
                                    <span>+100 XP</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <h4 className="font-bold text-gray-900 dark:text-white">Exercícios Realizados</h4>
                                {selectedWorkout.exercises?.map((ex, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{ex.name}</span>
                                        <span className="ml-auto text-xs text-gray-400">{ex.sets}x {ex.reps}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-4 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <Share2 size={20} />
                                Compartilhar Conquista
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

export default Profile;
