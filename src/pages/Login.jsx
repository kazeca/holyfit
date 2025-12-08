import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { Trophy, Zap } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Check and reset daily calories if it's a new day
    const checkAndResetDailyCalories = async (userId) => {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const userData = userSnap.data();
            const today = new Date().toISOString().split('T')[0]; // "2025-12-08"
            const lastReset = userData.lastCalorieReset || '2000-01-01';

            // If it's a new day, reset calories
            if (lastReset !== today) {
                console.log('🔄 Novo dia detectado! Resetando calorias...');
                console.log(`Último reset: ${lastReset}, Hoje: ${today}`);
                await updateDoc(userRef, {
                    caloriesBurnedToday: 0,
                    lastCalorieReset: today
                });
                console.log('✅ Calorias resetadas para 0!');
            } else {
                console.log('✅ Calorias já resetadas hoje');
            }
        } catch (error) {
            console.error('❌ Erro ao resetar calorias:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            console.log('🔐 Iniciando login com Google...');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log('✅ Login Google bem-sucedido:', user.email);

            // Check if user exists, if not create
            const userRef = doc(db, 'users', user.uid);
            console.log('📝 Verificando se usuário existe no Firestore...');

            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.log('🆕 Criando novo usuário no Firestore...');
                const today = new Date().toISOString().split('T')[0];

                // Check if this is the first user (make them admin)
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const isFirstUser = usersSnapshot.empty;

                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    totalPoints: 0,
                    seasonPoints: 0,
                    level: 1,
                    currentStreak: 0,
                    longestStreak: 0,
                    workoutsCompleted: 0,
                    caloriesBurnedToday: 0,
                    lastCalorieReset: today,
                    lastCheckinDate: null,
                    createdAt: new Date().toISOString(),
                    badges: [],
                    streakShields: 0,
                    role: isFirstUser ? 'admin' : 'user' // First user is admin!
                });

                if (isFirstUser) {
                    console.log('👑 Você é o primeiro usuário! Admin role concedido!');
                }
                console.log('✅ Usuário criado com sucesso!');
            } else {
                console.log('✅ Usuário já existe, fazendo login...');
            }

            // Check and reset daily calories if needed
            await checkAndResetDailyCalories(user.uid);

            console.log('🚀 Redirecionando para dashboard...');
            navigate('/');
        } catch (err) {
            console.error('❌ Erro no login:', err);
            console.error('Código do erro:', err.code);
            console.error('Mensagem:', err.message);

            if (err.code === 'auth/popup-closed-by-user') {
                setError('Login cancelado. Tente novamente.');
            } else if (err.code === 'auth/unauthorized-domain') {
                setError('Domínio não autorizado. Entre em contato com o suporte.');
            } else if (err.code === 'permission-denied') {
                setError('Erro de permissão. Tente fazer logout e login novamente.');
            } else {
                setError(`Erro: ${err.message || 'Falha ao fazer login. Tente novamente.'}`);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
            {/* Background Shapes */}
            <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-neon-purple/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-neon-fuchsia/10 rounded-full blur-[100px]"></div>

            <div className="z-10 flex flex-col items-center w-full max-w-md">
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 rotate-3 border border-gray-100">
                        <Trophy size={40} className="text-neon-purple" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">
                        HOLY FIT
                    </h1>
                    <p className="text-gray-500 text-lg">Sua jornada fitness,<br />agora social e gamificada.</p>
                </div>

                <div className="w-full bg-white p-8 rounded-3xl shadow-soft border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Comece agora</h2>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 bg-white rounded-full p-0.5" />
                        Entrar com Google
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-500 text-sm text-center rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-8 flex items-center gap-2 text-gray-400 text-xs">
                    <Zap size={14} />
                    <span>Powered by React & Firebase</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
