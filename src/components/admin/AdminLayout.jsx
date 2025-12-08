import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, Award, Bell, BarChart, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <Users size={20} />, label: 'Usuários', path: '/admin/users' },
        { icon: <Trophy size={20} />, label: 'Temporadas', path: '/admin/seasons' },
        { icon: <Award size={20} />, label: 'Badges', path: '/admin/badges' },
        { icon: <Bell size={20} />, label: 'Notificações', path: '/admin/notifications' },
        { icon: <BarChart size={20} />, label: 'Analytics', path: '/admin/analytics' }
    ];

    return (
        <div className="flex h-screen bg-gray-950">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 overflow-hidden`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Trophy size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-lg whitespace-nowrap">Holy Fit</h1>
                            <p className="text-gray-400 text-xs whitespace-nowrap">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive
                                    ? 'bg-purple-500/20 text-purple-400 font-bold'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all whitespace-nowrap"
                    >
                        <ArrowLeft size={20} />
                        <span>Voltar ao App</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all whitespace-nowrap"
                    >
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed top-4 left-4 z-50 w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-all"
                    title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
