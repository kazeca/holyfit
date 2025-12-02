import React, { useState } from 'react';
import { X, Clock, Zap, MapPin, Flame, Camera } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import PhotoProofModal from './PhotoProofModal';

const LogWorkoutModal = ({ sport, onClose }) => {
    const [duration, setDuration] = useState(30); // minutes
    const [intensity, setIntensity] = useState('medium'); // low, medium, high
    const [distance, setDistance] = useState(''); // km (optional)
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const { calculateLevel } = useGamification();

    const calculateCalories = () => {
        let met = 1;
        switch (sport.id) {
            case 'gym': met = 6; break;
            case 'run': met = 12; break;
            case 'yoga': met = 4; break;
            case 'bike': met = 8; break;
            case 'fight': met = 12; break;
            case 'crossfit': met = 12; break;
            default: met = 5;
        }

        let multiplier = 1;
        if (intensity === 'low') multiplier = 0.8;
        if (intensity === 'high') multiplier = 1.2;

        return Math.round(met * duration * multiplier);
    };

    const calories = calculateCalories();

    const handleRegisterWorkout = () => {
        // Directly open photo modal
        setShowPhotoModal(true);
    };

    const handlePhotoComplete = () => {
        setShowPhotoModal(false);
        onClose(); // Close main modal after photo is saved
    };

    const handlePhotoCancel = () => {
        setShowPhotoModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sport.color} text-white shadow-lg`}>
                            <sport.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">{sport.name}</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Registrar Atividade</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Inputs */}
                <div className="space-y-6 mb-8">

                    {/* Duration */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
                            <Clock size={16} /> Duração (minutos)
                        </label>
                        <div className="relative">
                            <input
                                type="range"
                                min="5"
                                max="180"
                                step="5"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="mt-2 text-center font-black text-3xl text-gray-900 dark:text-white">
                                {duration} <span className="text-sm text-gray-400 font-bold">min</span>
                            </div>
                        </div>
                    </div>

                    {/* Intensity */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
                            <Zap size={16} /> Intensidade
                        </label>
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                            {['low', 'medium', 'high'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setIntensity(level)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold capitalize transition-all ${intensity === level ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400'}`}
                                >
                                    {level === 'low' ? 'Leve' : level === 'medium' ? 'Moderado' : 'Intenso'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Distance (Optional) */}
                    {(sport.id === 'run' || sport.id === 'bike') && (
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2">
                                <MapPin size={16} /> Distância (km) <span className="text-xs font-normal opacity-50">(Opcional)</span>
                            </label>
                            <input
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="Ex: 5.2"
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    )}
                </div>

                {/* Summary & Action */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6 flex items-center justify-between border border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Estimativa</p>
                        <div className="flex items-center gap-2 text-orange-500">
                            <Flame size={20} fill="currentColor" />
                            <span className="text-2xl font-black">{calories}</span>
                            <span className="text-xs font-bold text-gray-400">kcal</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">XP Ganho</p>
                        <span className="text-2xl font-black text-purple-500">+{calories}</span>
                    </div>
                </div>

                <button
                    onClick={handleRegisterWorkout}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    <Camera size={20} /> REGISTRAR TREINO
                </button>

                {/* Photo Proof Modal */}
                {showPhotoModal && (
                    <PhotoProofModal
                        actionType="workout"
                        data={{
                            workoutName: sport.name,
                            duration,
                            intensity,
                            distance,
                            xp: calories,
                            exercises: []
                        }}
                        userLevel={calculateLevel(0)}
                        onComplete={handlePhotoComplete}
                        onCancel={handlePhotoCancel}
                        autoOpenCamera={true}
                    />
                )}
            </div>
        </div>
    );
};

export default LogWorkoutModal;
