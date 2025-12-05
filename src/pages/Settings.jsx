import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Moon, Sun, Bell, LogOut, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast, ToastContainer } from '../components/Toast';

const Settings = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const user = auth.currentUser;

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [notifications, setNotifications] = useState(true);
    const [loading, setLoading] = useState(false);
    const { toasts, removeToast, success, error } = useToast();

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            await updateProfile(user, {
                displayName,
                photoURL
            });

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                displayName,
                photoURL
            });

            success('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error("Error updating profile:", error);
            error('Erro ao atualizar perfil.');
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
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Configurações</h1>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Perfil</h2>

                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4 group cursor-pointer">
                            <img
                                src={photoURL || `https://ui-avatars.com/api/?name=${displayName}`}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-800 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white drop-shadow-md" size={24} />
                            </div>
                        </div>
                        <input
                            type="text"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                            placeholder="URL da Foto"
                            className="w-full text-xs text-center text-gray-400 bg-transparent border-b border-gray-200 dark:border-gray-800 focus:border-blue-500 outline-none mb-4"
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome de Exibição</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Preferências</h2>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-500">
                                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">Tema Escuro</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-purple-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-500">
                                <Bell size={20} />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">Notificações</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifications ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div> : <><Save size={20} /> Salvar Alterações</>}
                </button>

                {message && (
                    <p className={`text-center text-sm font-medium ${message.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Settings;
