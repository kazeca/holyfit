import React, { useState } from 'react';
import { X, ChevronLeft, Clock, Zap, MapPin, Flame, Camera, Dumbbell, Footprints, Flower, Bike, Swords, Waves } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import PhotoProofModal from './PhotoProofModal';

const SPORTS = [
    {
        id: 'gym',
        name: 'Musculação',
        icon: Dumbbell,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80',
        color: 'border-blue-500'
    },
    {
        id: 'run',
        name: 'Corrida',
        icon: Footprints,
        image: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=500&q=80',
        color: 'border-orange-500'
    },
    {
        id: 'yoga',
        name: 'Yoga',
        icon: Flower,
        image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=500&q=80',
        color: 'border-emerald-500'
    },
    {
        id: 'bike',
        name: 'Bicicleta',
        icon: Bike,
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=500&q=80',
        color: 'border-cyan-500'
    },
    {
        id: 'fight',
        name: 'Luta',
        icon: Swords,
        image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=500&q=80',
        color: 'border-red-500'
    },
    {
        id: 'crossfit',
        name: 'Crossfit',
        icon: Flame,
        image: 'https://images.unsplash.com/photo-1517963879466-e825c2cbd9ae?auto=format&fit=crop&w=500&q=80',
        color: 'border-yellow-500'
    },
    {
        id: 'swim',
        name: 'Natação',
        icon: Waves,
        image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=500&q=80',
        color: 'border-sky-500'
    }
];

const NewWorkoutModal = ({ onClose, onSaveSuccess }) => {
    const [step, setStep] = useState(1); // 1: Select Sport, 2: Log Details
    const [selectedSport, setSelectedSport] = useState(null);
    const [duration, setDuration] = useState(30);
    const [intensity, setIntensity] = useState('medium');
    const [distance, setDistance] = useState('');
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const { calculateLevel } = useGamification();

    const handleSportSelect = (sport) => {
        setSelectedSport(sport);
        setStep(2);
    };

    const calculateCalories = () => {
        if (!selectedSport) return 0;

        // Average calories per minute for women (~60-65kg)
        const caloriesPerMinute = {
            gym: 4.5,
            run: 10,
            yoga: 3,
            bike: 7,
            fight: 9,
            crossfit: 11,
            swim: 8
        };

        // Average calories per km for women
        const caloriesPerKm = {
            run: 60,
            bike: 25,
            swim: 200 // Estimativa alta por ser muito denso
        };

        let baseCalories = 0;

        // Prioritize distance calculation for Run/Bike if distance is provided
        if (distance && Number(distance) > 0 && (selectedSport.id === 'run' || selectedSport.id === 'bike')) {
            baseCalories = Number(distance) * (caloriesPerKm[selectedSport.id] || 0);
        } else {
            // Fallback to time-based calculation
            baseCalories = duration * (caloriesPerMinute[selectedSport.id] || 5);
        }

        let multiplier = 1;
        if (intensity === 'low') multiplier = 0.8;
        if (intensity === 'high') multiplier = 1.2;

        return Math.round(baseCalories * multiplier);
    };

    const calories = calculateCalories();

    const handleRegisterWorkout = () => {
        // Open photo modal
        setShowPhotoModal(true);
    };

    const handlePhotoComplete = () => {
        setShowPhotoModal(false);
        onSaveSuccess();
        onClose();
    };

    const handlePhotoCancel = () => {
        setShowPhotoModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                {step === 2 ? (
                    <button onClick={() => setStep(1)} className="p-2 bg-white/10 rounded-full text-white">
                        <ChevronLeft size={24} />
                    </button>
                ) : (
                    <div className="w-10" /> // Spacer
                )}
                <h2 className="text-xl font-black text-white uppercase tracking-wider">
                    {step === 1 ? 'Escolha o Esporte' : selectedSport?.name}
                </h2>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
                    <X size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {step === 1 ? (
                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {SPORTS.map((sport) => (
                            <button
                                key={sport.id}
                                onClick={() => handleSportSelect(sport)}
                                className="relative aspect-[4/5] rounded-3xl overflow-hidden group shadow-lg"
                            >
                                <img src={sport.image} alt={sport.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                                    <sport.icon size={20} />
                                </div>

                                <div className="absolute bottom-4 left-4 text-left">
                                    <h3 className="text-xl font-bold text-white leading-none">{sport.name}</h3>
                                </div>

                                <div className={`absolute inset-0 border-2 ${sport.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none`} />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-md mx-auto space-y-8 animate-in slide-in-from-right duration-300">
                        {/* Duration */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-4">
                                <Clock size={18} className="text-neon-purple" /> DURAÇÃO
                            </label>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="5"
                                    max="180"
                                    step="5"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                                />
                                <div className="mt-4 text-center">
                                    <span className="text-5xl font-black text-white">{duration}</span>
                                    <span className="text-lg font-bold text-gray-500 ml-2">min</span>
                                </div>
                            </div>
                        </div>

                        {/* Intensity */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-4">
                                <Zap size={18} className="text-yellow-400" /> INTENSIDADE
                            </label>
                            <div className="flex bg-gray-800 p-1 rounded-2xl">
                                {['low', 'medium', 'high'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setIntensity(level)}
                                        className={`flex-1 py-4 rounded-xl text-sm font-bold capitalize transition-all ${intensity === level ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}
                                    >
                                        {level === 'low' ? 'Leve' : level === 'medium' ? 'Moderada' : 'Alta'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Distance */}
                        {(selectedSport?.id === 'run' || selectedSport?.id === 'bike') && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-4">
                                    <MapPin size={18} className="text-blue-400" /> DISTÂNCIA (KM)
                                </label>
                                <input
                                    type="number"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-gray-800 rounded-2xl p-6 text-3xl font-black text-white text-center focus:ring-2 focus:ring-neon-purple outline-none placeholder-gray-600"
                                />
                            </div>
                        )}

                        {/* Summary */}
                        <div className="bg-gray-800/50 rounded-3xl p-6 flex items-center justify-between border border-white/5">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Queima Estimada</p>
                                <div className="flex items-center gap-2 text-orange-500">
                                    <Flame size={24} fill="currentColor" />
                                    <span className="text-3xl font-black text-white">{calories}</span>
                                    <span className="text-sm font-bold text-gray-500">kcal</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRegisterWorkout}
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-black text-lg shadow-[0_10px_40px_-10px_rgba(168,85,247,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-3"
                        >
                            <Camera size={20} /> REGISTRAR TREINO
                        </button>

                        {/* Photo Proof Modal */}
                        {showPhotoModal && (
                            <PhotoProofModal
                                actionType="workout"
                                data={{
                                    workoutName: selectedSport.name,
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
                )}
            </div>
        </div>
    );
};

export default NewWorkoutModal;
