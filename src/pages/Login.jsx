import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Trophy } from 'lucide-react';

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
            setError('Falha ao fazer login. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-fuchsia/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="z-10 flex flex-col items-center w-full max-w-md">
                <div className="mb-12 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-neon-purple to-neon-fuchsia rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] mb-6 rotate-3">
                        <Trophy size={48} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tighter">
                        HOLY FIT
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Competição Fitness Social</p>
                </div>

                <div className="w-full glass p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Bem-vindo</h2>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                        Entrar com Google
                    </button>

                    {error && (
                        <p className="text-red-500 text-center mt-4 text-sm bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </p>
                    )}
                </div>

                <p className="text-gray-600 text-xs mt-8 text-center max-w-xs">
                    Ao entrar, você concorda em participar do ranking e compartilhar suas fotos de treino.
                </p>
            </div>
        </div>
    );
};

export default Login;
