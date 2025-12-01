import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, Timer } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';

const WorkoutPlayer = ({ workout, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(workout.durationSeconds || 300); // Default 5 min
    const [isActive, setIsActive] = useState(false);
    const [completedExercises, setCompletedExercises] = useState([]);
    const { addXP } = useGamification();
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleExercise = (id) => {
        if (completedExercises.includes(id)) {
            setCompletedExercises(completedExercises.filter(exId => exId !== id));
        } else {
            setCompletedExercises([...completedExercises, id]);
        }
    };

    const handleFinish = async () => {
        await addXP(100, 'workout');
        setIsFinished(true);
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    if (isFinished) {
        return (
            <div className="fixed inset-0 z-50 bg-neon-purple flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-black mb-2">TREINO CONCLUÍDO!</h2>
                <p className="text-xl font-bold opacity-80">+100 XP</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{workout.name}</h2>
                    <p className="text-xs text-gray-400 font-bold tracking-widest">WORKOUT PLAYER</p>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
                    <X size={24} />
                </button>
            </div>

            {/* Timer */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-fuchsia/10 rounded-b-[3rem]"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-8xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter mb-8">
                        {formatTime(timeLeft)}
                    </div>

                    <button
                        onClick={toggleTimer}
                        className="w-20 h-20 bg-neon-purple text-white rounded-full flex items-center justify-center shadow-xl shadow-neon-purple/40 hover:scale-105 transition-transform active:scale-95"
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>
                </div>
            </div>

            {/* Exercises Checklist */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-t-[2.5rem] p-8 overflow-y-auto shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Exercícios</h3>
                <div className="space-y-4 mb-20">
                    {workout.exercises?.map((ex) => (
                        <div
                            key={ex.id}
                            onClick={() => toggleExercise(ex.id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${completedExercises.includes(ex.id) ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-white dark:bg-gray-900 border-transparent'}`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${completedExercises.includes(ex.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                {completedExercises.includes(ex.id) && <CheckCircle2 size={16} className="text-white" />}
                            </div>
                            <div>
                                <h4 className={`font-bold ${completedExercises.includes(ex.id) ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{ex.name}</h4>
                                <p className="text-xs text-gray-400">{ex.reps}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Finish Button */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900">
                <button
                    onClick={handleFinish}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                    FINALIZAR TREINO
                </button>
            </div>
        </div>
    );
};

export default WorkoutPlayer;
