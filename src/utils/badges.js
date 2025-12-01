import { Trophy, Flame, Droplets, Zap, Crown, Target } from 'lucide-react';

export const BADGES = [
    {
        id: 'first_workout',
        label: 'Primeiro Passo',
        description: 'Completou o primeiro treino.',
        icon: Trophy,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        condition: (user, workouts) => workouts.length >= 1
    },
    {
        id: 'hydration_master',
        label: 'Hidratado',
        description: 'Bebeu 2L de água em um dia.',
        icon: Droplets,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        condition: (user) => user.hydrationToday >= 2000
    },
    {
        id: 'streak_7',
        label: 'Fogo Puro',
        description: 'Manteve ofensiva por 7 dias.',
        icon: Flame,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        condition: (user) => user.currentStreak >= 7
    },
    {
        id: 'level_5',
        label: 'Veterano',
        description: 'Alcançou o Nível 5.',
        icon: Crown,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        condition: (user) => user.level >= 5
    },
    {
        id: 'early_bird',
        label: 'Madrugador',
        description: 'Treinou antes das 8:00.',
        icon: Zap,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        condition: (user, workouts) => workouts.some(w => {
            const date = new Date(w.createdAt.seconds * 1000);
            return date.getHours() < 8;
        })
    }
];
