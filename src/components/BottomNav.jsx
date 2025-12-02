import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Trophy, User, Plus } from 'lucide-react';
import ActionMenu from './ActionMenu';
import NewWorkoutModal from './NewWorkoutModal';
import MealModal from './MealModal';
import HydrationModal from './HydrationModal';

const BottomNav = () => {
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [showMealModal, setShowMealModal] = useState(false);
    const [showHydrationModal, setShowHydrationModal] = useState(false);

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/workouts', icon: Dumbbell, label: 'Treinos' },
        { path: '/leaderboard', icon: Trophy, label: 'Ranking' },
        { path: '/profile', icon: User, label: 'Perfil' },
    ];

    const handleActionSelect = (actionId) => {
        switch (actionId) {
            case 'workout':
                setShowWorkoutModal(true);
                break;
            case 'meal':
                setShowMealModal(true);
                break;
            case 'water':
                setShowHydrationModal(true);
                break;
            default:
                break;
        }
    };

    const handleModalSuccess = () => {
        // Reload dashboard or refresh data
        window.location.reload();
    };

    return (
        <>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    {navItems.slice(0, 2).map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `
                                relative flex items-center justify-center transition-all duration-300
                                ${isActive ? 'text-rose-400 scale-110' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-400'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && (
                                        <span className="absolute -bottom-2 w-1 h-1 bg-rose-400 rounded-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Center Action Button */}
                    <button
                        onClick={() => setShowActionMenu(true)}
                        className="relative bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white w-14 h-14 rounded-2xl shadow-lg shadow-purple-500/30 -mt-8 hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                    >
                        <Plus size={28} strokeWidth={2.5} />
                    </button>

                    {navItems.slice(2).map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `
                                relative flex items-center justify-center transition-all duration-300
                                ${isActive ? 'text-rose-400 scale-110' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-400'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && (
                                        <span className="absolute -bottom-2 w-1 h-1 bg-rose-400 rounded-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Action Menu */}
            {showActionMenu && (
                <ActionMenu
                    onClose={() => setShowActionMenu(false)}
                    onActionSelect={handleActionSelect}
                />
            )}

            {/* Modals */}
            {showWorkoutModal && (
                <NewWorkoutModal
                    onClose={() => setShowWorkoutModal(false)}
                    onSaveSuccess={handleModalSuccess}
                />
            )}

            {showMealModal && (
                <MealModal
                    onClose={() => setShowMealModal(false)}
                    onSaveSuccess={handleModalSuccess}
                />
            )}

            {showHydrationModal && (
                <HydrationModal
                    onClose={() => setShowHydrationModal(false)}
                    onSaveSuccess={handleModalSuccess}
                />
            )}
        </>
    );
};

export default BottomNav;
