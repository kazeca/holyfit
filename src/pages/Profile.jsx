import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Flame, Trophy, Calendar, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
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
                <p className="text-gray-400 text-sm">Membro desde {userData?.createdAt ? format(new Date(userData.createdAt), "MMM yyyy", { locale: ptBR }) : '-'}</p>
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
                        <div key={workout.id} className="aspect-square relative group overflow-hidden rounded-lg bg-gray-800">
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
        </div>
    );
};

export default Profile;
