import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { Trophy, Crown, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ranking');
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const q = query(collection(db, 'users'), orderBy('totalPoints', 'desc'), limit(50));
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLeaderboard(users);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchFeed = async () => {
            try {
                // In a real app, we would have a 'feed' collection or a composite index on workouts
                // For MVP, we'll just mock it or try to fetch recent workouts if index exists
                // Let's mock for stability and speed as per user request for "MVP"
                const mockFeed = [
                    { id: 1, user: 'Alice', action: 'completou', target: 'Treino de Pernas', time: '2 min atrás', avatar: 'https://ui-avatars.com/api/?name=Alice' },
                    { id: 2, user: 'Bob', action: 'subiu para', target: 'Nível 5', time: '15 min atrás', avatar: 'https://ui-avatars.com/api/?name=Bob' },
                    { id: 3, user: 'Charlie', action: 'bebeu', target: '500ml de água', time: '1 hora atrás', avatar: 'https://ui-avatars.com/api/?name=Charlie' },
                    { id: 4, user: 'Diana', action: 'ganhou a medalha', target: 'Fogo Puro', time: '2 horas atrás', avatar: 'https://ui-avatars.com/api/?name=Diana' },
                ];
                setFeed(mockFeed);
            } catch (error) {
                console.error("Error fetching feed:", error);
            }
        };

        fetchLeaderboard();
        fetchFeed();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    const PodiumItem = ({ user, rank }) => {
        if (!user) return null;

        let rankStyles = '';
        let icon = null;
        let order = '';

        if (rank === 1) {
            rankStyles = 'from-yellow-300 to-yellow-500 shadow-yellow-500/50 scale-110 z-10';
            icon = <Crown size={24} className="text-white drop-shadow-md" />;
            order = 'order-2';
        } else if (rank === 2) {
            rankStyles = 'from-gray-300 to-gray-400 shadow-gray-400/50';
            icon = <span className="text-white font-black text-lg">2</span>;
            order = 'order-1';
        } else if (rank === 3) {
            rankStyles = 'from-orange-300 to-orange-400 shadow-orange-400/50';
            icon = <span className="text-white font-black text-lg">3</span>;
            order = 'order-3';
        }

        return (
            <div className={`flex flex-col items-center ${order} w-1/3`}>
                <div className="relative mb-3">
                    <div className={`w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden ${rank === 1 ? 'w-24 h-24' : ''}`}>
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                            alt={user.displayName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${rankStyles} flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800`}>
                        {icon}
                    </div>
                </div>

                <div className="text-center mt-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate w-24 mx-auto">{user.displayName?.split(' ')[0]}</h3>
                    <p className="text-purple-500 font-black text-lg">{user.totalPoints}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">XP</p>
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Lvl {user.level || 1}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen pb-24 pt-10 px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 italic tracking-tighter text-center">COMUNIDADE</h1>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8">
                <button
                    onClick={() => setActiveTab('ranking')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ranking' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Ranking
                </button>
                <button
                    onClick={() => setActiveTab('feed')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'feed' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Feed
                </button>
            </div>

            {activeTab === 'ranking' ? (
                <div>
                    {/* Podium */}
                    <div className="flex items-end justify-center mb-10 px-2 gap-2">
                        {topThree[1] && <PodiumItem user={topThree[1]} rank={2} />}
                        {topThree[0] && <PodiumItem user={topThree[0]} rank={1} />}
                        {topThree[2] && <PodiumItem user={topThree[2]} rank={3} />}
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 pl-2">Top Runners</h3>
                        {rest.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white dark:border-white/10 shadow-sm hover:shadow-md transition-all ${auth.currentUser?.uid === user.id ? 'ring-2 ring-purple-500 ring-offset-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}
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
                                    <span className="inline-block mt-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        Lvl {user.level || 1}
                                    </span>
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
            ) : (
                <div className="space-y-4">
                    {feed.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4">
                            <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">
                                    <span className="font-bold">{item.user}</span> {item.action} <span className="font-bold text-blue-500">{item.target}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
