import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Trophy, Crown, User, Camera } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/workouts', icon: Dumbbell, label: 'Treinos' },
        { path: '/checkin', icon: Camera, label: 'Check-in', isCenter: true }, // Center button
        { path: '/leaderboard', icon: Trophy, label: 'Ranking' },
        { path: '/profile', icon: User, label: 'Perfil' },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
            <nav className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {navItems.map(({ path, icon: Icon, label, isCenter }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `
                            relative flex items-center justify-center transition-all duration-300
                            ${isCenter
                                ? 'bg-gradient-to-tr from-rose-300 to-rose-400 text-white w-14 h-14 rounded-2xl shadow-lg shadow-rose-200 -mt-8 hover:scale-105 hover:-translate-y-1'
                                : isActive ? 'text-rose-400 scale-110' : 'text-gray-300 hover:text-gray-400'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={isCenter ? 28 : 24} strokeWidth={isActive || isCenter ? 2.5 : 2} />
                                {!isCenter && isActive && (
                                    <span className="absolute -bottom-2 w-1 h-1 bg-rose-400 rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default BottomNav;
