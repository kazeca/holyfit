import React, { useState } from 'react';
import { X, ChevronRight, Target, Activity, Droplets, Check } from 'lucide-react';
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
            <div className="bg-gray-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-1">Bem-vindo!</h2>
                        <p className="text-sm text-gray-400">Passo {step} de 3</p>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-2 w-8 rounded-full ${s <= step ? 'bg-neon-purple' : 'bg-gray-700'}`} />
                        ))}
                    </div>
                </div>

                {/* Step 1: Goal */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <Target size={48} className="mx-auto text-neon-purple mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Qual seu objetivo?</h3>
                            <p className="text-sm text-gray-400">Vamos personalizar sua experiência</p>
                        </div>

                        <div className="space-y-3">
                            {goals.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setGoalType(goal.id)}
                                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${goalType === goal.id
                                            ? 'border-neon-purple bg-neon-purple/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white mb-1">{goal.label}</p>
                                            <p className="text-xs text-gray-400">{goal.desc}</p>
                                        </div>
                                        {goalType === goal.id && <Check size={20} className="text-neon-purple" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Workout Goal */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <Activity size={48} className="mx-auto text-orange-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Meta de Treinos</h3>
                            <p className="text-sm text-gray-400">Quantos dias por semana?</p>
                        </div>

                        <div>
                            <div className="flex justify-center gap-3 mb-6">
                                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => setWorkoutGoal(days)}
                                        className={`w-12 h-12 rounded-full font-black transition-all ${workoutGoal === days
                                                ? 'bg-orange-500 text-white scale-110'
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
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <Droplets size={48} className="mx-auto text-blue-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Meta de Água</h3>
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
                                <span className="text-5xl font-black text-white">{hydrationGoal}</span>
                                <span className="text-lg font-bold text-gray-500 ml-2">ml</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="flex-1 py-4 bg-white/5 rounded-2xl font-bold text-white hover:bg-white/10 transition-colors"
                        >
                            Voltar
                        </button>
                    )}
                    <button
                        onClick={step === 3 ? handleFinish : () => setStep(step + 1)}
                        disabled={loading}
                        className="flex-1 py-4 bg-gradient-to-r from-neon-purple to-fuchsia-600 rounded-2xl font-black text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {step === 3 ? 'Começar' : 'Próximo'}
                                {step !== 3 && <ChevronRight size={20} />}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
