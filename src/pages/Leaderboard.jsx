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
                <div className="space-y-4">
                    {leaderboard.map((user, index) => (
                        <div key={user.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className={`w-8 h-8 flex items-center justify-center font-black text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-500' : 'text-gray-300'}`}>
                                {index + 1}
                            </div>
                            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt={user.displayName} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800" />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">{user.displayName}</h3>
                                <p className="text-xs text-gray-500 font-medium">Nível {user.level || 1}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-gray-900 dark:text-white">{user.totalPoints || 0}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">XP</p>
                            </div>
                        </div>
                    ))}
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
