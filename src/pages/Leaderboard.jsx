import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Crown, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('totalPoints', 'desc'), limit(50));
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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div></div>;

    const topThree = users.slice(0, 3);
    const rest = users.slice(3);

    const PodiumItem = ({ user, rank }) => {
        if (!user) return null;

        let rankStyles = '';
        let icon = null;
        let height = '';
        let order = '';

        if (rank === 1) {
            rankStyles = 'from-yellow-300 to-yellow-500 shadow-yellow-500/50 scale-110 z-10';
            icon = <Crown size={24} className="text-white drop-shadow-md" />;
            height = 'h-48';
            order = 'order-2';
        } else if (rank === 2) {
            rankStyles = 'from-gray-300 to-gray-400 shadow-gray-400/50';
            icon = <span className="text-white font-black text-lg">2</span>;
            height = 'h-40';
            order = 'order-1';
        } else if (rank === 3) {
            rankStyles = 'from-orange-300 to-orange-400 shadow-orange-400/50';
            icon = <span className="text-white font-black text-lg">3</span>;
            height = 'h-36';
            order = 'order-3';
        }

        return (
            <div className={`flex flex-col items-center ${order} w-1/3`}>
                <div className="relative mb-3">
                    <div className={`w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden ${rank === 1 ? 'w-24 h-24' : ''}`}>
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                            alt={user.displayName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${rankStyles} flex items-center justify-center shadow-lg border-2 border-white`}>
                        {icon}
                    </div>
                </div>

                <div className="text-center mt-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate w-24 mx-auto">{user.displayName?.split(' ')[0]}</h3>
                    <p className="text-neon-purple font-black text-lg">{user.totalPoints}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Points</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Leaderboard</h1>
                <div className="bg-white dark:bg-white/10 p-3 rounded-2xl shadow-soft">
                    <Trophy className="text-neon-purple" size={24} />
                </div>
            </div>

            {/* Podium */}
            <div className="flex items-end justify-center mb-10 px-2 gap-2">
                {users[1] && <PodiumItem user={users[1]} rank={2} />}
                {users[0] && <PodiumItem user={users[0]} rank={1} />}
                {users[2] && <PodiumItem user={users[2]} rank={3} />}
            </div>

            {/* List */}
            <div className="space-y-3">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 pl-2">Top Runners</h3>
                {rest.map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white dark:border-white/10 shadow-sm hover:shadow-md transition-all ${auth.currentUser?.uid === user.id ? 'ring-2 ring-neon-purple ring-offset-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}
                    >
                        <span className="text-gray-400 font-bold w-6 text-center text-sm">{index + 4}</span>

                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                alt={user.displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                {user.displayName || 'Atleta Anônimo'}
                            </h3>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                {user.currentStreak || 0} dias streak
                            </p>
                        </div>

                        <div className="text-right">
                            <span className="block text-sm font-black text-gray-900 dark:text-white">
                                {user.totalPoints}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">pts</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
