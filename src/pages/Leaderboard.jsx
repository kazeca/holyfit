import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Crown, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'users'),
            orderBy('totalPoints', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pb-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-purple"></div>
            </div>
        );
    }

    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <div className="min-h-screen pb-24 pt-6 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white italic tracking-tighter">
                    RANKING
                </h1>
                <div className="bg-neon-purple/20 px-3 py-1 rounded-full border border-neon-purple/30">
                    <span className="text-neon-purple text-xs font-bold">TEMPORADA 1</span>
                </div>
            </div>

            {/* Podium */}
            <div className="flex justify-center items-end gap-4 mb-10 mt-4">
                {/* 2nd Place */}
                {top3[1] && (
                    <div className="flex flex-col items-center w-1/3">
                        <div className="relative mb-2">
                            <img
                                src={top3[1].photoURL || `https://ui-avatars.com/api/?name=${top3[1].displayName}&background=random`}
                                alt={top3[1].displayName}
                                className="w-16 h-16 rounded-full border-2 border-gray-400 object-cover"
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                2º
                            </div>
                        </div>
                        <div className="h-24 w-full bg-gradient-to-t from-gray-800 to-gray-900 rounded-t-lg flex flex-col items-center justify-end pb-2 border-t border-gray-700">
                            <span className="font-bold text-white text-sm truncate w-full text-center px-1">{top3[1].displayName.split(' ')[0]}</span>
                            <span className="text-gray-400 text-xs">{top3[1].totalPoints} pts</span>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className="flex flex-col items-center w-1/3 z-10">
                        <div className="relative mb-2">
                            <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 animate-bounce" size={24} />
                            <img
                                src={top3[0].photoURL || `https://ui-avatars.com/api/?name=${top3[0].displayName}&background=random`}
                                alt={top3[0].displayName}
                                className="w-20 h-20 rounded-full border-4 border-yellow-400 object-cover shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                            />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-0.5 rounded-full">
                                1º
                            </div>
                        </div>
                        <div className="h-32 w-full bg-gradient-to-t from-neon-purple/20 to-neon-purple/5 rounded-t-lg flex flex-col items-center justify-end pb-4 border-t border-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                            <span className="font-bold text-white truncate w-full text-center px-1">{top3[0].displayName.split(' ')[0]}</span>
                            <span className="text-neon-purple font-bold text-sm">{top3[0].totalPoints} pts</span>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className="flex flex-col items-center w-1/3">
                        <div className="relative mb-2">
                            <img
                                src={top3[2].photoURL || `https://ui-avatars.com/api/?name=${top3[2].displayName}&background=random`}
                                alt={top3[2].displayName}
                                className="w-16 h-16 rounded-full border-2 border-orange-700 object-cover"
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                3º
                            </div>
                        </div>
                        <div className="h-20 w-full bg-gradient-to-t from-gray-800 to-gray-900 rounded-t-lg flex flex-col items-center justify-end pb-2 border-t border-gray-700">
                            <span className="font-bold text-white text-sm truncate w-full text-center px-1">{top3[2].displayName.split(' ')[0]}</span>
                            <span className="text-gray-400 text-xs">{top3[2].totalPoints} pts</span>
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {rest.map((user, index) => (
                    <div key={user.id} className="glass p-3 rounded-xl flex items-center gap-4 border border-white/5">
                        <span className="font-bold text-gray-500 w-6 text-center">{index + 4}</span>
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover bg-gray-800"
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-sm">{user.displayName}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Streak: {user.currentStreak} dias</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-neon-fuchsia">{user.totalPoints}</span>
                            <span className="text-[10px] text-gray-500 uppercase">Pontos</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
