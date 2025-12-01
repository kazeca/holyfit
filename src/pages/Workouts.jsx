import React, { useState } from 'react';
import { Timer, Flame, BarChart3, ChevronRight, CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkoutPlayer from '../components/WorkoutPlayer';

const EXERCISES = [
    {
        id: 1,
        name: 'Glute Bridge',
        duration: '00:15',
        reps: '25 times',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=200&q=80',
        completed: true
    },
    {
        id: 2,
        name: 'Hip Extensions',
        duration: '00:08',
        reps: '12 times',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=200&q=80',
        completed: true
    },
    {
        id: 3,
        name: 'Leg Deadlifts',
        duration: '00:05',
        reps: '4 times',
        image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?auto=format&fit=crop&w=200&q=80',
        completed: false
    },
    {
        id: 4,
        name: 'Jump Squats',
        duration: '00:30',
        reps: '15 times',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=200&q=80',
        completed: false
    }
];

const Workouts = () => {
    const navigate = useNavigate();
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const handleWorkoutClick = () => {
        setSelectedWorkout({
            name: 'Killer Workout',
            durationSeconds: 300,
            exercises: EXERCISES
        });
    };

    return (
        <div className="min-h-screen pb-32 pt-10 px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Header */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">
                        TREINOS
                    </h1>
                    <button
                        onClick={() => navigate('/create-workout')}
                        className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black shadow-lg active:scale-90 transition-transform"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex justify-between items-center bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
                    <div className="text-center flex-1">
                        <div className="flex justify-center mb-3 text-orange-500">
                            <Flame size={28} strokeWidth={2.5} />
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">CALORIES</p>
                        <p className="text-gray-900 dark:text-white font-black text-xl">1,325 <span className="text-xs font-bold text-gray-400">cal</span></p>
                    </div>
                    <div className="w-px h-12 bg-gray-100 dark:bg-gray-800"></div>
                    <div className="text-center flex-1">
                        <div className="flex justify-center mb-3 text-blue-500">
                            <Timer size={28} strokeWidth={2.5} />
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">TIME</p>
                        <p className="text-gray-900 dark:text-white font-black text-xl">47.5 <span className="text-xs font-bold text-gray-400">Min</span></p>
                    </div>
                    <div className="w-px h-12 bg-gray-100 dark:bg-gray-800"></div>
                    <div className="text-center flex-1">
                        <div className="flex justify-center mb-3 text-purple-500">
                            <BarChart3 size={28} strokeWidth={2.5} />
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">LEVEL</p>
                        <p className="text-gray-900 dark:text-white font-black text-xl">Medium</p>
                    </div>
                </div>
            </div>

            {/* Exercise List */}
            <div className="bg-white dark:bg-gray-900 rounded-t-[2.5rem] p-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] min-h-[50vh]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Round 1</h2>
                    <span className="text-rose-400 text-sm font-bold bg-rose-50 px-3 py-1 rounded-full">Legs & Butt</span>
                </div>

                <div className="space-y-8">
                    {EXERCISES.map((exercise) => (
                        <div
                            key={exercise.id}
                            onClick={handleWorkoutClick}
                            className="flex items-center gap-5 group cursor-pointer"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
                                    <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                {exercise.completed && (
                                    <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                                        <CheckCircle2 size={18} className="text-orange-500 fill-orange-100" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{exercise.name}</h3>
                                <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide">
                                    {exercise.duration} <span className="mx-2 text-gray-300">|</span> {exercise.reps}
                                </p>
                            </div>

                            <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedWorkout && (
                <WorkoutPlayer workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
            )}
        </div>
    );
};

export default Workouts;
