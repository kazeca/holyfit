import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, runTransaction, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, storage, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { isSameDay, subDays, parseISO } from 'date-fns';

const CheckIn = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Por favor, selecione uma foto do seu treino.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            // 1. Upload Image (SKIPPED FOR NOW due to Storage plan limits)
            // const storageRef = ref(storage, `workouts/${user.uid}/${Date.now()}_${file.name}`);
            // await uploadBytes(storageRef, file);
            // const imageUrl = await getDownloadURL(storageRef);

            // Using a placeholder image so the app works without Storage
            const imageUrl = "https://placehold.co/600x600/222/A855F7?text=Treino+Realizado";

            // 2. Transaction: Add workout & Update User Stats
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await transaction.get(userRef);

                if (!userDoc.exists()) {
                    throw new Error('Usuário não encontrado');
                }

                const userData = userDoc.data();
                const lastCheckin = userData.lastCheckinDate ? parseISO(userData.lastCheckinDate) : null;
                const today = new Date();

                // Check if already checked in today
                if (lastCheckin && isSameDay(lastCheckin, today)) {
                    // Optional: Prevent multiple check-ins or just allow without points?
                    // For this MVP, we'll allow it but maybe warn or just give points anyway as per simple requirements.
                    // "Ao salvar o treino, atualizar IMEDIATAMENTE o totalPoints (+10)"
                    // Let's assume we always give points for now to encourage activity.
                }

                // Streak Logic
                let newStreak = userData.currentStreak || 0;
                if (!lastCheckin) {
                    newStreak = 1;
                } else if (isSameDay(lastCheckin, subDays(today, 1))) {
                    newStreak += 1;
                } else if (!isSameDay(lastCheckin, today)) {
                    newStreak = 1; // Reset if missed a day
                }
                // If same day, keep streak same

                // Update User
                transaction.update(userRef, {
                    totalPoints: (userData.totalPoints || 0) + 10,
                    currentStreak: newStreak,
                    lastCheckinDate: today.toISOString()
                });

                // Add Workout
                const workoutRef = doc(collection(db, 'workouts'));
                transaction.set(workoutRef, {
                    userId: user.uid,
                    imageUrl: imageUrl,
                    createdAt: serverTimestamp(),
                    userName: user.displayName,
                    userPhoto: user.photoURL
                });
            });

            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Erro ao fazer check-in: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-24 pt-6 px-4 flex flex-col">
            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-8">
                CHECK-IN
            </h1>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="w-full aspect-[4/5] max-w-sm bg-gray-900 rounded-3xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center relative overflow-hidden group">
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => { setFile(null); setPreview(null); }}
                                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors"
                            >
                                X
                            </button>
                        </>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-800/50 transition-colors relative">
                            <div className="w-20 h-20 bg-neon-fuchsia/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform pointer-events-none">
                                <Camera size={40} className="text-neon-fuchsia" />
                            </div>
                            <span className="text-gray-400 font-medium pointer-events-none">Tirar foto ou Upload</span>
                            <span className="text-gray-600 text-xs mt-2 pointer-events-none">Mostre seu treino de hoje!</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 w-full max-w-sm">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className={`w-full max-w-sm py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all
            ${loading || !file
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-neon-purple to-neon-fuchsia text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] active:scale-95'
                        }`}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    ) : (
                        <>
                            <CheckCircle size={24} />
                            CONFIRMAR TREINO (+10 PTS)
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CheckIn;
