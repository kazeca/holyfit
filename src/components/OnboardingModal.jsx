import React, { useState } from 'react';
import { X, ChevronRight, Target, Activity, Droplets, Check, ArrowRight } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const OnboardingModal = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [goalType, setGoalType] = useState('health');
    const [workoutGoal, setWorkoutGoal] = useState(3);
    const [hydrationGoal, setHydrationGoal] = useState(2000);
    const [loading, setLoading] = useState(false);

    const goals = [
        { id: 'muscle', label: '💪 Ganhar Massa', desc: 'Foco em hipertrofia e força' },
        { id: 'lose', label: '🔥 Secar', desc: 'Queimar gordura e definir' },
        { id: 'health', label: '🧘 Saúde', desc: 'Bem-estar e qualidade de vida' }
    ];

    const handleFinish = async () => {
        if (!auth.currentUser) return;
        setLoading(true);

        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                goalType,
                workoutGoal,
                hydrationGoal,
                onboardingCompleted: true
            });
            onComplete();
        } catch (error) {
            console.error("Error saving onboarding:", error);
            alert("Erro ao salvar preferências. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-gray-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fuchsia-600/20 rounded-full blur-3xl" />

                {/* Header */}
                <div className="relative z-10 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-5xl font-black mb-2 bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                                Bem-vindo!
                            </h2>
                            <p className="text-sm text-gray-400 opacity-50">Passo {step} de 3</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-600 transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step 1: Goal */}
                {step === 1 && (
                    <div className="space-y-6 relative z-10">
                        <div className="text-center mb-6">
                            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse">
                                <Target size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Qual seu objetivo?</h3>
                            <p className="text-sm text-gray-400">Vamos personalizar sua experiência</p>
                        </div>

                        <div className="space-y-3">
                            {goals.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setGoalType(goal.id)}
                                    className={`w-full p-5 rounded-2xl text-left transition-all duration-300 active:scale-95 ${goalType === goal.id
                                            ? 'bg-gradient-to-br from-purple-600 to-fuchsia-600 border-2 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)]'
                                            : 'bg-white/5 border border-white/10 opacity-60 hover:opacity-80 hover:border-purple-500/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`font-bold text-white mb-1 ${goalType === goal.id ? 'text-xl' : 'text-lg'}`}>
                                                {goal.label}
                                            </p>
                                            <p className="text-xs text-gray-300">{goal.desc}</p>
                                        </div>
                                        {goalType === goal.id && (
                                            <Check size={24} className="text-white animate-in zoom-in duration-200" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Workout Goal */}
                {step === 2 && (
                    <div className="space-y-6 relative z-10">
                        <div className="text-center mb-6">
                            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-pulse">
                                <Activity size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Meta de Treinos</h3>
                            <p className="text-sm text-gray-400">Quantos dias por semana?</p>
                        </div>

                        <div>
                            <div className="flex justify-center gap-3 mb-6">
                                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => setWorkoutGoal(days)}
                                        className={`w-12 h-12 rounded-full font-black transition-all duration-300 active:scale-95 ${workoutGoal === days
                                                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white scale-110 shadow-[0_0_20px_rgba(249,115,22,0.7)]'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {days}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-500">
                                {workoutGoal} {workoutGoal === 1 ? 'dia' : 'dias'} por semana
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 3: Hydration Goal */}
                {step === 3 && (
                    <div className="space-y-6 relative z-10">
                        <div className="text-center mb-6">
                            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse">
                                <Droplets size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Meta de Água</h3>
                            <p className="text-sm text-gray-400">Quanto você quer beber por dia?</p>
                        </div>

                        <div>
                            <input
                                type="range"
                                min="1000"
                                max="4000"
                                step="500"
                                value={hydrationGoal}
                                onChange={(e) => setHydrationGoal(Number(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="text-center mt-6">
                                <span className="text-6xl font-black text-white">{hydrationGoal}</span>
                                <span className="text-lg font-bold text-gray-500 ml-2">ml</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8 relative z-10">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="flex-1 py-4 bg-white/5 rounded-2xl font-bold text-white hover:bg-white/10 transition-all duration-300 active:scale-95"
                        >
                            Voltar
                        </button>
                    )}
                    <button
                        onClick={step === 3 ? handleFinish : () => setStep(step + 1)}
                        disabled={loading}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl font-black text-white hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {step === 3 ? 'Começar' : 'Próximo'}
                                {step !== 3 && <ArrowRight size={20} className="animate-pulse" />}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
