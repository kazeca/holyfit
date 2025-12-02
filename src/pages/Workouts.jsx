import React, { useState, useEffect } from 'react';
import { Plus, Flame, Timer, BarChart3 } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, onSnapshot, collection, query, where, orderBy, getDocs, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { startOfDay, endOfDay } from 'date-fns';
import WeekCalendar from '../components/WeekCalendar';
import ActivityCard from '../components/ActivityCard';
import NewWorkoutModal from '../components/NewWorkoutModal';

const Workouts = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showNewWorkoutModal, setShowNewWorkoutModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [dailyWorkouts, setDailyWorkouts] = useState([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(false);

    // Fetch User Data (Stats)
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            if (doc.exists()) setUserData(doc.data());
        });
        return () => unsubscribe();
    }, []);

    // Fetch Workouts for Selected Date
    const fetchWorkouts = async (date) => {
        if (!auth.currentUser) return;
        setLoadingWorkouts(true);
        try {
            // Removed orderBy to avoid missing index error. Sorting client-side.
            const q = query(
                collection(db, 'workouts'),
                where('userId', '==', auth.currentUser.uid)
            );

            const snapshot = await getDocs(q);
            const workouts = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(w => {
                    const wDate = new Date(w.date);
                    return wDate >= startOfDay(date) && wDate <= endOfDay(date);
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort desc

            setDailyWorkouts(workouts);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        } finally {
            setLoadingWorkouts(false);
        }
    };

    useEffect(() => {
        fetchWorkouts(selectedDate);
    }, [selectedDate]);

    const handleDeleteWorkout = async (workout) => {
        if (!window.confirm("Tem certeza que deseja excluir este treino?")) return;
        if (!auth.currentUser) return;

        try {
            // 1. Delete workout doc
            await deleteDoc(doc(db, 'workouts', workout.id));

            // 2. Revert user stats
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                totalPoints: increment(-workout.calories),
                caloriesBurnedToday: increment(-workout.calories),
                workoutsCompleted: increment(-1)
            });

            // 3. Refresh list
            fetchWorkouts(selectedDate);
        } catch (error) {
            console.error("Error deleting workout:", error);
            alert("Erro ao excluir treino.");
        }
    };

    return (
        <div className="min-h-screen pb-32 pt-6 bg-gray-950 transition-colors duration-300">

            {/* Header / Stats */}
            <div className="px-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter">
                        MEUS TREINOS
                    </h1>
                </div>

                {/* Mini Stats Row */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[100px] flex-1">
                        <div className="text-orange-500 mb-1"><Flame size={20} /></div>
                        <p className="text-2xl font-black text-white">{userData?.caloriesBurnedToday || 0}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Kcal Hoje</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[100px] flex-1">
                        <div className="text-blue-500 mb-1"><Timer size={20} /></div>
                        <p className="text-2xl font-black text-white">{userData?.workoutsCompleted || 0}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Treinos</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[100px] flex-1">
                        <div className="text-purple-500 mb-1"><BarChart3 size={20} /></div>
                        <p className="text-2xl font-black text-white">{userData?.level || 1}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Nível</p>
                    </div>
                </div>
            </div>

            {/* Weekly Calendar */}
            <div className="mb-6">
                <WeekCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>

            {/* Daily List */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-bold text-lg">Atividades do Dia</h2>
                    <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-lg">
                        {dailyWorkouts.length} treinos
                    </span>
                </div>

                {loadingWorkouts ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
                    </div>
                ) : dailyWorkouts.length > 0 ? (
                    <div className="space-y-3 pb-24">
                        {dailyWorkouts.map(workout => (
                            <ActivityCard
                                key={workout.id}
                                workout={workout}
                                onDelete={handleDeleteWorkout}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        <p className="text-gray-500 font-medium mb-2">Nenhum treino registrado.</p>
                        <p className="text-sm text-gray-600">Que tal começar agora?</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => setShowNewWorkoutModal(true)}
                className="fixed bottom-24 right-6 w-16 h-16 bg-neon-purple hover:bg-fuchsia-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-110 active:scale-95 transition-all z-40"
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>

            {/* Modal */}
            {showNewWorkoutModal && (
                <NewWorkoutModal
                    onClose={() => setShowNewWorkoutModal(false)}
                    onSaveSuccess={() => fetchWorkouts(selectedDate)}
                />
            )}
        </div>
    );
};

export default Workouts;
