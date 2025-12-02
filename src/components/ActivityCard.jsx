import React from 'react';
import { Dumbbell, Footprints, Flower, Bike, Swords, Flame, Clock, MapPin, Zap, Waves, Trash2 } from 'lucide-react';

const ICONS = {
    gym: Dumbbell,
    run: Footprints,
    yoga: Flower,
    bike: Bike,
    fight: Swords,
    crossfit: Flame,
    swim: Waves
};

const COLORS = {
    gym: 'text-blue-500 bg-blue-500/10',
    run: 'text-orange-500 bg-orange-500/10',
    yoga: 'text-emerald-500 bg-emerald-500/10',
    bike: 'text-cyan-500 bg-cyan-500/10',
    fight: 'text-red-500 bg-red-500/10',
    crossfit: 'text-yellow-500 bg-yellow-500/10',
    swim: 'text-sky-500 bg-sky-500/10'
};

const ActivityCard = ({ workout, onDelete }) => {
    const Icon = ICONS[workout.sportId] || Flame;
    const colorClass = COLORS[workout.sportId] || 'text-gray-500 bg-gray-500/10';

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white/10 transition-colors group relative">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{workout.sportName}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(workout.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold text-neon-purple">
                            {workout.calories} kcal
                        </span>
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(workout)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Excluir treino"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-500" />
                    <span className="font-bold">{workout.duration} min</span>
                </div>

                {workout.distance && (
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-500" />
                        <span className="font-bold">{workout.distance} km</span>
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    <Zap size={14} className="text-gray-500" />
                    <span className="capitalize">{workout.intensity === 'low' ? 'Leve' : workout.intensity === 'medium' ? 'Mod.' : 'Alta'}</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
