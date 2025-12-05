import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trophy, Calendar, Users, Award } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { useToast, ToastContainer } from '../../components/Toast';

const AdminSeasons = () => {
    const navigate = useNavigate();
    const [seasons, setSeasons] = useState([]);
    const [currentSeason, setCurrentSeason] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSeasonName, setNewSeasonName] = useState('');
    const { toasts, removeToast, success, error } = useToast();

    useEffect(() => {
        fetchSeasons();
    }, []);

    const fetchSeasons = async () => {
        try {
            const seasonsQuery = query(
                collection(db, 'seasons'),
                orderBy('createdAt', 'desc')
            );
            const seasonsSnap = await getDocs(seasonsQuery);
            const seasonsData = seasonsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setSeasons(seasonsData);

            // Find active season
            const active = seasonsData.find(s => s.status === 'active');
            setCurrentSeason(active);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching seasons:', err);
            error('Erro ao carregar temporadas');
            setLoading(false);
        }
    };

    const createSeason = async () => {
        if (!newSeasonName.trim()) {
            error('Digite um nome para a temporada');
            return;
        }

        // Check if there's already an active season
        if (currentSeason) {
            error('Finalize a temporada atual antes de criar uma nova');
            return;
        }

        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 21); // 21 days from now

            await addDoc(collection(db, 'seasons'), {
                name: newSeasonName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status: 'active',
                createdAt: serverTimestamp(),
                winners: []
            });

            // Reset all users' seasonPoints
            const usersSnap = await getDocs(collection(db, 'users'));
            const batch = [];
            usersSnap.docs.forEach(userDoc => {
                batch.push(
                    updateDoc(doc(db, 'users', userDoc.id), {
                        seasonPoints: 0
                    })
                );
            });
            await Promise.all(batch);

            success(`Temporada "${newSeasonName}" criada! Todos os pontos de temporada resetados.`);
            setShowCreateModal(false);
            setNewSeasonName('');
            fetchSeasons();
        } catch (err) {
            console.error('Error creating season:', err);
            error('Erro ao criar temporada');
        }
    };

    const endSeason = async (seasonId) => {
        if (!window.confirm('Tem certeza que deseja finalizar esta temporada?')) return;

        try {
            // Get top 3 users by seasonPoints
            const usersQuery = query(
                collection(db, 'users'),
                orderBy('seasonPoints', 'desc'),
                limit(3)
            );
            const usersSnap = await getDocs(usersQuery);
            const top3 = usersSnap.docs.map(doc => ({
                userId: doc.id,
                displayName: doc.data().displayName,
                seasonPoints: doc.data().seasonPoints,
                email: doc.data().email
            }));

            // Update season with winners
            await updateDoc(doc(db, 'seasons', seasonId), {
                status: 'ended',
                endedAt: serverTimestamp(),
                winners: top3
            });

            success('Temporada finalizada! Top 3 registrados.');
            fetchSeasons();
        } catch (err) {
            console.error('Error ending season:', err);
            error('Erro ao finalizar temporada');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950 font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin')}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white">Temporadas / Desafios</h1>
                    <p className="text-slate-400 text-sm">Gerenciar ciclos de 21 dias</p>
                </div>
            </div>

            {/* Current Season */}
            {currentSeason && (
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/50 rounded-3xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Trophy className="text-yellow-500" size={28} />
                            <div>
                                <h2 className="text-2xl font-black text-white">{currentSeason.name}</h2>
                                <p className="text-slate-300 text-sm">Temporada Ativa</p>
                            </div>
                        </div>
                        <button
                            onClick={() => endSeason(currentSeason.id)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-xl font-bold text-sm transition-all"
                        >
                            Finalizar Temporada
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-xl p-3">
                            <Calendar className="text-cyan-500 mb-1" size={20} />
                            <p className="text-white font-bold">{new Date(currentSeason.startDate).toLocaleDateString()}</p>
                            <p className="text-slate-400 text-xs">Início</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-3">
                            <Calendar className="text-orange-500 mb-1" size={20} />
                            <p className="text-white font-bold">{new Date(currentSeason.endDate).toLocaleDateString()}</p>
                            <p className="text-slate-400 text-xs">Fim (21 dias)</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create New Season */}
            {!currentSeason && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl p-6 text-white font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 mb-8"
                >
                    <Plus size={24} />
                    Criar Nova Temporada
                </button>
            )}

            {/* Past Seasons */}
            <div>
                <h2 className="text-xl font-black text-white mb-4">Histórico de Temporadas</h2>
                <div className="space-y-4">
                    {seasons.filter(s => s.status === 'ended').map(season => (
                        <div
                            key={season.id}
                            className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-white font-bold text-lg">{season.name}</h3>
                                    <p className="text-slate-400 text-sm">
                                        {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-slate-300 text-xs font-bold">
                                    Finalizada
                                </span>
                            </div>

                            {/* Winners */}
                            {season.winners && season.winners.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50">
                                    <p className="text-slate-400 text-xs font-bold mb-3">TOP 3 VENCEDORES:</p>
                                    <div className="space-y-2">
                                        {season.winners.map((winner, index) => (
                                            <div key={winner.userId} className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-yellow-500 text-white' :
                                                        index === 1 ? 'bg-gray-400 text-white' :
                                                            'bg-orange-600 text-white'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-bold text-sm">{winner.displayName || 'Usuário'}</p>
                                                    <p className="text-slate-500 text-xs">{winner.seasonPoints} XP</p>
                                                </div>
                                                <Award className={index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-600'} size={20} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {seasons.filter(s => s.status === 'ended').length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-slate-400">Nenhuma temporada finalizada ainda</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Season Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full">
                        <h3 className="text-2xl font-black text-white mb-4">Nova Temporada</h3>
                        <input
                            type="text"
                            value={newSeasonName}
                            onChange={(e) => setNewSeasonName(e.target.value)}
                            placeholder="Ex: Desafio Janeiro 2025"
                            className="w-full bg-slate-800 border border-slate-700/50 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-purple-500/50 mb-4"
                        />
                        <p className="text-slate-400 text-sm mb-6">
                            Duração: 21 dias automáticos<br />
                            Todos os pontos de temporada serão resetados
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewSeasonName('');
                                }}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={createSeason}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-all"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default AdminSeasons;
