import React, { useState, useEffect } from 'react';
import { Dumbbell, Footprints, Flower, Bike, Swords, Flame, Plus, Timer, BarChart3 } from 'lucide-react';
import LogWorkoutModal from '../components/LogWorkoutModal';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const SPORTS = [
    {
        id: 'gym',
        name: 'Musculação',
        icon: Dumbbell,
        color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        textColor: 'text-blue-500',
        description: 'Levantamento de peso e força'
    },
    {
        id: 'run',
        name: 'Corrida',
        icon: Footprints,
        color: 'bg-gradient-to-br from-orange-400 to-red-500',
        textColor: 'text-orange-500',
        description: 'Corrida de rua ou esteira'
    },
    {
        id: 'yoga',
        name: 'Yoga',
        icon: Flower,
        color: 'bg-gradient-to-br from-emerald-400 to-teal-500',
        textColor: 'text-emerald-500',
        description: 'Flexibilidade e mente'
    },
    {
        id: 'bike',
        name: 'Bicicleta',
        icon: Bike,
        color: 'bg-gradient-to-br from-cyan-400 to-blue-500',
        textColor: 'text-cyan-500',
        description: 'Ciclismo ou ergométrica'
    },
    {
        id: 'fight',
        name: 'Luta',
        icon: Swords,
        color: 'bg-gradient-to-br from-red-500 to-rose-600',
        textColor: 'text-red-500',
        description: 'Boxe, Muay Thai, Jiu-Jitsu'
    },
    {
        id: 'crossfit',
        name: 'Crossfit',
        icon: Flame,
        color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        textColor: 'text-yellow-500',
        description: 'Alta intensidade e funcional'
    }
];

const Workouts = () => {
    const [selectedSport, setSelectedSport] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen pb-32 pt-10 px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Header */}
            <div className="mb-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter mb-2">
                        REGISTRAR TREINO
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Selecione a atividade que você realizou hoje
                    </p>
                </div>

                <div className="flex justify-between items-center bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
                    <div className="text-center flex-1">
                        <div className="flex justify-center mb-3 text-orange-500">
                            <Flame size={28} strokeWidth={2.5} />
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">CALORIES</p>
                        <p className="text-gray-900 dark:text-white font-black text-xl">{userData?.caloriesBurnedToday || 0} <span className="text-xs font-bold text-gray-400">cal</span></p>
                    </div>
                    <div className="w-px h-12 bg-gray-100 dark:bg-gray-800"></div>
                    <div className="text-center flex-1">
                        <div className="flex justify-center mb-3 text-blue-500">
                            <Timer size={28} strokeWidth={2.5} />
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">WORKOUTS</p>
                        <p className="text-gray-900 dark:text-white font-black text-xl">{userData?.workoutsCompleted || 0} <span className="text-xs font-bold text-gray-400">treinos</span></p>
                    </div>
                    <div className="w-px h-12 bg-gray-100 dark:bg-gray-800"></div>
                    <div className="text-center flex-1">
                        <div className="flex justify-center mb-3 text-purple-500">
                            <BarChart3 size={28} strokeWidth={2.5} />
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">LEVEL</p>
                        <p className="text-gray-900 dark:text-white font-black text-xl">{userData?.level || 1}</p>
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
                {SPORTS.map((sport) => (
                    <button
                        key={sport.id}
                        onClick={() => setSelectedSport(sport)}
                        className="relative group overflow-hidden bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 text-left flex flex-col justify-between h-48 active:scale-95"
                    >
                        {/* Background Glow on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${sport.color}`}></div>

                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sport.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <sport.icon size={24} />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:translate-x-1 transition-transform">{sport.name}</h3>
                            <p className="text-[10px] text-gray-400 font-medium leading-tight">{sport.description}</p>
                        </div>

                        <div className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-gray-600`}>
                            <Plus size={20} />
                        </div>
                    </button>
                ))}
            </div>

            {/* Modal */}
            {selectedSport && (
                <LogWorkoutModal
                    sport={selectedSport}
                    onClose={() => setSelectedSport(null)}
                />
            )}
        </div>
    );
};

export default Workouts;
