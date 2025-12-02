import React from 'react';
import { X } from 'lucide-react';

export default function StreakFreezeModal({
    streak,
    freezesAvailable,
    daysMissed = 1,
    onUse,
    onDecline
}) {
    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full text-center animate-in slide-in-from-bottom duration-500">

                {/* Shield Icon with shake animation */}
                <div className="text-9xl mb-4 animate-bounce">
                    🛡️
                </div>

                {/* Warning Title */}
                <h2 className="text-3xl font-black text-white mb-2">
                    Você perdeu {daysMissed} dia{daysMissed > 1 ? 's' : ''}!
                </h2>

                {/* Streak at risk message */}
                <p className="text-gray-400 mb-6 text-lg">
                    Sua sequência de{' '}
                    <span className="text-orange-400 font-black text-2xl">{streak} dias</span>
                    {' '}está em risco.
                    <br />
                    Use um Escudo para protegê-la?
                </p>

                {/* Freezes available */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
                    <div className="text-sm text-gray-400 mb-1">Escudos disponíveis</div>
                    <div className="text-5xl font-black text-white">
                        {freezesAvailable} 🛡️
                    </div>
                </div>

                {/* Use Freeze Button */}
                <button
                    onClick={onUse}
                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-black text-lg mb-3 hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-orange-500/30"
                >
                    Usar Escudo e Salvar Sequência
                </button>

                {/* Decline Button */}
                <button
                    onClick={onDecline}
                    className="w-full py-3 bg-white/5 text-gray-400 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                    Não usar (perderei minha sequência)
                </button>

                {/* Info */}
                <p className="text-xs text-gray-500 mt-4">
                    Você ganha 1 escudo a cada 7 dias de sequência
                </p>
            </div>
        </div>
    );
}
