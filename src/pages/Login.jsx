import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Trophy, Zap } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists, if not create
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    totalPoints: 0,
                    currentStreak: 0,
                    lastCheckinDate: null,
                    createdAt: new Date().toISOString()
                });
            }

            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Login cancelado. Tente novamente.');
            } else if (err.code === 'auth/unauthorized-domain') {
                setError('Domínio não autorizado. Adicione este IP no Firebase Console.');
            } else {
                setError('Falha ao fazer login. Tente novamente.');
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
