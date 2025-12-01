import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Activity, Droplets, Flame, Zap, Plus } from 'lucide-react';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
            {/* Header */}
            {/* Header - Premium Dark Card */}
            <div className="bg-[#1C1C1E] rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="relative">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                <Zap size={20} className="fill-white" />
                            </div>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-orange-500 border-2 border-[#1C1C1E] rounded-full"></span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight mb-3">
                                Hello, {auth.currentUser?.displayName?.split(' ')[0] || 'User'}!
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-orange-500/20">
                                    <Plus size={10} strokeWidth={4} /> 88% Healthy
                                </span>
                                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-blue-500/20">
                                    ★ Pro
                                </span>
                            </div>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-gray-800 overflow-hidden border-2 border-white/10 shadow-lg">
                            <img src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName || 'User'}`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Meta Diária (Orange) */}
                <div className="col-span-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] p-5 text-white shadow-[0_10px_30px_rgba(251,146,60,0.4)] relative overflow-hidden flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">Meta diária</span>
                        <Plus size={16} className="text-white/80" />
                    </div>

                    {/* Fake Bar Chart */}
                    <div className="flex items-end gap-1.5 h-16 opacity-80">
                        <div className="w-2 bg-white/30 h-[40%] rounded-t-sm"></div>
                        <div className="w-2 bg-white/30 h-[60%] rounded-t-sm"></div>
                        <div className="w-2 bg-white h-[100%] rounded-t-sm shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        <div className="w-2 bg-white/30 h-[50%] rounded-t-sm"></div>
                        <div className="w-2 bg-white/30 h-[30%] rounded-t-sm"></div>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black tracking-tighter">88<span className="text-xl align-top">%</span></h2>
                    </div>
                </div>

                {/* Hidratação (Blue) */}
                <div className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] p-5 text-white shadow-[0_10px_30px_rgba(59,130,246,0.4)] relative overflow-hidden flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">Hidratação</span>
                        <Droplets size={16} className="text-white/80" />
                    </div>

                    {/* Fake Line Chart */}
                    <svg className="w-full h-12 stroke-white fill-none stroke-[3px] opacity-90 drop-shadow-md" viewBox="0 0 100 40">
                        <path d="M0 30 C 20 10, 30 35, 50 15 S 70 30, 100 5" strokeLinecap="round" />
                    </svg>

                    <div>
                        <h2 className="text-3xl font-black tracking-tighter">781<span className="text-lg font-bold opacity-80">ml</span></h2>
                    </div>
                </div>

                {/* Desafio Diário (Dark) */}
                <div className="col-span-2 bg-[#1C1C1E] rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden h-48 flex flex-col justify-end group">
                    {/* Background Image */}
                    <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80" alt="Workout" className="absolute top-0 right-0 w-3/5 h-full object-cover opacity-60 mask-image-gradient" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

                    <div className="relative z-10 mb-2">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <ClockIcon size={12} /> 25min
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <Flame size={12} /> 412kcal
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold leading-tight mb-1">Upper Strength 2</h3>
                        <p className="text-gray-400 text-sm">8 Series Workout</p>
                    </div>

                    <button className="absolute bottom-6 right-6 w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </button>

                    <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider">
                        Intense
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClockIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default Dashboard;
