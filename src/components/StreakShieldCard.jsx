import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { Shield, Zap, AlertCircle } from 'lucide-react';
import { purchaseStreakShield, getShieldInfo } from '../utils/streakShield';

const StreakShieldCard = ({ userData, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [shieldInfo, setShieldInfo] = useState(null);

    useEffect(() => {
        if (userData) {
            setShieldInfo(getShieldInfo(userData));
        }
    }, [userData]);

    const handlePurchase = async () => {
        if (!auth.currentUser) return;

        setLoading(true);
        setMessage('');

        const result = await purchaseStreakShield(auth.currentUser.uid);

        setMessage(result.message);
        setLoading(false);

        if (result.success && onUpdate) {
            // Refresh user data
            setTimeout(() => onUpdate(), 500);
        }
    };

    if (!shieldInfo) return null;

    const { shields, isProtected, protectedUntil, canPurchase } = shieldInfo;

    return (
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-blue-900/30 p-6 rounded-3xl border-2 border-blue-200 dark:border-blue-700 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Shield size={28} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-gray-900 dark:text-white">Escudo de Streak</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Proteja sua sequência</p>
                    </div>
                </div>

                {/* Shield Counter */}
                <div className="bg-white dark:bg-gray-800 px-5 py-2.5 rounded-full border-2 border-blue-400 dark:border-blue-600 shadow-md">
                    <span className="font-black text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">{shields}</span>
                    <span className="text-base ml-1">🛡️</span>
                </div>
            </div>

            {/* Status */}
            {isProtected && protectedUntil && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-xl border border-green-300 dark:border-green-700">
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-green-600 dark:text-green-400" />
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                            ✅ Streak Protegida até {new Date(protectedUntil).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            )}

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Use um escudo para proteger sua streak por 24 horas. Se você esquecer de treinar, o escudo será consumido automaticamente!
            </p>

            {/* Benefits */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Proteção automática de 24h</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Consumo automático ao esquecer treino</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Mantenha suas conquistas seguras</span>
                </div>
            </div>

            {/* Purchase Button */}
            <button
                onClick={handlePurchase}
                disabled={loading || !canPurchase}
                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${canPurchase
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 active:scale-95'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    }`}
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                        <Shield size={20} />
                        <span>Comprar Escudo</span>
                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                            <Zap size={14} fill="currentColor" />
                            <span className="text-sm">500</span>
                        </div>
                    </>
                )}
            </button>

            {/* Message */}
            {message && (
                <div className={`mt-3 p-3 rounded-xl text-sm font-medium text-center ${message.includes('sucesso') || message.includes('adquirido')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                    {message}
                </div>
            )}

            {/* Warning */}
            {!canPurchase && (
                <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-start gap-2">
                    <AlertCircle size={16} className="text-orange-600 dark:text-orange-400 mt-0.5" />
                    <p className="text-xs text-orange-700 dark:text-orange-400">
                        Você precisa de 500 pontos para comprar um escudo. Continue treinando para ganhar mais XP!
                    </p>
                </div>
            )}
        </div>
    );
};

export default StreakShieldCard;
