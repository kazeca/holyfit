import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, PlusCircle, User } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 pb-safe pt-2 px-6 flex justify-around items-center z-50 h-16">
            <Link to="/" className={`flex flex-col items-center transition-colors ${isActive('/') ? 'text-neon-purple' : 'text-gray-400'}`}>
                <Trophy size={24} />
                <span className="text-xs mt-1">Ranking</span>
            </Link>

            <Link to="/checkin" className="flex flex-col items-center -mt-8">
                <div className="bg-neon-fuchsia p-3 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.5)] border-4 border-black">
                    <PlusCircle size={32} color="white" />
                </div>
            </Link>

            <Link to="/profile" className={`flex flex-col items-center transition-colors ${isActive('/profile') ? 'text-neon-purple' : 'text-gray-400'}`}>
                <User size={24} />
                <span className="text-xs mt-1">Perfil</span>
            </Link>
        </nav>
    );
};

export default BottomNav;
