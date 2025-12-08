import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RotateCcw, Loader2 } from 'lucide-react';
import { validateChallengePhoto } from '../utils/challengeValidation';
import { completeChallengeWithPhoto } from '../utils/challengeService';
import { completeMealWithPhoto } from '../utils/mealService';
import confetti from 'canvas-confetti';
import { auth } from '../firebase';

const PhotoProofModal = ({ actionType = 'challenge', data, userLevel, onComplete, onCancel, autoOpenCamera = false }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Dynamic content based on action type
    const getContent = () => {
        if (actionType === 'workout') {
            return {
                title: 'Comprovar Treino',
                description: data.workoutName || 'Treino completado',
                xp: data.xp || 100,
                instruction: 'Tire uma foto do seu treino para comprovar!',
                hint: '📸 Mostre você na academia ou fazendo exercício',
                successTitle: 'Treino Registrado!',
                gradient: 'from-orange-500 to-red-600',
                confettiColors: ['#FF6B35', '#F7931E', '#FDCA40']
            };
        }
        if (actionType === 'meal') {
            return {
                title: 'Fotografar Prato',
                description: `${data.mealType} - ${data.totalCalories} kcal`,
                xp: Math.round(data.totalCalories / 10), // 10 calorias = 1 XP
                instruction: 'Tire uma foto do seu prato!',
                hint: '📸 Mostre todos os alimentos da refeição',
                successTitle: 'Refeição Registrada!',
                gradient: 'from-green-600 to-emerald-600',
                confettiColors: ['#10B981', '#34D399', '#6EE7B7']
            };
        }
        // Default: challenge
        return {
            title: 'Comprovar Desafio',
            description: data.task || data.description,
            xp: data.reward || data.xp,
            instruction: 'Tire uma foto comprovando que você completou o desafio!',
            hint: '📸 A foto será enviada para o feed',
            successTitle: 'Desafio Completado!',
            gradient: 'from-purple-600 to-pink-600',
            confettiColors: ['#A855F7', '#EC4899', '#F472B6']
        };
    };

    const content = getContent();

    // Auto-open camera if requested
    useEffect(() => {
        if (autoOpenCamera && fileInputRef.current && !previewUrl) {
            // Small delay to ensure modal is rendered
            const timer = setTimeout(() => {
                fileInputRef.current?.click();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [autoOpenCamera, previewUrl]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
            setSelectedFile(file);
            setError(null);
        };
        reader.readAsDataURL(file);
    };

    const handleRetake = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleOpenCamera = () => {
        // Directly trigger file input - browser will handle camera permission
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    const handleConfirm = async () => {
        if (!selectedFile || !auth.currentUser) {
            console.error('❌ No file or user:', { selectedFile: !!selectedFile, user: !!auth.currentUser });
            return;
        }

        console.log('🔵 [PHOTO UPLOAD] Starting...', {
            actionType,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            userId: auth.currentUser.uid
        });

        setLoading(true);
        setError(null);

        // Safety timeout - if upload takes more than 30s, show error
        const timeoutId = setTimeout(() => {
            console.error('⏰ [PHOTO UPLOAD] TIMEOUT after 30s');
            setLoading(false);
            setError('Upload demorou muito. Tente novamente com uma foto menor.');
        }, 30000);

        try {
            // Validate photo
            console.log('🔵 [PHOTO UPLOAD] Step 1: Validating photo...');
            const validation = await validateChallengePhoto(selectedFile, auth.currentUser.uid);
            console.log('✅ [PHOTO UPLOAD] Validation result:', validation);

            if (!validation.valid) {
                console.error('❌ [PHOTO UPLOAD] Validation failed:', validation.error);
                clearTimeout(timeoutId);
                setError(validation.error);
                setLoading(false);
                return;
            }

            // Complete action based on type
            console.log('🔵 [PHOTO UPLOAD] Step 2: Completing action...', { actionType });

            if (actionType === 'workout') {
                console.log('🔵 [PHOTO UPLOAD] Importing completeWorkoutWithPhoto...');
                const { completeWorkoutWithPhoto } = await import('../utils/challengeService');
                console.log('🔵 [PHOTO UPLOAD] Calling completeWorkoutWithPhoto...');
                const result = await completeWorkoutWithPhoto(selectedFile, {
                    ...data,
                    userLevel
                }, validation.photoHash);
                console.log('✅ [PHOTO UPLOAD] Workout completed:', result);
            } else if (actionType === 'meal') {
                console.log('🔵 [PHOTO UPLOAD] Completing meal...');
                await completeMealWithPhoto(selectedFile, {
                    ...data,
                    userLevel
                }, validation.photoHash);
                console.log('✅ [PHOTO UPLOAD] Meal completed');
            } else {
                // Challenge
                console.log('🔵 [PHOTO UPLOAD] Completing challenge...');
                await completeChallengeWithPhoto(selectedFile, {
                    ...data,
                    userLevel
                }, validation.photoHash);
                console.log('✅ [PHOTO UPLOAD] Challenge completed');
            }

            clearTimeout(timeoutId);

            // Success!
            console.log('✅ [PHOTO UPLOAD] SUCCESS! Setting success state...');
            setSuccess(true);
            setLoading(false);
            triggerSuccessConfetti();

            // Close after 3 seconds
            setTimeout(() => {
                console.log('🔵 [PHOTO UPLOAD] Closing modal...');
                onComplete();
            }, 3000);

        } catch (err) {
            clearTimeout(timeoutId);
            console.error('❌ [PHOTO UPLOAD] ERROR:', {
                message: err.message,
                code: err.code,
                stack: err.stack,
                fullError: err
            });
            setError(err.message || `Erro ao completar ${actionType === 'workout' ? 'treino' : 'desafio'}. Tente novamente.`);
            setLoading(false);
        }
    };

    const triggerSuccessConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: actionType === 'workout'
                    ? ['#F97316', '#EA580C', '#FCD34D']
                    : ['#A855F7', '#D946EF', '#FBC02D', '#F97316']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: actionType === 'workout'
                    ? ['#F97316', '#EA580C', '#FCD34D']
                    : ['#A855F7', '#D946EF', '#FBC02D', '#F97316']
            });
        }, 250);
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className={`bg-gradient-to-br ${content.gradient} rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-300`}>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Check size={48} className="text-yellow-900" strokeWidth={4} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">{content.successTitle}</h2>
                    <p className="text-white/90 text-lg font-medium mb-4">
                        Você ganhou <span className="font-black text-yellow-300">+{content.xp} XP</span>
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-white/80 text-sm">
                            ✨ Seu progresso foi salvo e compartilhado no feed!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header */}
                <div className={`bg-gradient-to-r ${content.gradient} p-6 text-white`}>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-black">{content.title}</h3>
                        <button
                            onClick={onCancel}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            disabled={loading}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-white/90 text-sm font-medium">{content.description}</p>
                    <span className="inline-block mt-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black">
                        +{content.xp} XP
                    </span>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!previewUrl ? (
                        // Camera Input
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${actionType === 'workout' ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-purple-100 dark:bg-purple-900/20'} flex items-center justify-center`}>
                                    <Camera size={48} className={actionType === 'workout' ? 'text-orange-600' : 'text-purple-600'} />
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                                    {content.instruction}                                </p>
                                <p className="text-gray-400 text-sm">
                                    {content.hint}
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="proof-photo-input"
                            />

                            <button
                                onClick={handleOpenCamera}
                                className={`w-full py-4 bg-gradient-to-r ${content.gradient} text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg ${actionType === 'workout' ? 'shadow-orange-500/30' : 'shadow-purple-500/30'}`}
                            >
                                <Camera size={24} className="inline mr-2" />
                                Abrir Câmera
                            </button>

                            <p className="text-center text-gray-400 text-xs">
                                ⚠️ Não use fotos antigas - tire uma nova agora!
                            </p>
                        </div>
                    ) : (
                        // Preview
                        <div className="space-y-4">
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-64 object-cover"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                                    <p className="text-red-600 dark:text-red-400 text-sm font-bold">
                                        ⚠️ {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleRetake}
                                    disabled={loading}
                                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    <RotateCcw size={20} className="inline mr-2" />
                                    Tirar Novamente
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className={`flex-1 py-4 bg-gradient-to-r ${content.gradient} text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg ${actionType === 'workout' ? 'shadow-orange-500/30' : 'shadow-purple-500/30'} disabled:opacity-50 disabled:hover:scale-100`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="inline mr-2 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={20} className="inline mr-2" />
                                            Confirmar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhotoProofModal;
