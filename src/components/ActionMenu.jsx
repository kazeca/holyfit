import React from 'react';
import { X, Dumbbell, Apple, Droplet, Zap, Camera, Pill } from 'lucide-react';

const ACTIONS = [
    {
        id: 'workout',
        icon: Dumbbell,
        label: 'Registrar Treino',
        gradient: 'from-orange-500 to-red-600',
        available: true
    },
    {
        id: 'meal',
        icon: Apple,
        label: 'Registrar Refeição',
        gradient: 'from-green-500 to-emerald-500',
        available: true
    },
    {
        id: 'water',
        icon: Droplet,
        label: 'Adicionar Água',
        gradient: 'from-blue-500 to-cyan-500',
        available: true
    },
    {
        id: 'challenge',
        icon: Zap,
        label: 'Aceitar Desafio',
        gradient: 'from-yellow-500 to-amber-500',
        available: false
    },
    {
        id: 'checkin',
        icon: Camera,
        label: 'Check-in Livre',
        gradient: 'from-pink-500 to-rose-500',
        available: false
    },
    {
        id: 'supplement',
        icon: Pill,
        label: 'Suplementos',
        gradient: 'from-purple-500 to-violet-500',
        available: false
    }
];

export default function ActionMenu({ onClose, onActionSelect }) {
    const handleActionClick = (actionId) => {
        if (ACTIONS.find(a => a.id === actionId)?.available) {
            onActionSelect(actionId);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
            <div className="bg-gray-900/95 backdrop-blur-xl w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white">O que você quer fazer?</h2>
                        <p className="text-sm text-gray-400 mt-1">Escolha uma ação rápida</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="text-white" size={24} />
                    </button>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {ACTIONS.map(action => {
                        const Icon = action.icon;
                        const isAvailable = action.available;

                        return (
                            <button
                                key={action.id}
                                onClick={() => handleActionClick(action.id)}
                                disabled={!isAvailable}
                                className={`relative p-6 rounded-2xl transition-all ${isAvailable
                                        ? `bg-gradient-to-br ${action.gradient} hover:scale-105 active:scale-95 shadow-lg`
                                        : 'bg-white/5 opacity-40 cursor-not-allowed'
                                    }`}
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-3">
                                    <Icon className="text-white" size={32} strokeWidth={2.5} />
                                </div>

                                {/* Label */}
                                <div className="text-center text-white font-bold text-sm">
                                    {action.label}
                                </div>

                                {/* "Em breve" badge */}
                                {!isAvailable && (
                                    <div className="absolute top-2 right-2 bg-gray-800 px-2 py-1 rounded-full">
                                        <span className="text-xs text-gray-400 font-bold">Em Breve</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Cancel Button */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-3 bg-white/5 rounded-xl text-white font-bold hover:bg-white/10 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
