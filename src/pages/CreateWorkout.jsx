import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Save } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast, ToastContainer } from '../components/Toast';

const CreateWorkout = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(30);
    const [calories, setCalories] = useState(300);
    const [exercises, setExercises] = useState([{ name: '', sets: 3, reps: 12 }]);
    const [loading, setLoading] = useState(false);
    const { toasts, removeToast, success, error } = useToast();

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: 3, reps: 12 }]);
    };

    const removeExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const updateExercise = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const handleSave = async () => {
        if (!title || exercises.some(ex => !ex.name)) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'custom_workouts'), {
                userId: auth.currentUser.uid,
                title,
                duration: Number(duration),
                calories: Number(calories),
                exercises,
                imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80', // Default image
                createdAt: serverTimestamp()
            });
            success('Treino criado com sucesso!');
            setTimeout(() => navigate('/workouts'), 1000);
        } catch (error) {
            console.error("Error creating workout:", error);
            error('Erro ao criar treino');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-24 pt-6 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Criar Treino</h1>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm">
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome do Treino</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Treino de Peito Insano"
                            className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duração (min)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Calorias</label>
                            <input
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Exercícios</h2>
                        <button onClick={addExercise} className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-500 rounded-full">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {exercises.map((ex, i) => (
                            <div key={i} className="flex gap-2 items-start animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={ex.name}
                                        onChange={(e) => updateExercise(i, 'name', e.target.value)}
                                        placeholder="Nome do exercício"
                                        className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 font-medium text-gray-900 dark:text-white outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={ex.sets}
                                            onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                                            placeholder="Séries"
                                            className="w-20 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm font-medium text-gray-900 dark:text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={ex.reps}
                                            onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                                            placeholder="Reps"
                                            className="w-20 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm font-medium text-gray-900 dark:text-white outline-none"
                                        />
                                    </div>
                                </div>
                                <button onClick={() => removeExercise(i)} className="p-3 text-red-400 hover:text-red-500">
                                    <Trash size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div> : <><Save size={20} /> Criar Treino</>}
                </button>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default CreateWorkout;
